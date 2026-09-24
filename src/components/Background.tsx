import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { CosmicCanvas } from './CosmicCanvas'
import { SkillOrbit } from './SkillOrbit'

export function Background() {
  const blobA = useRef<HTMLDivElement>(null)
  const blobB = useRef<HTMLDivElement>(null)
  const spotlight = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.to(blobA.current, {
        y: 240,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 },
      })
      gsap.to(blobB.current, {
        y: -280,
        x: -90,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 },
      })
    })

    let cleanup = () => {}
    const el = spotlight.current
    if (el && window.matchMedia('(pointer: fine)').matches) {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX - 260)
        yTo(e.clientY - 260)
      }
      window.addEventListener('pointermove', onMove)
      cleanup = () => window.removeEventListener('pointermove', onMove)
    }

    return () => {
      ctx.revert()
      cleanup()
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden no-print" aria-hidden="true">
      <CosmicCanvas />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />
      <div
        ref={blobA}
        className="absolute -top-40 left-1/2 h-[560px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'var(--accent-soft)' }}
      />
      <div
        ref={blobB}
        className="absolute top-[40vh] -right-40 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'var(--accent-2-soft)' }}
      />
      <SkillOrbit />
      <div
        ref={spotlight}
        className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--accent-soft), transparent 65%)', opacity: 0.8 }}
      />
    </div>
  )
}
