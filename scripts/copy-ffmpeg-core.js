const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const srcDir = path.join(projectRoot, 'node_modules', '@ffmpeg', 'core', 'dist')
const destDir = path.join(projectRoot, 'public', 'ffmpeg')

const files = ['ffmpeg-core.js', 'ffmpeg-core.wasm']

try {
  if (!fs.existsSync(srcDir)) {
    console.warn('[ffmpeg] core dist not found:', srcDir)
    process.exit(0)
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  for (const file of files) {
    const src = path.join(srcDir, file)
    const dest = path.join(destDir, file)
    if (!fs.existsSync(src)) {
      console.warn('[ffmpeg] missing file:', src)
      continue
    }
    fs.copyFileSync(src, dest)
  }

  console.log('[ffmpeg] core files copied to public/ffmpeg')
} catch (error) {
  console.warn('[ffmpeg] failed to copy core files:', error)
}
