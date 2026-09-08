import { chromium } from 'playwright'
import { preview } from 'vite'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

// Known static routes. Extended with /blog/* post routes once MDX migration lands (M2).
const ROUTES = ['/']

async function main() {
  const server = await preview({ preview: { port: 4174, host: '127.0.0.1' } })
  const base = 'http://127.0.0.1:4174'
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const route of ROUTES) {
    const separator = route.includes('?') ? '&' : '?'
    await page.goto(`${base}${route}${separator}__prerender=1`, { waitUntil: 'networkidle' })
    await page.waitForSelector('html[data-prerender-ready="true"]', { timeout: 15000 })
    const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)

    const outPath = route === '/' ? join('dist', 'index.html') : join('dist', route, 'index.html')
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, html)
    console.log(`Prerendered ${route} -> ${outPath}`)
  }

  await browser.close()
  await new Promise((resolve) => server.httpServer.close(resolve))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
