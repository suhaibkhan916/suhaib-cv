import { useSyncExternalStore } from 'react'

const HUMAN_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'] as const

let human = false
const listeners = new Set<() => void>()

function markHuman() {
  if (human) return
  human = true
  HUMAN_EVENTS.forEach((e) => window.removeEventListener(e, markHuman))
  listeners.forEach((l) => l())
}

function arm() {
  human = false
  if (typeof window === 'undefined') return
  HUMAN_EVENTS.forEach((e) => window.removeEventListener(e, markHuman))
  // Browsers driven by automation report webdriver as true; they never count as a person.
  if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return
  HUMAN_EVENTS.forEach((e) => window.addEventListener(e, markHuman, { passive: true }))
}

arm()

export function resetHumanPresence() {
  arm()
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useHuman() {
  return useSyncExternalStore(subscribe, () => human, () => false)
}
