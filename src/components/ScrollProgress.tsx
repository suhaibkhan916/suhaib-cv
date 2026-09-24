import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left no-print"
      style={{ scaleX, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
    />
  )
}
