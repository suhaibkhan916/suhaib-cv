import { useEffect, useRef } from 'react'

export function Hud() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
      const az = String(Math.round((window.scrollY * 0.35) % 360)).padStart(3, '0')
      if (ref.current) ref.current.textContent = `SCAN ${String(pct).padStart(3, '0')}% · AZ ${az}° · SKILLS.ONLINE`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      ref={ref}
      className="no-print pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] tracking-[0.2em] xl:block"
      style={{ color: 'var(--text-faint)', writingMode: 'vertical-rl' }}
      aria-hidden="true"
    />
  )
}
