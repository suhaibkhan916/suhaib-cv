import { useEffect, useRef, type ReactNode } from 'react'

export interface OrbitDef {
  r: number
  tilt: number
  roll: number
  speed: number
  dashed?: boolean
}

export interface BodyDef {
  key: string
  orbit: number
  phase: number
  size: number
  node: ReactNode
  hideBelow?: number
  dim?: number
  satellite?: { parent: string; r: number; speed: number; tilt: number }
}

interface Orbits3DProps {
  orbits: OrbitDef[]
  bodies: BodyDef[]
  className?: string
  ringOpacity?: number
  frontZ?: number
  backZ?: number
  minOpacity?: number
}

const RAD = Math.PI / 180

export function Orbits3D({
  orbits,
  bodies,
  className = '',
  ringOpacity = 0.35,
  frontZ = 6,
  backZ = 2,
  minOpacity = 0.4,
}: Orbits3DProps) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const wrappers = Array.from(el.querySelectorAll<HTMLElement>('[data-body]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const o = orbits.map((d) => ({
      ...d,
      sinT: Math.sin(d.tilt * RAD),
      cosT: Math.cos(d.tilt * RAD),
      sinR: Math.sin(d.roll * RAD),
      cosR: Math.cos(d.roll * RAD),
    }))

    let width = el.clientWidth
    let R = width / 2

    const sizeBodies = () => {
      width = el.clientWidth
      R = width / 2
      wrappers.forEach((w, i) => {
        const b = bodies[i]
        const px = Math.max(b.size * R, 14)
        w.style.width = `${px}px`
        w.style.height = `${px}px`
        w.style.display = b.hideBelow && width < b.hideBelow ? 'none' : ''
      })
    }

    const draw = (t: number) => {
      const placed = new Map<string, { x: number; y: number; z: number }>()

      bodies.forEach((b, i) => {
        const w = wrappers[i]
        const orbit = o[b.orbit]
        let x: number, y: number, z: number

        if (b.satellite) {
          const parent = placed.get(b.satellite.parent) ?? { x: 0, y: 0, z: 0 }
          const th = b.phase + b.satellite.speed * t
          const st = Math.sin(b.satellite.tilt * RAD)
          const ct = Math.cos(b.satellite.tilt * RAD)
          const sz = b.satellite.r * Math.sin(th)
          x = parent.x + b.satellite.r * Math.cos(th)
          y = parent.y + sz * st
          z = parent.z + sz * ct
        } else {
          const th = b.phase + orbit.speed * t
          const x0 = orbit.r * Math.cos(th)
          const z0 = orbit.r * Math.sin(th)
          const y1 = z0 * orbit.sinT
          x = x0 * orbit.cosR - y1 * orbit.sinR
          y = x0 * orbit.sinR + y1 * orbit.cosR
          z = z0 * orbit.cosT
        }

        placed.set(b.key, { x, y, z })

        const depth = Math.max(-1, Math.min(1, z))
        const near = (depth + 1) / 2
        const scale = 0.7 + 0.45 * near
        const px = w.offsetWidth
        w.style.transform = `translate3d(${x * R - px / 2}px, ${y * R - px / 2}px, 0) scale(${scale.toFixed(3)})`
        w.style.opacity = String(((b.dim ?? 1) * (minOpacity + (1 - minOpacity) * near)).toFixed(3))
        w.style.zIndex = String(z >= 0 ? frontZ : backZ)
      })
    }

    sizeBodies()
    const ro = new ResizeObserver(() => {
      sizeBodies()
      if (reduced) draw(0)
    })
    ro.observe(el)

    if (reduced) {
      draw(0)
      return () => ro.disconnect()
    }

    let raf = 0
    let last = performance.now()
    let t = 0
    let visible = true

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      t += dt
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(el)

    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [orbits, bodies, frontZ, backZ, minOpacity])

  return (
    <div ref={root} className={`pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full overflow-visible" style={{ zIndex: 1 }}>
        {orbits.map((d, i) => {
          const rx = d.r * 100
          const ry = rx * Math.sin(d.tilt * RAD)
          return (
            <g key={i} transform={`rotate(${d.roll})`}>
              <ellipse
                rx={rx}
                ry={ry}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={d.dashed ? '2 5' : undefined}
                opacity={ringOpacity * 0.7}
              />
            </g>
          )
        })}
      </svg>
      <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full overflow-visible" style={{ zIndex: 5 }}>
        {orbits.map((d, i) => {
          const rx = d.r * 100
          const ry = rx * Math.sin(d.tilt * RAD)
          return (
            <g key={i} transform={`rotate(${d.roll})`}>
              <path
                d={`M ${-rx} 0 A ${rx} ${ry} 0 0 0 ${rx} 0`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                strokeDasharray={d.dashed ? '2 5' : undefined}
                opacity={ringOpacity}
              />
            </g>
          )
        })}
      </svg>
      {bodies.map((b) => (
        <div key={b.key} data-body className="absolute left-0 top-0 will-change-transform" style={{ marginLeft: '50%', marginTop: '50%' }}>
          {b.node}
        </div>
      ))}
    </div>
  )
}
