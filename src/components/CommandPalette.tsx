import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCopy,
  FiCpu,
  FiDownload,
  FiGithub,
  FiHome,
  FiLinkedin,
  FiMail,
  FiMoon,
  FiSearch,
  FiUser,
} from 'react-icons/fi'
import { profile } from '../data/resume'
import { toggleTheme } from '../hooks/useTheme'

interface Command {
  id: string
  label: string
  hint: string
  icon: IconType
  run: () => void
}

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export const OPEN_PALETTE_EVENT = 'open-command-palette'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setIndex(0)
  }, [])

  const commands: Command[] = useMemo(
    () => [
      { id: 'top', label: 'Go to top', hint: 'Navigate', icon: FiHome, run: () => goTo('top') },
      { id: 'about', label: 'About', hint: 'Navigate', icon: FiUser, run: () => goTo('about') },
      { id: 'skills', label: 'Skills', hint: 'Navigate', icon: FiCpu, run: () => goTo('skills') },
      { id: 'experience', label: 'Experience', hint: 'Navigate', icon: FiBriefcase, run: () => goTo('experience') },
      { id: 'publications', label: 'Publications', hint: 'Navigate', icon: FiBookOpen, run: () => goTo('publications') },
      { id: 'education', label: 'Education & Certifications', hint: 'Navigate', icon: FiAward, run: () => goTo('education') },
      { id: 'contact', label: 'Contact', hint: 'Navigate', icon: FiMail, run: () => goTo('contact') },
      { id: 'theme', label: 'Toggle dark / light theme', hint: 'Action', icon: FiMoon, run: () => toggleTheme() },
      { id: 'pdf', label: 'Download CV as PDF', hint: 'Action', icon: FiDownload, run: () => window.print() },
      {
        id: 'copy',
        label: `Copy email (${profile.email})`,
        hint: 'Action',
        icon: FiCopy,
        run: () => void navigator.clipboard?.writeText(profile.email),
      },
      { id: 'gh', label: 'Open GitHub', hint: 'Link', icon: FiGithub, run: () => window.open(profile.githubUrl, '_blank', 'noreferrer') },
      { id: 'li', label: 'Open LinkedIn', hint: 'Link', icon: FiLinkedin, run: () => window.open(profile.linkedinUrl, '_blank', 'noreferrer') },
    ],
    [],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)) : commands
  }, [commands, query])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        close()
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen)
    }
  }, [close])

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  const execute = (cmd: Command | undefined) => {
    if (!cmd) return
    close()
    setTimeout(cmd.run, 120)
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      execute(results[index])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(3,6,12,0.6)' }} onClick={close} />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="gradient-border relative w-full max-w-lg overflow-hidden rounded-2xl border"
            style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)' }}
          >
            <div className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--border)' }}>
              <FiSearch size={16} style={{ color: 'var(--text-faint)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setIndex(0)
                }}
                onKeyDown={onInputKey}
                placeholder="Type a command or search…"
                className="w-full bg-transparent font-mono text-sm outline-none placeholder:opacity-50"
                style={{ color: 'var(--text)' }}
              />
              <kbd className="rounded border px-1.5 py-0.5 font-mono text-[10px]" style={{ borderColor: 'var(--border-strong)', color: 'var(--text-faint)' }}>
                esc
              </kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
                  No matching commands
                </li>
              )}
              {results.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => execute(cmd)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                    style={{
                      background: i === index ? 'var(--accent-soft)' : 'transparent',
                      color: i === index ? 'var(--accent-strong)' : 'var(--text)',
                    }}
                  >
                    <cmd.icon size={15} />
                    <span className="flex-1">{cmd.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                      {cmd.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
