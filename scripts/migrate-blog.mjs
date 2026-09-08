import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'

const SRC_DIR = join(import.meta.dirname, '..', 'legacy', 'blogs', 'terraform')
const DEST_DIR = join(import.meta.dirname, '..', 'content', 'blog', 'terraform')

// Maps the Obsidian embed's original (pre-M0-rename) filename to the
// converted WebP asset now served from public/assets/.
const IMAGE_MAP = {
  'terraform-chapter1.png.png': '/assets/terraform-chapter1.webp',
  'terraform-chapter-2.png.png': '/assets/terraform-chapter2.webp',
  'terraform-chapter3.png': '/assets/terraform-chapter3.webp',
  'terraform-module.png': '/assets/terraform-module.webp',
  'terraform-chapter6.png': '/assets/terraform-chapter6.webp',
}

mkdirSync(DEST_DIR, { recursive: true })

for (const file of readdirSync(SRC_DIR)) {
  if (!file.endsWith('.md')) continue
  let content = readFileSync(join(SRC_DIR, file), 'utf-8')

  // Image embeds: ![[.\assets\name.ext]] or ![[name.ext]]
  content = content.replace(/!\[\[(.*?)\]\]/g, (match, rawPath) => {
    const name = basename(rawPath.replace(/\\/g, '/'))
    const mapped = IMAGE_MAP[name]
    if (!mapped) {
      console.warn(
        `  no asset mapping for embed "${name}" in ${file} — dropping (was already broken in the legacy site)`,
      )
      return ''
    }
    return `![](${mapped})`
  })

  // Remaining (non-embed) wikilinks: [[Chapter N - Title]] -> decorative tag,
  // matching the plan's default (real cross-links are a future enhancement).
  const usesWikiTag = /\[\[(.*?)\]\]/.test(content)
  content = content.replace(/\[\[(.*?)\]\]/g, (_match, label) => `<WikiTag>${label}</WikiTag>`)

  if (usesWikiTag) {
    content = `import { WikiTag } from '../../../src/components/sections/Blog/WikiTag'\n\n${content}`
  }

  const destName = file.replace('.md', '.mdx')
  writeFileSync(join(DEST_DIR, destName), content)
  console.log(`${file} -> content/blog/terraform/${destName}`)
}
