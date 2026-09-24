import { animate } from 'animejs'
import gsap from 'gsap'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { FiArrowDown, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { profile } from '../data/resume'
import { Magnetic } from './Magnetic'
import { TypeRotator } from './TypeRotator'

const rotatingWords = [
  'Python & Django REST Framework APIs',
  'ETL & data pipelines on Azure and GCP',
  'Automation that replaces manual work',
  'Secure systems: Security+, SAL1, MSc Cyber Security',
  'Hands-on cyber security labs on TryHackMe',
]

const credentials = ['MSc Cyber Security', 'CompTIA Security+', 'TryHackMe SAL1', '5+ years experience']

const ease = [0.16, 1, 0.3, 1] as const

function AnimatedName({ name }: { name: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.name-char', {
        yPercent: 115,
        opacity: 0,
        rotate: 8,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.04,
        delay: 0.1,
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <h1
      ref={ref}
      aria-label={name}
      className="font-[var(--font-display)] text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl"
      style={{ color: 'var(--text)' }}
    >
      {name.split(' ').map((word, wi) => (
        <span key={wi} className="mr-[0.25em] inline-block overflow-hidden pb-1 align-bottom" aria-hidden="true">
          {word.split('').map((char, ci) => (
            <span key={ci} className="name-char inline-block">
              {char}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

function Avatar() {
  const ringRef = useRef<SVGSVGElement>(null)
  const [hasPhoto, setHasPhoto] = useState(false)

  useEffect(() => {
    const el = ringRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const spin = animate(el, { rotate: 360, duration: 26000, ease: 'linear', loop: true })
    return () => {
      spin.revert()
    }
  }, [])

  return (
    <div className="relative h-32 w-32 shrink-0 sm:h-44 sm:w-44">
      <div
        className="absolute inset-0 -z-10 animate-pulse rounded-full blur-2xl"
        style={{ background: 'var(--accent-soft)' }}
      />
      <svg
        ref={ringRef}
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -inset-4 h-[calc(100%+32px)] w-[calc(100%+32px)]"
        style={{ transformOrigin: 'center' }}
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="48.5"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.5"
          strokeDasharray="1.5 3.5"
          opacity="0.7"
        />
        <circle cx="50" cy="1.5" r="1.7" fill="var(--accent-2)" />
        <circle cx="98.5" cy="50" r="1" fill="var(--accent)" />
      </svg>
      <div
        className="relative grid h-full w-full place-items-center overflow-hidden rounded-full border-2 font-[var(--font-display)] text-3xl font-bold sm:text-5xl"
        style={{
          borderColor: 'var(--accent)',
          color: 'var(--accent)',
          background: 'var(--surface)',
          boxShadow: 'var(--glow)',
        }}
      >
        {!hasPhoto && <span>{profile.initials}</span>}
        <img
          src={profile.photo}
          alt={`${profile.name}, Software Engineer`}
          onLoad={() => setHasPhoto(true)}
          onError={() => setHasPhoto(false)}
          className={`absolute inset-0 h-full w-full object-cover ${hasPhoto ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[92svh] flex-col justify-center px-6 pt-16 pb-10">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
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

        <div className="flex flex-col-reverse items-start gap-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <AnimatedName name={profile.name} />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.5, ease }}
              className="mt-3 text-xl font-medium sm:text-2xl"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile.title}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.6, ease }}
              className="mt-5 min-h-6 font-mono text-sm sm:text-base"
            >
              <span style={{ color: 'var(--text-faint)' }}>$ building &rarr; </span>
              <TypeRotator words={rotatingWords} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.7, ease }}
              className="mt-6 max-w-xl text-[15px] leading-relaxed sm:text-base"
              style={{ color: 'var(--text-muted)' }}
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.8, ease }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {credentials.map((item) => (
                <span
                  key={item}
                  className="hvr-float rounded-full border px-3 py-1 font-mono text-[11px]"
                  style={{ borderColor: 'var(--border-strong)', color: 'var(--text-muted)', background: 'var(--surface)' }}
                >
                  {item}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.9, ease }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <span className="hvr-grow inline-block">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                    style={{ background: 'var(--accent)', color: 'var(--bg)' }}
                  >
                    <FiMail size={15} /> Get in touch
                  </a>
                </span>
              </Magnetic>
              <Magnetic>
                <span className="hvr-float inline-block">
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <FiGithub size={15} /> GitHub
                  </a>
                </span>
              </Magnetic>
              <Magnetic>
                <span className="hvr-float inline-block">
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <FiLinkedin size={15} /> LinkedIn
                  </a>
                </span>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <Avatar />
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="mx-auto mt-14 flex flex-col items-center gap-2 font-mono text-xs no-print"
        style={{ color: 'var(--text-faint)' }}
      >
        scroll
        <FiArrowDown className="animate-bounce" size={14} />
      </motion.a>
    </section>
  )
}
