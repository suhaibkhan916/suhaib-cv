import { motion } from 'motion/react'
import { useState } from 'react'
import { FiCheck, FiCopy, FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { profile } from '../data/resume'
import { Magnetic } from './Magnetic'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <section id="contact" className="print-section scroll-mt-24 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border p-8 sm:p-12"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)', boxShadow: 'var(--glow)' }}
        >
          <span className="font-mono text-sm" style={{ color: 'var(--accent)' }}>
            06 // Contact
          </span>
          <h2
            className="mt-2 font-[var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: 'var(--text)' }}
          >
            Let&rsquo;s build something.
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Open to Software Engineer and cyber security roles across the UK and EU. The fastest way to reach me is email — happy to talk
            through anything from backend architecture and cloud data pipelines to automation and security.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <span className="hvr-grow inline-block">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                  style={{ background: 'var(--accent)', color: 'var(--bg)' }}
                >
                  {copied ? <FiCheck size={15} /> : <FiMail size={15} />}
                  {copied ? 'Copied' : profile.email}
                  {!copied && <FiCopy size={13} className="opacity-60" />}
                </button>
              </span>
            </Magnetic>
            <Magnetic>
              <span className="hvr-float inline-block">
                <a
                  href={`tel:${profile.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <FiPhone size={15} /> {profile.phone}
                </a>
              </span>
            </Magnetic>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
            <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
              <FiMapPin size={14} /> {profile.location}
            </span>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <FiLinkedin size={14} /> {profile.linkedin}
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
              style={{ color: 'var(--text-muted)' }}
            >
              <FiGithub size={14} /> {profile.github}
            </a>
          </div>
        </motion.div>

        <footer className="mt-10 font-mono text-xs no-print" style={{ color: 'var(--text-faint)' }}>
          {profile.name}
        </footer>
      </div>
    </section>
  )
}
