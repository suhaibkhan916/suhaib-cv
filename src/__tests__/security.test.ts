// @vitest-environment node
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const read = (p: string) => readFileSync(join(root, p), 'utf8')

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    statSync(p).isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}
const sourceFiles = walk(join(root, 'src')).filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes('__tests__') && !f.includes(`${'test'}\\`))

const vercel = JSON.parse(read('vercel.json'))
const headerList: { key: string; value: string }[] = vercel.headers[0].headers
const header = (k: string) => headerList.find((h) => h.key === k)?.value ?? ''

describe('HTTP security headers (vercel.json)', () => {
  it.each([
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    'Cross-Origin-Opener-Policy',
  ])('sets %s', (key) => {
    expect(header(key)).not.toBe('')
  })

  it('enforces HTTPS for two years including subdomains', () => {
    const hsts = header('Strict-Transport-Security')
    expect(hsts).toContain('includeSubDomains')
    expect(Number(hsts.match(/max-age=(\d+)/)?.[1])).toBeGreaterThanOrEqual(31536000)
  })

  it('blocks framing, plugins and mime sniffing', () => {
    expect(header('X-Frame-Options')).toBe('DENY')
    expect(header('X-Content-Type-Options')).toBe('nosniff')
    expect(header('Content-Security-Policy')).toContain("frame-ancestors 'none'")
    expect(header('Content-Security-Policy')).toContain("object-src 'none'")
  })

  it('has a strict script policy with no eval and no inline scripts', () => {
    const csp = header('Content-Security-Policy')
    const script = csp.match(/script-src([^;]*)/)?.[1] ?? ''
    // 'wasm-unsafe-eval' only lets WebAssembly compile (needed by the PDF layout engine); it does not allow JS eval.
    expect(script.trim()).toBe("'self' 'wasm-unsafe-eval'")
    expect(csp).not.toMatch(/(?<!wasm-)unsafe-eval/)
    expect(script).not.toContain('unsafe-inline')
    expect(csp).not.toMatch(/(?:default|script)-src[^;]*\*/)
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).toContain('upgrade-insecure-requests')
  })

  it('does not allow any third-party origin in the CSP', () => {
    expect(header('Content-Security-Policy')).not.toMatch(/https?:\/\//)
  })

  it('disables powerful browser features', () => {
    const policy = header('Permissions-Policy')
    for (const feature of ['camera', 'microphone', 'geolocation', 'payment', 'usb']) expect(policy).toContain(`${feature}=()`)
  })

  it('caches hashed assets immutably', () => {
    const assets = vercel.headers.find((h: { source: string }) => h.source === '/assets/(.*)')
    expect(assets.headers[0].value).toContain('immutable')
  })

  it('gates deploys on tests and the security scan', () => {
    expect(vercel.buildCommand).toBe('npm run build:prod')
    const scripts = JSON.parse(read('package.json')).scripts
    expect(scripts['build:prod']).toContain('npm run test')
    expect(scripts['build:prod']).toContain('npm run security')
  })
})

describe('index.html', () => {
  const html = read('index.html')

  it('loads no third-party scripts, styles or fonts', () => {
    const external = [...html.matchAll(/\s(?:src|href)="(https?:\/\/[^"]+)"/g)].map((m) => new URL(m[1]).hostname)
    expect(external.filter((h) => h !== 'muhammadsuhaib.com')).toEqual([])
    expect(html).not.toMatch(/googleapis|gstatic|cdn\./)
  })

  it('has no inline executable scripts', () => {
    const inline = [...html.matchAll(/<script(?![^>]*\ssrc=)(?![^>]*application\/ld\+json)[^>]*>/g)]
    expect(inline).toHaveLength(0)
  })

  it('has valid structured data and a canonical URL', () => {
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1]
    const data = JSON.parse(json ?? '{}')
    expect(data['@type']).toBe('Person')
    expect(data.name).toBe('Muhammad Suhaib')
    expect(html).toContain('<link rel="canonical" href="https://muhammadsuhaib.com/" />')
  })

  it('does not advertise a generator', () => {
    expect(html).not.toMatch(/<meta[^>]+name="generator"/i)
  })
})

describe('security.txt', () => {
  const txt = read('public/.well-known/security.txt')

  it('has contact, expiry and canonical fields', () => {
    expect(txt).toMatch(/^Contact: mailto:/m)
    expect(txt).toMatch(/^Canonical: https:\/\/muhammadsuhaib\.com\/\.well-known\/security\.txt/m)
  })

  it('has not expired', () => {
    const expires = txt.match(/^Expires: (.+)$/m)?.[1] ?? ''
    expect(new Date(expires).getTime()).toBeGreaterThan(Date.now())
  })
})

describe('source code hygiene', () => {
  it('never uses dangerous DOM or code-execution APIs', () => {
    const banned = /dangerouslySetInnerHTML|\.innerHTML\s*=|document\.write\(|\beval\(|new Function\(|insertAdjacentHTML/
    const hits = sourceFiles.filter((f) => banned.test(readFileSync(f, 'utf8')))
    expect(hits).toEqual([])
  })

  it('opens every external new-tab link with noreferrer', () => {
    const offenders: string[] = []
    for (const f of sourceFiles) {
      const src = readFileSync(f, 'utf8')
      for (const tag of src.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) if (!/rel="[^"]*noreferrer/.test(tag)) offenders.push(`${f}: ${tag.slice(0, 60)}`)
      for (const call of src.match(/window\.open\([^)]*\)/g) ?? []) if (!call.includes('noreferrer')) offenders.push(`${f}: ${call}`)
    }
    expect(offenders).toEqual([])
  })

  it('uses no plain http links', () => {
    const hits = sourceFiles.filter((f) => /["'`]http:\/\/(?!localhost)/.test(readFileSync(f, 'utf8')))
    expect(hits).toEqual([])
  })

  it('contains no secrets or credentials', () => {
    const patterns = [/AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /sk_live_/, /gh[pousr]_[A-Za-z0-9]{30,}/, /AIza[0-9A-Za-z_-]{35}/, /xox[baprs]-/, /AccountKey=/]
    const files = [...sourceFiles, join(root, 'index.html'), join(root, 'vercel.json')]
    const hits = files.filter((f) => patterns.some((p) => p.test(readFileSync(f, 'utf8'))))
    expect(hits).toEqual([])
  })

  it('stores only the theme preference in the browser', () => {
    const uses = sourceFiles.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/localStorage\.\w+\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))
    expect(new Set(uses)).toEqual(new Set(['theme']))
  })
})

describe('repository hygiene', () => {
  it('ignores environment files and local Vercel config', () => {
    const ignore = read('.gitignore')
    expect(ignore).toContain('.vercel')
    expect(ignore).toContain('node_modules')
  })

  it('tracks no environment or key files', () => {
    let tracked: string[] = []
    try {
      tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n')
    } catch {
      return
    }
    expect(tracked.filter((f) => /(^|\/)\.env(\..*)?$|\.(pem|key|p12|pfx)$|db\.sqlite3$/.test(f))).toEqual([])
  })

  it('ships without source maps configured', () => {
    expect(read('vite.config.ts')).toContain('sourcemap: false')
  })

  it('has dependency update automation', () => {
    expect(existsSync(join(root, '.github/dependabot.yml'))).toBe(true)
  })
})
