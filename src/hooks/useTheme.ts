import { useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'

const listeners = new Set<() => void>()

function readInitial(): Theme {
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function current(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

document.documentElement.dataset.theme = readInitial()

function apply(next: Theme) {
  document.documentElement.dataset.theme = next
  window.localStorage.setItem('theme', next)
  listeners.forEach((l) => l())
}

export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = current() === 'dark' ? 'light' : 'dark'
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }

  if (!doc.startViewTransition || reduced) {
    apply(next)
    return
  }

  const x = origin?.x ?? window.innerWidth - 40
  const y = origin?.y ?? 30
  document.documentElement.style.setProperty('--vt-x', `${x}px`)
  document.documentElement.style.setProperty('--vt-y', `${y}px`)
  doc.startViewTransition(() => apply(next))
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'dark' as Theme)
  return { theme, toggle: toggleTheme }
}
