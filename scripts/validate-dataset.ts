import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

type FaceEntry = {
  id: string
  originalName: string
  spanishName: string
  gender: string
  image: string
  source?: string
}

type ValidationOptions = {
  manifestPath: string
  publicDir: string
  minNames: number
}

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

function fail(message: string): never {
  console.error(`Dataset validation failed: ${message}`)
  process.exit(1)
}

function assertRelativePublicPath(imagePath: string): void {
  if (imagePath.startsWith('/') || imagePath.includes('\\')) {
    fail(`image path must be a relative URL path without leading slash: ${imagePath}`)
  }

  const normalized = path.posix.normalize(imagePath)
  if (normalized.startsWith('../') || normalized === '..') {
    fail(`image path cannot escape public/: ${imagePath}`)
  }
}

async function validateDataset(options: ValidationOptions): Promise<void> {
  const manifestRaw = await readFile(options.manifestPath, 'utf8')
  const faces = JSON.parse(manifestRaw) as FaceEntry[]

  if (!Array.isArray(faces)) {
    fail('faces manifest must be a JSON array')
  }

  if (faces.length === 0) {
    fail('faces manifest is empty')
  }

  const ids = new Set<string>()
  const names = new Set<string>()

  for (const [index, face] of faces.entries()) {
    if (!face || typeof face !== 'object') {
      fail(`entry ${index} must be an object`)
    }

    if (!face.id || !face.originalName || !face.spanishName || !face.gender || !face.image) {
      fail(`entry ${index} must include id, originalName, spanishName, gender, and image`)
    }

    if (ids.has(face.id)) {
      fail(`duplicate id: ${face.id}`)
    }

    assertRelativePublicPath(face.image)

    const imageFile = path.join(options.publicDir, ...face.image.split('/'))
    await access(imageFile).catch(() => fail(`image file does not exist: ${face.image}`))

    ids.add(face.id)
    names.add(face.spanishName)
  }

  if (names.size < options.minNames) {
    fail(`expected at least ${options.minNames} distinct names, found ${names.size}`)
  }

  console.log(`Dataset validation OK: ${faces.length} faces, ${names.size} names`)
}

await validateDataset({
  manifestPath: path.resolve(readOption('--manifest', 'public/data/faces.json')),
  publicDir: path.resolve(readOption('--public-dir', 'public')),
  minNames: readNumberOption('--min-names', 4),
})
