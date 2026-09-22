import { motion } from 'framer-motion'
import { FiArrowDown, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { profile } from '../data/resume'
import { TypeRotator } from './TypeRotator'

const rotatingWords = [
  'Python & Django REST Framework',
  'Azure Data Factory ETL pipelines',
  'Docker & Kubernetes on AWS EKS',
  'Terraform infrastructure automation',
]

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92svh] flex-col justify-center px-6 pt-16 pb-10">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-xs"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
              style={{ background: 'var(--accent)' }}
            />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
          </span>
          {profile.relocation} &middot; {profile.location}
        </motion.div>

        <div className="flex flex-col-reverse items-start gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-[var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
              style={{ color: 'var(--text)' }}
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 text-xl font-medium sm:text-2xl"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile.title}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 min-h-6 font-mono text-sm sm:text-base"
            >
              <span style={{ color: 'var(--text-faint)' }}>$ building &rarr; </span>
              <TypeRotator words={rotatingWords} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-[15px] leading-relaxed sm:text-base"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform hover:scale-[1.03]"
                style={{ background: 'var(--accent)', color: 'var(--bg)' }}
              >
                <FiMail size={15} /> Get in touch
              </a>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <FiGithub size={15} /> GitHub
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                <FiLinkedin size={15} /> LinkedIn
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative shrink-0"
          >
            <div
              className="absolute inset-0 -z-10 animate-pulse rounded-full blur-2xl"
              style={{ background: 'var(--accent-soft)' }}
            />
            <div
              className="grid h-32 w-32 place-items-center rounded-full border-2 font-[var(--font-display)] text-3xl font-bold sm:h-44 sm:w-44 sm:text-5xl"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                background: 'var(--surface)',
                boxShadow: 'var(--glow)',
              }}
            >
              {profile.initials}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-auto mt-14 flex flex-col items-center gap-2 font-mono text-xs no-print"
        style={{ color: 'var(--text-faint)' }}
      >
        scroll
        <FiArrowDown className="animate-bounce" size={14} />
      </motion.a>
    </section>
  )
}
