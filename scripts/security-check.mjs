import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const failures = []
const fail = (msg) => failures.push(msg)

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (name === 'node_modules' || name === '.git') continue
    statSync(p).isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}

const dist = join(root, 'dist')
if (!existsSync(dist)) fail('dist/ not found. Run the build first.')
else {
  const files = walk(dist)

  if (files.some((f) => f.endsWith('.map'))) fail('Source maps found in dist/ (would expose source code).')

  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  const inlineScripts = [...html.matchAll(/<script(?![^>]*type="application\/ld\+json")(?![^>]*\ssrc=)[^>]*>/g)]
  if (inlineScripts.length) fail('Inline executable <script> found in index.html (breaks strict CSP).')

  const external = [...html.matchAll(/\s(?:src|href)="(https?:\/\/[^"]+)"/g)].map((m) => m[1])
  const allowedHosts = ['muhammadsuhaib.com']
  for (const url of external) {
    const host = new URL(url).hostname
    if (!allowedHosts.includes(host)) fail(`Third-party resource loaded by index.html: ${url}`)
  }

  const secretPatterns = [
    [/AKIA[0-9A-Z]{16}/, 'AWS access key'],
    [/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, 'private key'],
    [/sk_live_[0-9a-zA-Z]{10,}/, 'Stripe live key'],
    [/gh[pousr]_[A-Za-z0-9]{30,}/, 'GitHub token'],
    [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
    [/AIza[0-9A-Za-z_-]{35}/, 'Google API key'],
    [/AccountKey=[A-Za-z0-9+/=]{20,}/, 'Azure storage key'],
    [/(?:password|passwd|secret)["']?\s*[:=]\s*["'][^"']{6,}["']/i, 'hard-coded credential'],
  ]
  const textExt = new Set(['.js', '.css', '.html', '.json', '.txt', '.xml', '.svg'])
  for (const f of files.filter((f) => textExt.has(extname(f)))) {
    const content = readFileSync(f, 'utf8')
    for (const [re, label] of secretPatterns) if (re.test(content)) fail(`Possible ${label} in ${f.replace(root, '')}`)
  }

  const js = files.filter((f) => f.endsWith('.js')).map((f) => readFileSync(f, 'utf8')).join('\n')
  if (/document\.write\(/.test(js)) fail('document.write used in shipped JavaScript.')
}

let tracked = []
try {
  tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean)
} catch {
  // not a git checkout (for example on the build server), skip repository checks
}
if (tracked.length) {
  const bad = tracked.filter((f) => /(^|\/)\.env(\..*)?$/.test(f) || /\.(pem|key|p12|pfx)$/.test(f) || /db\.sqlite3$/.test(f))
  if (bad.length) fail(`Sensitive files tracked in git: ${bad.join(', ')}`)
}

const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
const headers = Object.fromEntries((vercel.headers?.[0]?.headers ?? []).map((h) => [h.key, h.value]))
for (const key of [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
]) {
  if (!headers[key]) fail(`Missing security header in vercel.json: ${key}`)
}
const csp = headers['Content-Security-Policy'] ?? ''
if (/(?<!wasm-)unsafe-eval/.test(csp)) fail("CSP allows 'unsafe-eval'.")
if (/script-src[^;]*'unsafe-inline'/.test(csp)) fail("CSP script-src allows 'unsafe-inline'.")
if (/font-src[^;]*data:/.test(csp)) fail('CSP font-src allows data: URIs.')
if (!/frame-ancestors 'none'/.test(csp)) fail('CSP is missing frame-ancestors none.')
if (!/object-src 'none'/.test(csp)) fail('CSP is missing object-src none.')

if (failures.length) {
  console.error('\nSecurity check FAILED:')
  failures.forEach((f) => console.error('  - ' + f))
  process.exit(1)
}
console.log('Security check passed.')
