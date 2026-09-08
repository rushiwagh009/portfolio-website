import sharp from 'sharp'
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import { join, extname, basename } from 'node:path'

const ASSETS_DIR = join(import.meta.dirname, '..', 'assets')

const RESIZE_OVERRIDES = {
  'rushi-profile1.png': 640,
  'guiness_world_record.png': 160,
}

for (const file of readdirSync(ASSETS_DIR)) {
  const ext = extname(file).toLowerCase()
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') continue

  const srcPath = join(ASSETS_DIR, file)
  const destPath = join(ASSETS_DIR, `${basename(file, ext)}.webp`)
  const before = statSync(srcPath).size

  let pipeline = sharp(srcPath)
  const maxWidth = RESIZE_OVERRIDES[file]
  if (maxWidth) pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true })

  await pipeline.webp({ quality: 85 }).toFile(destPath)
  const after = statSync(destPath).size
  unlinkSync(srcPath)

  console.log(
    `${file} -> ${basename(destPath)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
  )
}
