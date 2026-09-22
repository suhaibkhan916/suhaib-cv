import { motion } from 'framer-motion'
import { FiAward, FiBookOpen, FiExternalLink } from 'react-icons/fi'
import { certifications, education } from '../data/resume'
import { Section } from './Section'

export function Education() {
  return (
    <Section id="education" index="05" title="Education & Certifications">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3
            className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
            style={{ color: 'var(--text-faint)' }}
          >
            <FiBookOpen size={14} /> Education
          </h3>
          <div className="space-y-4">
            {education.map((ed, i) => (
              <motion.div
                key={ed.degree}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-medium" style={{ color: 'var(--text)' }}>
                    {ed.degree}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
                    {ed.year}
                  </span>
                </div>
                {ed.distinction && (
                  <span className="text-xs" style={{ color: 'var(--accent)' }}>
                    {ed.distinction}
                  </span>
                )}
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {ed.school}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3
            className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider"
            style={{ color: 'var(--text-faint)' }}
          >
            <FiAward size={14} /> Certifications & Continuous Learning
          </h3>
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border p-5"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium" style={{ color: 'var(--text)' }}>
                    {cert.name}
                  </span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Show credential"
                      className="mt-1 shrink-0 transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--text-faint)' }}
                    >
                      <FiExternalLink size={14} />
                    </a>
                  )}
                </div>

                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {cert.issuer} &middot; {cert.year}
                  {cert.expires && ` – ${cert.expires}`}
                </p>

                {cert.credentialId && (
                  <p className="mt-1 font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>
                    ID: {cert.credentialId}
                  </p>
                )}

                {cert.skills && cert.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border px-2.5 py-0.5 font-mono text-[11px]"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-faint)' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
