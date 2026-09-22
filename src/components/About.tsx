import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { impactStats, profile } from '../data/resume'
import { Section } from './Section'
import { useCountUp } from '../hooks/useCountUp'

function StatCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const count = useCountUp(value, inView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border p-5"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <div className="font-[var(--font-display)] text-3xl font-bold" style={{ color: 'var(--accent)' }}>
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm leading-snug" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </motion.div>
  )
}

export function About() {
  return (
    <Section id="about" index="01" title="About">
      <div className="grid gap-10 md:grid-cols-5">
        <p className="md:col-span-3 text-base leading-relaxed" style={{ color: 'var(--text)' }}>
          {profile.summary}
        </p>
        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          {impactStats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </Section>
  )
}
