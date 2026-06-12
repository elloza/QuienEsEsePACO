const { copyFileSync, existsSync } = require('node:fs')
const { join } = require('node:path')

const indexPath = join(__dirname, '..', 'dist', 'index.html')
const fallbackPath = join(__dirname, '..', 'dist', '404.html')

if (!existsSync(indexPath)) {
  console.error('Cannot create SPA fallback: dist/index.html does not exist')
  process.exit(1)
}

copyFileSync(indexPath, fallbackPath)
console.log('Created dist/404.html for GitHub Pages SPA fallback')
