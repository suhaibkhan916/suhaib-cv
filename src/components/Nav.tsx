import { useState } from 'react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { profile } from '../data/resume'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'publications', label: 'Publications' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const activeId = useScrollSpy(links.map((l) => l.id))

  const handlePrint = () => window.print()

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md no-print"
      style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--bg) 80%, transparent)' }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <a
          href="#top"
          className="font-[var(--font-display)] text-sm font-semibold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          <span style={{ color: 'var(--accent)' }}>&lt;</span>
          {profile.initials}
          <span style={{ color: 'var(--accent)' }}>/&gt;</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="relative rounded-full px-3.5 py-1.5 font-mono text-[13px] transition-colors"
              style={{
                color: activeId === link.id ? 'var(--accent)' : 'var(--text-muted)',
                background: activeId === link.id ? 'var(--accent-soft)' : 'transparent',
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="hidden items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[13px] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:flex"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
          >
            <FiDownload size={13} /> PDF
          </button>
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-full border md:hidden"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="flex flex-col gap-1 border-t px-6 py-3 md:hidden"
          style={{ borderColor: 'var(--border)' }}
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 font-mono text-sm"
              style={{ color: activeId === link.id ? 'var(--accent)' : 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={handlePrint}
            className="mt-1 flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            <FiDownload size={13} /> Download PDF
          </button>
        </nav>
      )}
    </header>
  )
}
