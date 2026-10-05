import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../App'
import { profile } from '../data/resume'
import { resetHumanPresence } from '../hooks/useHuman'

const bullets = (value: string) => '\u2022'.repeat(value.length)
const webdriver = (value: boolean | undefined) =>
  Object.defineProperty(navigator, 'webdriver', { value, configurable: true })

afterEach(() => {
  webdriver(undefined)
  resetHumanPresence()
})

describe('contact details before a person interacts', () => {
  it('shows placeholders, not the email or phone number', () => {
    render(<App />)
    expect(document.body.textContent).not.toContain(profile.email)
    expect(document.body.textContent).not.toContain(profile.phone)
    expect(document.body.textContent).toContain(bullets(profile.email))
    expect(document.body.innerHTML).not.toContain(profile.email)
  })

  it('has no mailto or tel links yet', () => {
    render(<App />)
    expect(document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]')).toHaveLength(0)
    expect(document.querySelector('a[href="#contact"]')).toBeInTheDocument()
  })

  it('does not put the address in the command palette label', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')
    const dialog = await screen.findByRole('dialog', { name: /command palette/i })
    expect(within(dialog).getByText('Copy email address')).toBeInTheDocument()
    expect(dialog.textContent).not.toContain(profile.email)
  })
})

describe('contact details after a person interacts', () => {
  it.each([
    ['moves the mouse', (u: ReturnType<typeof userEvent.setup>) => u.pointer({ target: document.body, coords: { x: 5, y: 5 } })],
    ['presses a key', (u: ReturnType<typeof userEvent.setup>) => u.keyboard('a')],
    ['taps', (u: ReturnType<typeof userEvent.setup>) => u.pointer({ keys: '[MouseLeft]', target: document.body })],
  ])('reveals them when someone %s', async (_label, act) => {
    const user = userEvent.setup()
    render(<App />)
    await act(user)
    expect(await screen.findByText(profile.email)).toBeInTheDocument()
    expect(screen.getByText(profile.phone)).toBeInTheDocument()
    expect(document.querySelector(`a[href="mailto:${profile.email}"]`)).toBeInTheDocument()
    expect(document.querySelector('a[href^="tel:+447466"]')).toBeInTheDocument()
  })
})

describe('automated browsers', () => {
  it('never reveal the details, even if they dispatch input events', async () => {
    webdriver(true)
    resetHumanPresence()
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('abc')
    await user.pointer({ target: document.body, coords: { x: 10, y: 10 } })
    expect(document.body.textContent).not.toContain(profile.email)
    expect(document.body.textContent).not.toContain(profile.phone)
    expect(document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]')).toHaveLength(0)
  })
})
