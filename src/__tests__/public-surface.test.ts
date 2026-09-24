// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    if (['node_modules', 'dist', '.git', '__tests__', 'test'].includes(name)) continue
    const p = join(dir, name)
    statSync(p).isDirectory() ? walk(p, out) : out.push(p)
  }
  return out
}

const shipped = [
  ...walk(join(root, 'src')),
  ...walk(join(root, 'scripts')),
  ...['index.html', 'README.md', 'package.json', 'vercel.json', 'public/robots.txt', 'public/sitemap.xml', 'public/.well-known/security.txt']
    .map((f) => join(root, f))
    .filter(existsSync),
].filter((f) => /\.(ts|tsx|mjs|json|html|md|txt|xml|css)$/.test(f))

const rel = (f: string) => relative(root, f).replace(/\\/g, '/')

// Files where AI tools appear only because they are skills listed on the CV.
const skillFiles = new Set(['src/data/resume.ts', 'src/data/techIcons.ts', 'src/components/TechMarquee.tsx', 'src/components/SkillOrbit.tsx'])

describe('public surface reads as hand-written', () => {
  it('has no generated-by markers, AI boilerplate or placeholder text', () => {
    const banned = /generated (?:with|by)|co-authored-by|as an ai\b|language model|lorem ipsum|\bTODO\b|\bFIXME\b|example\.com|your[- ]name here/i
    const hits = shipped.filter((f) => banned.test(readFileSync(f, 'utf8'))).map(rel)
    expect(hits).toEqual([])
  })

  it('mentions AI assistants only where they are listed as skills', () => {
    const tools = /claude|anthropic|chatgpt|openai|copilot|gemini/i
    const hits = shipped.filter((f) => !skillFiles.has(rel(f)) && tools.test(readFileSync(f, 'utf8'))).map(rel)
    expect(hits).toEqual([])
  })

  it('has no comments that talk about the task or the assistant', () => {
    const banned = /\/\/\s*(?:added|used by|for the|per the|as requested|per your)|\/\*\s*(?:added|as requested)/i
    const hits = shipped.filter((f) => /\.(ts|tsx|mjs)$/.test(f) && banned.test(readFileSync(f, 'utf8'))).map(rel)
    expect(hits).toEqual([])
  })

  it('uses no em dashes in page copy, metadata or the README', () => {
    const files = ['index.html', 'README.md', 'src/data/resume.ts', 'src/components/Contact.tsx', 'src/components/Hero.tsx', 'src/components/About.tsx']
    const hits = files.filter((f) => readFileSync(join(root, f), 'utf8').includes('—'))
    expect(hits).toEqual([])
  })

  it('does not credit a framework or tool in a visible footer', () => {
    const contact = readFileSync(join(root, 'src/components/Contact.tsx'), 'utf8')
    expect(contact).not.toMatch(/built with|powered by|made with/i)
  })

  it('has a README that describes the project plainly', () => {
    const readme = readFileSync(join(root, 'README.md'), 'utf8')
    expect(readme.length).toBeGreaterThan(200)
    expect(readme).not.toMatch(/framer motion|elevated resume|blazing|seamless|delve/i)
  })
})
