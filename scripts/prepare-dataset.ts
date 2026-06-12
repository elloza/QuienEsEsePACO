import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

type NameMap = Record<string, string>

type FaceEntry = {
  id: string
  originalName: string
  spanishName: string
  gender: string
  image: string
  source: string
}

type PrepareOptions = {
  inputDir: string
  facesOutputDir: string
  manifestPath: string
  nameMapPath: string
  source: string
  quality: number
  size: number
  limitPerName?: number
  clean: boolean
}

const supportedExtensions = new Set(['.avif', '.heic', '.heif', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff', '.webp'])
const ignoredDirectories = new Set(['.', 'images', 'image', 'faces', 'face', 'originals', 'dataset', 'names100dataset'])
const genderAliases = new Map([
  ['f', 'female'],
  ['female', 'female'],
  ['females', 'female'],
  ['woman', 'female'],
  ['women', 'female'],
  ['m', 'male'],
  ['male', 'male'],
  ['males', 'male'],
  ['man', 'male'],
  ['men', 'male'],
])
const minRecommendedBytes = 30 * 1024
const maxRecommendedBytes = 80 * 1024
const args = process.argv.slice(2)

function readOption(name: string, fallback: string): string {
  const inline = args.find((arg) => arg.startsWith(`${name}=`))
  if (inline) {
    return inline.slice(name.length + 1)
  }

  const index = args.indexOf(name)
  if (index >= 0 && args[index + 1]) {
    return args[index + 1]
  }

  const npmConfigName = `npm_config_${name.replace(/^--/, '').replaceAll('-', '_')}`
  return process.env[npmConfigName] ?? fallback
}

function readNumberOption(name: string, fallback: number): number {
  const value = Number(readOption(name, String(fallback)))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function readOptionalNumberOption(name: string): number | undefined {
  const inline = args.find((arg) => arg.startsWith(`${name}=`))
  if (inline) {
    const value = Number(inline.slice(name.length + 1))
    return Number.isFinite(value) && value > 0 ? value : undefined
  }

  const index = args.indexOf(name)
  if (index < 0 || !args[index + 1]) {
    return undefined
  }

  const value = Number(args[index + 1])
  if (Number.isFinite(value) && value > 0) {
    return value
  }

  const npmConfigName = `npm_config_${name.replace(/^--/, '').replaceAll('-', '_')}`
  const npmConfigValue = Number(process.env[npmConfigName])
  return Number.isFinite(npmConfigValue) && npmConfigValue > 0 ? npmConfigValue : undefined
}

function hasFlag(name: string): boolean {
  const npmConfigName = `npm_config_${name.replace(/^--/, '').replaceAll('-', '_')}`
  return args.includes(name) || process.env[npmConfigName] === 'true'
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toPosixPath(...parts: string[]): string {
  return parts.join('/').replaceAll('\\', '/')
}

async function readNameMap(nameMapPath: string): Promise<NameMap> {
  const raw = await readFile(nameMapPath, 'utf8')
  return JSON.parse(raw) as NameMap
}

function resolveSpanishName(sourceName: string, nameMap: NameMap): string {
  const direct = nameMap[sourceName]
  if (direct) {
    return direct
  }

  const normalized = sourceName.toLowerCase()
  const match = Object.entries(nameMap).find(([originalName]) => originalName.toLowerCase() === normalized)
  return match?.[1] ?? sourceName
}

function inferGender(relativeParts: string[]): string {
  for (const part of relativeParts) {
    const gender = genderAliases.get(part.toLowerCase())
    if (gender) {
      return gender
    }
  }

  return 'unknown'
}

function inferSourceName(relativeParts: string[], nameMap: NameMap): string {
  for (let index = relativeParts.length - 2; index >= 0; index -= 1) {
    const part = relativeParts[index]
    const normalized = part.toLowerCase()
    if (genderAliases.has(normalized) || ignoredDirectories.has(normalized)) {
      continue
    }

    if (nameMap[part] || Object.keys(nameMap).some((name) => name.toLowerCase() === normalized)) {
      return part
    }
  }

  return relativeParts.at(-2) ?? path.parse(relativeParts.at(-1) ?? 'unknown').name
}

async function collectImages(
  inputDir: string,
  nameMap: NameMap,
  currentDir = inputDir,
): Promise<Array<{ sourceName: string; gender: string; filePath: string }>> {
  const entries = await readdir(currentDir, { withFileTypes: true })
  const images: Array<{ sourceName: string; gender: string; filePath: string }> = []

  for (const entry of entries) {
    const entryPath = path.join(currentDir, entry.name)
    if (entry.isDirectory()) {
      images.push(...(await collectImages(inputDir, nameMap, entryPath)))
    } else if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
      const relativeParts = path.relative(inputDir, entryPath).split(path.sep)
      images.push({
        sourceName: inferSourceName(relativeParts, nameMap),
        gender: inferGender(relativeParts),
        filePath: entryPath,
      })
    }
  }

  return images
}

async function prepareDataset(options: PrepareOptions): Promise<void> {
  const nameMap = await readNameMap(options.nameMapPath)
  const sourceImages = await collectImages(options.inputDir, nameMap)

  if (sourceImages.length === 0) {
    throw new Error(`No supported images found in ${options.inputDir}`)
  }

  if (options.clean) {
    await rm(options.facesOutputDir, { force: true, recursive: true })
  }

  await mkdir(options.facesOutputDir, { recursive: true })

  const perNameCounts = new Map<string, number>()
  const faces: FaceEntry[] = []
  const sizeWarnings: string[] = []

  for (const image of sourceImages) {
    const spanishName = resolveSpanishName(image.sourceName, nameMap)
    const nameSlug = slugify(spanishName)
    const currentCount = perNameCounts.get(spanishName) ?? 0

    if (options.limitPerName && currentCount >= options.limitPerName) {
      continue
    }

    const nextCount = currentCount + 1
    const id = `${nameSlug}-${String(nextCount).padStart(4, '0')}`
    const fileName = `${id}.webp`
    const relativeImagePath = toPosixPath('faces', nameSlug, fileName)
    const outputDir = path.join(options.facesOutputDir, nameSlug)
    const outputPath = path.join(outputDir, fileName)

    await mkdir(outputDir, { recursive: true })
    await sharp(image.filePath)
      .rotate()
      .resize(options.size, options.size, { fit: 'cover', position: 'attention' })
      .webp({ quality: options.quality })
      .toFile(outputPath)

    const outputStats = await stat(outputPath)
    if (outputStats.size < minRecommendedBytes || outputStats.size > maxRecommendedBytes) {
      sizeWarnings.push(`${relativeImagePath}: ${Math.round(outputStats.size / 1024)} KB`)
    }

    faces.push({
      id,
      originalName: image.sourceName,
      spanishName,
      gender: image.gender,
      image: relativeImagePath,
      source: options.source,
    })

    perNameCounts.set(spanishName, nextCount)
  }

  const distinctNames = new Set(faces.map((face) => face.spanishName))
  if (distinctNames.size < 4) {
    throw new Error(`Prepared dataset must contain at least 4 distinct names; found ${distinctNames.size}`)
  }

  await mkdir(path.dirname(options.manifestPath), { recursive: true })
  await writeFile(options.manifestPath, `${JSON.stringify(faces, null, 2)}\n`, 'utf8')

  console.log(`Prepared ${faces.length} images for ${distinctNames.size} names`)
  console.log(`Manifest written to ${options.manifestPath}`)

  if (sizeWarnings.length > 0) {
    console.warn(`WebP size warning: ${sizeWarnings.length} files outside the recommended 30-80 KB range`)
    for (const warning of sizeWarnings.slice(0, 10)) {
      console.warn(`- ${warning}`)
    }
  }
}

await prepareDataset({
  inputDir: path.resolve(readOption('--input', 'datasets/originals')),
  facesOutputDir: path.resolve(readOption('--faces-output', 'public/faces')),
  manifestPath: path.resolve(readOption('--manifest', 'public/data/faces.json')),
  nameMapPath: path.resolve(readOption('--name-map', 'public/data/name-map.json')),
  source: readOption('--source', 'local'),
  quality: readNumberOption('--quality', 72),
  size: readNumberOption('--size', 512),
  limitPerName: readOptionalNumberOption('--limit-per-name'),
  clean: hasFlag('--clean'),
})
