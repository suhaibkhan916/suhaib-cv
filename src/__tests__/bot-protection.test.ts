// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs'
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

const robots = read('public/robots.txt')

function groups(txt: string) {
  const map = new Map<string, string[]>()
  let current: string[] = []
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) {
      current = []
      continue
    }
    const [key, ...rest] = line.split(':')
    const value = rest.join(':').trim()
    if (key.toLowerCase() === 'user-agent') {
      const rules: string[] = []
      map.set(value.toLowerCase(), rules)
      current = rules
    } else if (key.toLowerCase() === 'disallow' || key.toLowerCase() === 'allow') {
      current.push(`${key.toLowerCase()}: ${value}`)
    }
  }
  return map
}

const parsed = groups(robots)

describe('robots.txt', () => {
  it.each([
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'CCBot', 'Bytespider', 'Amazonbot', 'Applebot-Extended',
    'meta-externalagent', 'cohere-ai', 'Diffbot', 'DuckAssistBot', 'MistralAI-User', 'Scrapy', 'AhrefsBot', 'SemrushBot',
  ])('disallows %s', (bot) => {
    expect(parsed.get(bot.toLowerCase())).toEqual(['disallow: /'])
  })

  it('still welcomes everyone else, including search engines', () => {
    expect(parsed.get('*')).toEqual(['allow: /'])
    for (const engine of ['googlebot', 'bingbot', 'duckduckbot', 'linkedinbot', 'twitterbot', 'facebookexternalhit', 'slackbot']) {
      expect(parsed.has(engine)).toBe(false)
    }
  })

  it('keeps the sitemap line', () => {
    expect(robots).toContain('Sitemap: https://muhammadsuhaib.com/sitemap.xml')
  })
})

describe('AI opt-out signals', () => {
  it('adds noai to the robots meta tag without blocking indexing', () => {
    const tag = read('index.html').match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ''
    expect(tag).toContain('index')
    expect(tag).toContain('noai')
    expect(tag).toContain('noimageai')
    expect(tag).not.toMatch(/noindex|nofollow/)
  })

  it('sends the same signal as a response header', () => {
    const vercel = JSON.parse(read('vercel.json'))
    const header = vercel.headers[0].headers.find((h: { key: string }) => h.key === 'X-Robots-Tag')
    expect(header.value).toContain('noai')
    expect(header.value).not.toMatch(/noindex|nofollow/)
  })
})

describe('contact details are not harvestable', () => {
  const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/
  const phone = /\+44[\s-]?7\d{3}[\s-]?\d{6}|\b07\d{3}[\s-]?\d{6}\b/

  const sources = walk(join(root, 'src'))
    .filter((f) => /\.(ts|tsx)$/.test(f) && !f.includes('__tests__') && !/[\\/]test[\\/]/.test(f))
    .map((f) => f)
  const publicFiles = ['index.html', 'public/robots.txt', 'public/sitemap.xml', 'public/.well-known/security.txt', 'README.md']

  it('has no plain email address in the source code', () => {
    expect(sources.filter((f) => email.test(readFileSync(f, 'utf8')))).toEqual([])
  })

  it('has no plain phone number in the source code', () => {
    expect(sources.filter((f) => phone.test(readFileSync(f, 'utf8')))).toEqual([])
  })

  it('has no plain email or phone in files served to everyone', () => {
    expect(publicFiles.filter((f) => email.test(read(f)) || phone.test(read(f)))).toEqual([])
  })

  it('uses a contact route in security.txt that is not an email', () => {
    expect(read('public/.well-known/security.txt')).toMatch(/^Contact: https:\/\//m)
  })

  it('keeps the post-build scan that fails the deploy on plain contact details', () => {
    const script = read('scripts/security-check.mjs')
    expect(script).toContain('bots could harvest it')
    expect(script).toContain('noai')
  })
})
