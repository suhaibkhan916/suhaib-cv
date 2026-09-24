// @vitest-environment node
import { renderToBuffer } from '@react-pdf/renderer'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'
import { beforeAll, describe, expect, it } from 'vitest'
import { ClassicCv } from '../cv/ClassicCv'
import { PhotoCv } from '../cv/PhotoCv'
import { SimpleCv } from '../cv/SimpleCv'
import { cvOptions } from '../cv/generate'
import { experience, profile } from '../data/resume'

async function extract(buf: Buffer) {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), useSystemFonts: false, isEvalSupported: false }).promise
  let text = ''
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    text += (await page.getTextContent()).items.map((it) => ('str' in it ? it.str : '')).join(' ') + '\n'
  }
  return { pages: doc.numPages, text: text.replace(/\s+/g, ' ') }
}

const variants = [
  { id: 'photo', make: () => <PhotoCv /> },
  { id: 'classic', make: () => <ClassicCv /> },
  { id: 'simple', make: () => <SimpleCv /> },
] as const

const results: Record<string, { buf: Buffer; pages: number; text: string }> = {}

beforeAll(async () => {
  for (const v of variants) {
    const buf = await renderToBuffer(v.make())
    results[v.id] = { buf, ...(await extract(buf)) }
  }
}, 60000)

describe.each(variants)('$id CV', ({ id }) => {
  it('is a real PDF of a sensible size', () => {
    const { buf } = results[id]
    expect(buf.subarray(0, 5).toString()).toBe('%PDF-')
    expect(buf.length).toBeGreaterThan(4000)
    expect(buf.length).toBeLessThan(600_000)
  })

  it('fits on one or two A4 pages', () => {
    expect(results[id].pages).toBeGreaterThanOrEqual(1)
    expect(results[id].pages).toBeLessThanOrEqual(2)
  })

  it('has selectable text with the key details', () => {
    const { text } = results[id]
    expect(text.toLowerCase()).toContain(profile.name.toLowerCase())
    expect(text).toContain(profile.email)
    expect(text).toContain('IT Support Analyst')
    expect(text).toContain('Prismware Technologies')
    expect(text).toContain('CompTIA Security+')
    expect(text).toContain('MSc Cyber Security')
  })

  it('contains every job from the website', () => {
    for (const job of experience) expect(results[id].text).toContain(job.company)
  })

  it('never mentions AWS', () => {
    expect(results[id].text).not.toMatch(/\bAWS\b|Amazon|\bEKS\b/)
  })

  it('does not contain invented percentages', () => {
    expect(results[id].text).not.toMatch(/\b\d{2,}%/)
  })
})

describe('download options', () => {
  it('offers three formats with unique file names', () => {
    expect(cvOptions.map((o) => o.id)).toEqual(['photo', 'classic', 'simple'])
    const files = cvOptions.map((o) => o.file)
    expect(new Set(files).size).toBe(3)
    for (const f of files) expect(f).toMatch(/^Muhammad-Suhaib-CV-.+\.pdf$/)
  })
})
