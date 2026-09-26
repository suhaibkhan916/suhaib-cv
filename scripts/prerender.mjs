import { build } from 'esbuild'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const indexPath = join(dist, 'index.html')

if (!existsSync(indexPath)) {
  console.error('dist/index.html not found. Run the build first.')
  process.exit(1)
}

const cacheDir = join(root, 'node_modules', '.cache')
mkdirSync(cacheDir, { recursive: true })
const tmp = mkdtempSync(join(cacheDir, 'prerender-'))
const outfile = join(tmp, 'static-content.mjs')

try {
  await build({
    entryPoints: [join(root, 'src/seo/StaticContent.tsx')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'esm',
    jsx: 'automatic',
    packages: 'external',
    logLevel: 'silent',
  })

  const { StaticContent } = await import(pathToFileURL(outfile).href)
  const { createElement } = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const markup = renderToStaticMarkup(createElement(StaticContent))

  const html = readFileSync(indexPath, 'utf8')
  if (!html.includes('<div id="root"></div>')) {
    console.error('Expected an empty <div id="root"></div> in dist/index.html.')
    process.exit(1)
  }
  writeFileSync(indexPath, html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`))

  const sitemapPath = join(dist, 'sitemap.xml')
  if (existsSync(sitemapPath)) {
    const today = new Date().toISOString().slice(0, 10)
    const sitemap = readFileSync(sitemapPath, 'utf8').replace(/<lastmod>[^<]*<\/lastmod>\s*/g, '')
    writeFileSync(sitemapPath, sitemap.replace('<changefreq>', `<lastmod>${today}</lastmod>\n    <changefreq>`))
  }

  const words = markup.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  console.log(`Prerendered ${words} words of content into dist/index.html.`)
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
