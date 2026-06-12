const { copyFileSync, existsSync, mkdirSync } = require('node:fs')
const { dirname, join } = require('node:path')

const indexPath = join(__dirname, '..', 'dist', 'index.html')
const fallbackPath = join(__dirname, '..', 'dist', '404.html')
const routeIndexPaths = [join(__dirname, '..', 'dist', 'play', 'index.html'), join(__dirname, '..', 'dist', 'result', 'index.html')]

if (!existsSync(indexPath)) {
  console.error('Cannot create SPA fallback: dist/index.html does not exist')
  process.exit(1)
}

copyFileSync(indexPath, fallbackPath)
for (const routeIndexPath of routeIndexPaths) {
  mkdirSync(dirname(routeIndexPath), { recursive: true })
  copyFileSync(indexPath, routeIndexPath)
}

console.log('Created GitHub Pages SPA fallback files')
