import { animate, stagger } from 'animejs'
import { useEffect, useMemo, useRef } from 'react'

const C = 100

interface Orbit {
  r: number
  dashed: boolean
  duration: number
  dir: 1 | -1
  start: number
}

const orbits: Orbit[] = [
  { r: 62, dashed: true, duration: 14000, dir: 1, start: 20 },
  { r: 71, dashed: false, duration: 22000, dir: -1, start: 140 },
  { r: 81, dashed: true, duration: 32000, dir: 1, start: 250 },
  { r: 91, dashed: false, duration: 46000, dir: -1, start: 60 },
]

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function OrbitSystem() {
  const root = useRef<SVGSVGElement>(null)

  const stars = useMemo(() => {
    const rand = seeded(42)
    return Array.from({ length: 22 }, () => {
      const angle = rand() * Math.PI * 2
      const radius = 58 + rand() * 40
      return {
        x: C + Math.cos(angle) * radius,
        y: C + Math.sin(angle) * radius,
        size: 0.35 + rand() * 0.75,
        sparkle: rand() > 0.78,
      }
    })
  }, [])

  useEffect(() => {
    const svg = root.current
    if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const runs: { revert: () => void }[] = []

    svg.querySelectorAll<SVGGElement>('[data-orbit]').forEach((el) => {
      const dir = Number(el.dataset.dir)
      const start = Number(el.dataset.start)
      runs.push(
        animate(el, {
          rotate: [start, start + 360 * dir],
          duration: Number(el.dataset.duration),
          ease: 'linear',
          loop: true,
        }),
      )
    })

    const moon = svg.querySelector<SVGGElement>('[data-moon]')
    if (moon) runs.push(animate(moon, { rotate: [0, -360], duration: 3800, ease: 'linear', loop: true }))

    runs.push(
      animate(svg.querySelectorAll('[data-star]'), {
        opacity: [0.1, 1],
        duration: 1700,
        delay: stagger(140),
        alternate: true,
        loop: true,
        ease: 'inOutSine',
      }),
    )

    return () => runs.forEach((r) => r.revert())
  }, [])

  return (
    <svg
      ref={root}
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -inset-[40%]"
      aria-hidden="true"
    >
      {orbits.map((o) => (
        <circle
          key={`path-${o.r}`}
          cx={C}
          cy={C}
          r={o.r}
          fill="none"
          stroke={o.dashed ? 'var(--accent)' : 'var(--border-strong)'}
          strokeWidth={o.dashed ? 0.28 : 0.35}
          strokeDasharray={o.dashed ? '1.2 2.6' : undefined}
          opacity={o.dashed ? 0.65 : 0.9}
        />
      ))}

      {stars.map((s, i) =>
        s.sparkle ? (
          <path
            key={i}
            data-star
            d={`M${s.x} ${s.y - 2.2} L${s.x + 0.5} ${s.y - 0.5} L${s.x + 2.2} ${s.y} L${s.x + 0.5} ${s.y + 0.5} L${s.x} ${s.y + 2.2} L${s.x - 0.5} ${s.y + 0.5} L${s.x - 2.2} ${s.y} L${s.x - 0.5} ${s.y - 0.5}Z`}
            fill="var(--accent-strong)"
          />
        ) : (
          <circle key={i} data-star cx={s.x} cy={s.y} r={s.size} fill="var(--text-muted)" />
        ),
      )}

      {/* Orbit 1: violet planet */}
      <g data-orbit data-dir={orbits[0].dir} data-start={orbits[0].start} data-duration={orbits[0].duration} style={{ transformOrigin: `${C}px ${C}px` }}>
        <circle cx={C + orbits[0].r} cy={C} r="2.3" fill="var(--accent-2)" />
      </g>

      {/* Orbit 2: amber planet with a moon */}
      <g data-orbit data-dir={orbits[1].dir} data-start={orbits[1].start} data-duration={orbits[1].duration} style={{ transformOrigin: `${C}px ${C}px` }}>
        <circle cx={C + orbits[1].r} cy={C} r="3.4" fill="#fbbf24" />
        <g data-moon style={{ transformOrigin: `${C + orbits[1].r}px ${C}px` }}>
          <circle cx={C + orbits[1].r + 6.5} cy={C} r="1.15" fill="var(--text)" opacity="0.85" />
        </g>
      </g>

      {/* Orbit 3: rose planet */}
      <g data-orbit data-dir={orbits[2].dir} data-start={orbits[2].start} data-duration={orbits[2].duration} style={{ transformOrigin: `${C}px ${C}px` }}>
        <circle cx={C + orbits[2].r} cy={C} r="2.7" fill="#fb7185" />
      </g>

      {/* Orbit 4: ringed planet + small companion */}
      <g data-orbit data-dir={orbits[3].dir} data-start={orbits[3].start} data-duration={orbits[3].duration} style={{ transformOrigin: `${C}px ${C}px` }}>
        <ellipse
          cx={C + orbits[3].r}
          cy={C}
          rx="7.2"
          ry="2"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.7"
          opacity="0.85"
          transform={`rotate(-22 ${C + orbits[3].r} ${C})`}
        />
        <circle cx={C + orbits[3].r} cy={C} r="3.9" fill="var(--accent)" />
        <circle cx={C - orbits[3].r} cy={C} r="1.6" fill="var(--accent-strong)" />
      </g>
    </svg>
  )
}
