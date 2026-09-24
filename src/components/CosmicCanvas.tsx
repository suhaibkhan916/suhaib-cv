import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  r: number
  tw: number
  ph: number
}

interface Packet {
  a: number
  b: number
  t: number
  speed: number
}

const LINK = 150

export function CosmicCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let stars: Star[] = []
    let nodes: number[] = []
    let px = new Float32Array(0)
    let py = new Float32Array(0)
    let packets: Packet[] = []
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null
    let nextShoot = 4
    const mouse = { x: -9999, y: -9999 }
    let scrollY = window.scrollY
    let raf = 0
    let last = performance.now()
    let time = 0

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const n = Math.round(Math.min(230, Math.max(70, (w * h) / 9000)))
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.25 + Math.random() * 0.75,
        r: 0.4 + Math.random() * 1.2,
        tw: 0.6 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
      }))
      nodes = stars.map((s, i) => (s.z > 0.6 ? i : -1)).filter((i) => i >= 0)
      px = new Float32Array(n)
      py = new Float32Array(n)
      packets = []
    }

    const project = () => {
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        let y = (s.y - scrollY * s.z * 0.14) % h
        if (y < 0) y += h
        py[i] = y
        px[i] = s.x + (mouse.x > -999 ? (mouse.x - w / 2) * s.z * 0.012 : 0)
      }
    }

    const draw = (dt: number) => {
      time += dt
      const light = document.documentElement.dataset.theme === 'light'
      const star = light ? '30,58,110' : '226,240,255'
      const line = light ? '8,145,178' : '34,211,238'
      const packetColor = light ? '#0891b2' : '#67e8f9'

      ctx.clearRect(0, 0, w, h)
      project()

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const a = (0.3 + 0.7 * s.z) * (0.55 + 0.45 * Math.sin(time * s.tw + s.ph)) * (light ? 0.7 : 1)
        ctx.fillStyle = `rgba(${star},${a.toFixed(3)})`
        ctx.beginPath()
        ctx.arc(px[i], py[i], s.r * s.z + 0.2, 0, Math.PI * 2)
        ctx.fill()
      }

      const edges: [number, number][] = []
      ctx.lineWidth = 0.6
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a + 1; b < nodes.length; b++) {
          const i = nodes[a]
          const j = nodes[b]
          const dx = px[i] - px[j]
          const dy = py[i] - py[j]
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            edges.push([i, j])
            ctx.strokeStyle = `rgba(${line},${((1 - d / LINK) * (light ? 0.3 : 0.26)).toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(px[i], py[i])
            ctx.lineTo(px[j], py[j])
            ctx.stroke()
          }
        }
      }

      if (mouse.x > -999) {
        for (let i = 0; i < stars.length; i++) {
          const d = Math.hypot(px[i] - mouse.x, py[i] - mouse.y)
          if (d < 170) {
            ctx.strokeStyle = `rgba(${line},${((1 - d / 170) * 0.5).toFixed(3)})`
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(px[i], py[i])
            ctx.stroke()
          }
        }
      }

      while (packets.length < 5 && edges.length) {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)]
        packets.push({ a, b, t: 0, speed: 0.35 + Math.random() * 0.5 })
      }
      packets = packets.filter((p) => {
        p.t += p.speed * dt
        if (p.t >= 1) return false
        const x = px[p.a] + (px[p.b] - px[p.a]) * p.t
        const y = py[p.a] + (py[p.b] - py[p.a]) * p.t
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7)
        g.addColorStop(0, packetColor)
        g.addColorStop(1, 'rgba(34,211,238,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, 7, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      nextShoot -= dt
      if (nextShoot <= 0 && !shoot) {
        shoot = { x: Math.random() * w * 0.8, y: Math.random() * h * 0.4, vx: 520, vy: 240, life: 1 }
        nextShoot = 7 + Math.random() * 8
      }
      if (shoot) {
        shoot.x += shoot.vx * dt
        shoot.y += shoot.vy * dt
        shoot.life -= dt * 1.1
        if (shoot.life <= 0) shoot = null
        else {
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 0.16, shoot.y - shoot.vy * 0.16)
          g.addColorStop(0, `rgba(${light ? '8,145,178' : '255,255,255'},${shoot.life.toFixed(2)})`)
          g.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.strokeStyle = g
          ctx.lineWidth = 1.6
          ctx.beginPath()
          ctx.moveTo(shoot.x, shoot.y)
          ctx.lineTo(shoot.x - shoot.vx * 0.16, shoot.y - shoot.vy * 0.16)
          ctx.stroke()
        }
      }
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.08)
      last = now
      draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (raf || reduced || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onScroll = () => {
      scrollY = window.scrollY
    }
    const onVisibility = () => (document.hidden ? stop() : start())

    init()
    if (reduced) draw(0)
    else start()

    window.addEventListener('resize', init)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0" />
}
