import { motion } from 'framer-motion'
import { experience } from '../data/resume'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" index="03" title="Experience">
      <ol className="relative space-y-10 border-l pl-8" style={{ borderColor: 'var(--border)' }}>
        {experience.map((job, i) => (
          <motion.li
            key={job.role + job.company}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <span
              className="absolute -left-[38px] top-1 grid h-4 w-4 place-items-center rounded-full border-2"
              style={{
                borderColor: job.current ? 'var(--accent)' : 'var(--border-strong)',
                background: job.current ? 'var(--accent)' : 'var(--bg)',
                boxShadow: job.current ? '0 0 0 4px var(--accent-soft)' : 'none',
              }}
            />

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-[var(--font-display)] text-lg font-semibold" style={{ color: 'var(--text)' }}>
                {job.role}
              </h3>
              <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
                {job.period}
              </span>
            </div>
            <div className="mt-0.5 text-sm font-medium" style={{ color: 'var(--accent)' }}>
              {job.company}
              {job.current && (
                <span
                  className="ml-2 rounded-full px-2 py-0.5 align-middle font-mono text-[10px]"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  current
                </span>
              )}
            </div>

            <ul className="mt-3 space-y-1.5">
              {job.highlights.map((h) => (
                <li
                  key={h}
                  className="flex gap-2 text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: 'var(--text-faint)' }} />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
