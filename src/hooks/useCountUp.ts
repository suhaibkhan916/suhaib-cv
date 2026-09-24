import { animate } from 'animejs'
import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true

    const counter = { v: 0 }
    const animation = animate(counter, {
      v: target,
      duration,
      ease: 'outExpo',
      onUpdate: () => setValue(Math.round(counter.v)),
    })

    return () => {
      animation.pause()
    }
  }, [active, target, duration])

  return value
}
