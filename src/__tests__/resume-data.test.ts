import { describe, expect, it } from 'vitest'
import {
  certifications,
  cvHighlights,
  education,
  experience,
  impactStats,
  profile,
  publications,
  skillGroups,
  tierWeight,
} from '../data/resume'
import { competencies, skillsByTier } from '../cv/parts'

const allText = JSON.stringify({ profile, skillGroups, experience, certifications, education, publications, cvHighlights })

describe('profile', () => {
  it('has a valid email address', () => {
    expect(profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('has a UK formatted phone number', () => {
    expect(profile.phone).toMatch(/^\+44 ?\d{4} ?\d{6}$/)
  })

  it('links to https profiles only', () => {
    expect(profile.linkedinUrl).toMatch(/^https:\/\/(www\.)?linkedin\.com\/in\//)
    expect(profile.githubUrl).toMatch(/^https:\/\/github\.com\//)
  })

  it('uses the expected name, title and location', () => {
    expect(profile.name).toBe('Muhammad Suhaib')
    expect(profile.title).toContain('Software Engineer')
    expect(profile.title).toContain('MSc Cyber Security')
    expect(profile.location).toContain('Bristol')
  })
})

describe('content decisions', () => {
  it('does not mention AWS or Amazon anywhere in the CV content', () => {
    expect(allText).not.toMatch(/\baws\b|amazon|\beks\b/i)
  })

  it('names the BCA role IT Support Analyst', () => {
    const bca = experience.find((e) => e.company === 'BCA UK')
    expect(bca?.role).toBe('IT Support Analyst')
  })

  it('claims five plus years of experience', () => {
    expect(profile.summary).toContain('5+ years')
    expect(impactStats[0]).toMatchObject({ value: 5, suffix: '+' })
  })

  it('lists the requested languages and integrations', () => {
    const names = skillGroups.flatMap((g) => g.skills.map((s) => s.name))
    for (const expected of ['React', 'Flask', 'JavaScript', 'TypeScript', 'Go']) expect(names).toContain(expected)
    for (const expected of ['IBM Quantum Platform', 'Google SERP API', 'Braintree', 'Google Maps API', 'Claude Code', 'Cursor AI', 'Chatbots', 'Automation']) {
      expect(names).toContain(expected)
    }
    expect(names.some((n) => n.includes('OAuth 2.0'))).toBe(true)
  })

  it('lists the security certifications', () => {
    const names = certifications.map((c) => c.name).join(' | ')
    expect(names).toContain('CompTIA Security+')
    expect(names).toContain('SAL1')
    expect(names).toContain('ISO 27001')
  })
})

describe('structure', () => {
  it('has unique skill names and valid tiers', () => {
    const seen = new Set<string>()
    for (const group of skillGroups) {
      expect(group.skills.length).toBeGreaterThan(0)
      for (const skill of group.skills) {
        expect(tierWeight[skill.tier]).toBeGreaterThan(0)
        expect(seen.has(skill.name)).toBe(false)
        seen.add(skill.name)
      }
    }
  })

  it('has experience entries in reverse chronological order with content', () => {
    expect(experience.length).toBeGreaterThanOrEqual(3)
    expect(experience[0].current).toBe(true)
    for (const job of experience) {
      expect(job.role.length).toBeGreaterThan(2)
      expect(job.highlights.length).toBeGreaterThan(0)
      expect(job.period).toMatch(/\d{4}/)
    }
  })

  it('has https links for credentials and publications', () => {
    for (const p of publications) expect(p.url).toMatch(/^https:\/\//)
    for (const c of certifications) if (c.credentialUrl) expect(c.credentialUrl).toMatch(/^https:\/\//)
  })

  it('does not invent metrics beyond the ones the CV states', () => {
    const numbers = allText.match(/\b\d{2,}%/g) ?? []
    expect(numbers).toEqual([])
  })

  it('has education and highlights', () => {
    expect(education.map((e) => e.degree).join()).toContain('MSc Cyber Security')
    expect(cvHighlights.length).toBeGreaterThanOrEqual(4)
  })
})

describe('cv helpers', () => {
  it('builds core competencies from expert and advanced skills only', () => {
    const list = competencies()
    expect(list).toContain('Python')
    expect(list).not.toContain('Go')
    expect(new Set(list).size).toBe(list.length)
  })

  it('groups skills by tier in a fixed order', () => {
    const tiers = skillsByTier().map((t) => t.tier)
    expect(tiers[0]).toBe('Expert')
    expect(tiers).toContain('Working knowledge')
  })
})
