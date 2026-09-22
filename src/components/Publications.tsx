import { motion } from 'framer-motion'
import { FiExternalLink } from 'react-icons/fi'
import { publications } from '../data/resume'
import { Section } from './Section'

export function Publications() {
  return (
    <Section id="publications" index="04" title="Publications">
      <div className="space-y-4">
        {publications.map((pub, i) => (
          <motion.a
            key={pub.url}
            href={pub.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group block rounded-2xl border p-5 transition-colors hover:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {pub.citation}
              </p>
              <FiExternalLink
                className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: 'var(--accent)' }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {pub.contribution}
            </p>
          </motion.a>
        ))}
      </div>
    </Section>
  )
}
