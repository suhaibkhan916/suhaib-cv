import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const failures = []
const fail = (m) => failures.push(m)

const html = readFileSync(join(dist, 'index.html'), 'utf8')

const rootHtml = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/)?.[1] ?? ''
const words = rootHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
if (words < 400) fail(`Only ${words} words of content in the HTML sent to crawlers (expected 400+). Did the prerender step run?`)
if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) fail('Page must have exactly one <h1> in the static HTML.')
if ((html.match(/<h2[\s>]/g) ?? []).length < 5) fail('Static HTML should have at least five <h2> section headings.')
for (const must of ['Muhammad Suhaib', 'IT Support Analyst', 'Prismware Technologies', 'CompTIA Security+', 'Bristol']) {
  if (!rootHtml.includes(must)) fail(`Static HTML is missing "${must}".`)
}

const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
if (!title || title.length > 65) fail(`Title should be 1 to 65 characters (is ${title.length}).`)
const desc = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? ''
if (desc.length < 100 || desc.length > 165) fail(`Meta description should be 100 to 165 characters (is ${desc.length}).`)
if (!html.includes('<link rel="canonical" href="https://muhammadsuhaib.com/"')) fail('Missing canonical link.')
if (/noindex/i.test(html)) fail('Page contains a noindex directive.')

const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
try {
  const types = JSON.parse(ld ?? '{}')['@graph'].map((n) => n['@type'])
  for (const t of ['ProfilePage', 'WebSite', 'Person']) if (!types.includes(t)) fail(`Structured data is missing ${t}.`)
} catch {
  fail('Structured data is not valid JSON.')
}

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
if (!sitemap.includes('<loc>https://muhammadsuhaib.com/</loc>')) fail('Sitemap does not list the canonical URL.')
const lastmod = sitemap.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1]
if (!lastmod) fail('Sitemap has no lastmod date.')
if (!readFileSync(join(dist, 'robots.txt'), 'utf8').includes('Sitemap: https://muhammadsuhaib.com/sitemap.xml')) fail('robots.txt does not reference the sitemap.')

for (const asset of ['og-image.png', 'profile.webp', 'favicon.svg']) if (!existsSync(join(dist, asset))) fail(`Missing ${asset} in dist.`)

const key = readdirSync(dist).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
if (!key) fail('IndexNow key file is missing.')
else if (readFileSync(join(dist, key), 'utf8').trim() !== key.replace('.txt', '')) fail('IndexNow key file content does not match its name.')

if (failures.length) {
  console.error('\nSEO check FAILED:')
  failures.forEach((f) => console.error('  - ' + f))
  process.exit(1)
}
console.log(`SEO check passed (${words} words crawlable without JavaScript).`)
