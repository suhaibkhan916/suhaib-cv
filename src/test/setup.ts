import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

if (typeof window !== 'undefined') {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  class IntersectionObserverMock {
    cb: IntersectionObserverCallback
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb
    }
    observe(target: Element) {
      this.cb([{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry], this as never)
    }
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  vi.stubGlobal('ResizeObserver', ResizeObserverMock)

  HTMLCanvasElement.prototype.getContext = (() => null) as never
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn() as never
  window.print = vi.fn()

  afterEach(() => {
    cleanup()
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })
}
