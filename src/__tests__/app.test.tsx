import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { experience, profile, skillGroups } from '../data/resume'

const downloadCv = vi.fn().mockResolvedValue(undefined)
vi.mock('../cv/generate', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../cv/generate')>()),
  downloadCv: (...args: unknown[]) => downloadCv(...args),
}))

beforeEach(() => {
  downloadCv.mockClear()
})

describe('page content', () => {
  it('has one h1 with the name and the required sections', () => {
    render(<App />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(profile.name)
    for (const id of ['about', 'skills', 'experience', 'publications', 'education', 'contact']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('shows the intro title and credentials', () => {
    render(<App />)
    expect(screen.getByText(profile.title)).toBeInTheDocument()
    expect(screen.getAllByText('CompTIA Security+').length).toBeGreaterThan(0)
    expect(screen.getAllByText('TryHackMe SAL1').length).toBeGreaterThan(0)
  })

  it('renders every job with the corrected BCA title', () => {
    render(<App />)
    const section = within(document.getElementById('experience')!)
    for (const job of experience) {
      expect(section.getByText(job.company, { exact: false })).toBeInTheDocument()
      expect(section.getByText(job.role)).toBeInTheDocument()
    }
    expect(section.getByText('IT Support Analyst')).toBeInTheDocument()
  })

  it('has only the name in the footer', () => {
    render(<App />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent(/^Muhammad Suhaib$/)
  })

  it('never shows AWS to visitors', () => {
    render(<App />)
    expect(document.body.textContent).not.toMatch(/\bAWS\b|Amazon/)
  })

  it('does not render any images without alt text', () => {
    render(<App />)
    for (const img of document.querySelectorAll('img')) expect(img).toHaveAttribute('alt')
  })
})

describe('skills filter', () => {
  it('shows every group by default and one group when filtered', async () => {
    const user = userEvent.setup()
    render(<App />)
    const skills = document.getElementById('skills')!
    expect(skills.querySelectorAll('h3')).toHaveLength(skillGroups.length)

    await user.click(within(skills).getByRole('tab', { name: 'Cyber Security' }))
    await waitFor(() => expect(skills.querySelectorAll('h3')).toHaveLength(1))
    expect(within(skills).getByRole('tab', { name: 'Cyber Security' })).toHaveAttribute('aria-selected', 'true')

    await user.click(within(skills).getByRole('tab', { name: 'All' }))
    await waitFor(() => expect(skills.querySelectorAll('h3')).toHaveLength(skillGroups.length))
  })
})

describe('theme', () => {
  it('toggles between dark and light and remembers the choice', async () => {
    const user = userEvent.setup()
    render(<App />)
    const start = document.documentElement.dataset.theme
    await user.click(screen.getByRole('button', { name: /switch to (light|dark) mode/i }))
    const next = document.documentElement.dataset.theme
    expect(next).not.toBe(start)
    expect(window.localStorage.getItem('theme')).toBe(next)
  })
})

describe('command palette', () => {
  it('opens with Ctrl+K, filters commands and closes with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')
    const dialog = await screen.findByRole('dialog', { name: /command palette/i })
    expect(within(dialog).getByText('Skills')).toBeInTheDocument()

    await user.type(within(dialog).getByRole('textbox'), 'linkedin')
    expect(within(dialog).getByText('Open LinkedIn')).toBeInTheDocument()
    expect(within(dialog).queryByText('Contact')).not.toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /command palette/i })).not.toBeInTheDocument())
  })

  it('shows a message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await screen.findByRole('textbox'), 'zzzzqq')
    expect(screen.getByText(/no matching commands/i)).toBeInTheDocument()
  })

  it('lists the three CV downloads', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')
    await user.type(await screen.findByRole('textbox'), 'download cv')
    expect(screen.getAllByRole('button', { name: /download cv:/i })).toHaveLength(3)
  })
})

describe('CV download menu', () => {
  it('offers three PDF formats and requests the chosen one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^cv$/i, expanded: false }))
    const items = await screen.findAllByRole('menuitem')
    expect(items.map((i) => i.textContent)).toEqual([
      expect.stringContaining('Photo sidebar CV'),
      expect.stringContaining('Classic ATS CV'),
      expect.stringContaining('Simple one-column CV'),
    ])
    await user.click(items[1])
    expect(downloadCv).toHaveBeenCalledWith('classic')
  })

  it('does not call the print dialog any more', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^cv$/i, expanded: false }))
    await user.click((await screen.findAllByRole('menuitem'))[0])
    expect(window.print).not.toHaveBeenCalled()
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^cv$/i, expanded: false }))
    await screen.findByRole('menu')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })
})

describe('contact', () => {
  it('copies the email address to the clipboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: new RegExp(profile.email.replace('.', '\\.')) }))
    expect(await navigator.clipboard.readText()).toBe(profile.email)
    expect(await screen.findByText('Copied')).toBeInTheDocument()
  })

  it('links to GitHub and LinkedIn safely', () => {
    render(<App />)
    const links = [...document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')]
    expect(links.length).toBeGreaterThan(0)
    for (const a of links) {
      expect(a.rel).toContain('noreferrer')
      expect(a.href).toMatch(/^https:\/\//)
    }
    expect(links.some((a) => a.href.startsWith(profile.githubUrl))).toBe(true)
    expect(links.some((a) => a.href.startsWith(profile.linkedinUrl))).toBe(true)
  })

  it('offers a working mailto link', () => {
    render(<App />)
    const mail = document.querySelector<HTMLAnchorElement>(`a[href="mailto:${profile.email}"]`)
    expect(mail).toBeInTheDocument()
  })
})
