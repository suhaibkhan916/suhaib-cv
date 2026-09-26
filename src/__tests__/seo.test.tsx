import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { experience, profile, skillGroups } from '../data/resume'
import { StaticContent } from '../seo/StaticContent'

const root = process.cwd()
const read = (p: string) => readFileSync(join(root, p), 'utf8')
const html = read('index.html')
const markup = renderToStaticMarkup(<StaticContent />)

describe('crawlable static content', () => {
  it('has one h1 and the main section headings', () => {
    expect(markup.match(/<h1>/g)).toHaveLength(1)
    for (const h of ['About', 'Skills', 'Experience', 'Publications', 'Education and Certifications', 'Contact']) {
      expect(markup).toContain(`<h2>${h}</h2>`)
    }
  })

  it('contains the name, role, location and every job', () => {
    expect(markup).toContain(profile.name)
    expect(markup).toContain('Bristol')
    for (const job of experience) expect(markup).toContain(job.company)
  })

  it('lists every skill', () => {
    for (const group of skillGroups) for (const skill of group.skills) expect(markup).toContain(skill.name.replace(/&/g, '&amp;'))
  })

  it('has plenty of text and no AWS or em dashes', () => {
    const words = markup.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    expect(words).toBeGreaterThan(400)
    expect(markup).not.toMatch(/\bAWS\b|Amazon|—/)
  })
})

describe('page metadata', () => {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1] ?? ''

  it('has a title of a sensible length that names the role and place', () => {
    expect(title.length).toBeGreaterThan(20)
    expect(title.length).toBeLessThanOrEqual(65)
    expect(title).toContain('Muhammad Suhaib')
    expect(title).toContain('Software Engineer')
    expect(title).toContain('Bristol')
  })

  it('has a description of a sensible length', () => {
    expect(description.length).toBeGreaterThanOrEqual(100)
    expect(description.length).toBeLessThanOrEqual(165)
  })

  it('keeps title and social titles in sync', () => {
    expect(html).toContain(`<meta property="og:title" content="${title}" />`)
    expect(html).toContain(`<meta name="twitter:title" content="${title}" />`)
  })

  it('allows indexing and points to one canonical address', () => {
    expect(html).not.toMatch(/noindex|nofollow/i)
    expect(html).toContain('<link rel="canonical" href="https://muhammadsuhaib.com/" />')
    expect(html).toContain('<meta property="og:url" content="https://muhammadsuhaib.com/" />')
    expect(html).toContain('lang="en-GB"')
  })

  it('links the profile page, website and person in structured data', () => {
    const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}'
    const graph = JSON.parse(json)['@graph'] as Record<string, unknown>[]
    const person = graph.find((n) => n['@type'] === 'Person') as Record<string, unknown>
    const page = graph.find((n) => n['@type'] === 'ProfilePage') as { mainEntity: { '@id': string } }
    expect(page.mainEntity['@id']).toBe(person['@id'])
    expect(person.sameAs).toEqual(expect.arrayContaining([profile.linkedinUrl, profile.githubUrl]))
  })
})

describe('crawler files', () => {
  it('has a robots.txt that allows crawling and lists the sitemap', () => {
    const robots = read('public/robots.txt')
    expect(robots).toMatch(/User-agent: \*\s+Allow: \//)
    expect(robots).not.toMatch(/Disallow:\s*\/\s*$/m)
    expect(robots).toContain('Sitemap: https://muhammadsuhaib.com/sitemap.xml')
  })

  it('has a sitemap for the canonical URL', () => {
    const sitemap = read('public/sitemap.xml')
    expect(sitemap).toContain('<loc>https://muhammadsuhaib.com/</loc>')
  })

  it('has an IndexNow key file whose content matches its name', () => {
    const file = readdirSync(join(root, 'public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
    expect(file).toBeDefined()
    expect(read(`public/${file}`).trim()).toBe(file!.replace('.txt', ''))
  })

  it('ships the images referenced by the metadata', () => {
    for (const f of ['public/og-image.png', 'public/profile.webp', 'public/favicon.svg']) expect(read(f).length).toBeGreaterThan(50)
  })
})
