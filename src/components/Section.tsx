import { motion } from 'motion/react'
import type { PropsWithChildren, ReactNode } from 'react'

interface SectionProps extends PropsWithChildren {
  id: string
  index: string
  title: string
  subtitle?: ReactNode
  className?: string
}

export function Section({ id, index, title, subtitle, className = '', children }: SectionProps) {
  return (
    <section id={id} className={`print-section scroll-mt-24 py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-baseline gap-3">
            <span
              className="font-mono text-sm"
              style={{ color: 'var(--accent)' }}
            >
              {index}
            </span>
            <h2
              className="font-[var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl"
              style={{ color: 'var(--text)' }}
            >
              {title}
            </h2>
            <span className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {subtitle}
            </p>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  )
}
