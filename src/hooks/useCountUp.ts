import { animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, active: boolean, duration = 1.4) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true

    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [active, target, duration])

  return value
}
