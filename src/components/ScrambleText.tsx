import { useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

interface ScrambleTextProps {
  text: string
  className?: string
}

export function ScrambleText({ text, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)
  const played = useRef(false)

  const run = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    cancelAnimationFrame(frame.current)
    const total = 28
    let step = 0
    const tick = () => {
      step++
      const resolved = Math.floor((step / total) * text.length)
      setDisplay(
        text
          .split('')
          .map((ch, i) => (ch === ' ' || i < resolved ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (step < total) frame.current = requestAnimationFrame(tick)
      else setDisplay(text)
    }
    frame.current = requestAnimationFrame(tick)
  }, [text])

  useEffect(() => {
    if (inView && !played.current) {
      played.current = true
      run()
    }
    return () => cancelAnimationFrame(frame.current)
  }, [inView, run])

  return (
    <span ref={ref} className={className} aria-label={text} onMouseEnter={run}>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
