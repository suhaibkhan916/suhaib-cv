import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { skillGroups, tierWeight, type Skill } from '../data/resume'
import { Section } from './Section'

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  const weight = tierWeight[skill.tier]

  return (
    <div className="group">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>
          {skill.name}
        </span>
        <span className="shrink-0 font-mono text-[11px]" style={{ color: 'var(--text-faint)' }}>
          {skill.tier}
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-y-[1.8]"
        style={{ background: 'var(--border)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${weight}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}
        />
      </div>
    </div>
  )
}

const ALL = 'All'

export function Skills() {
  const [active, setActive] = useState(ALL)
  const visible = active === ALL ? skillGroups : skillGroups.filter((g) => g.category === active)
  const solo = visible.length === 1

  return (
    <Section
      id="skills"
      index="02"
      title="Skills"
      subtitle="Self-assessed proficiency by depth of production use, grouped the way I actually reach for them on the job."
    >
      <div className="no-print mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter skills by category">
        {[ALL, ...skillGroups.map((g) => g.category)].map((label) => {
          const selected = active === label
          return (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(label)}
              className="relative rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors hover:border-[var(--accent)]"
              style={{
                borderColor: selected ? 'transparent' : 'var(--border)',
                color: selected ? 'var(--bg)' : 'var(--text-muted)',
              }}
            >
              {selected && (
                <motion.span
                  layoutId="skill-filter-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'var(--accent)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{label}</span>
            </button>
          )
        })}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((group, gi) => {
            const spanFull = solo || (visible.length % 2 === 1 && gi === visible.length - 1)
            return (
              <motion.div
                key={group.category}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: gi * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={`spotlight rounded-2xl border p-5 ${spanFull ? 'sm:col-span-2' : ''}`}
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <h3 className="font-[var(--font-display)] text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {group.category}
                </h3>
                <p className="mt-1 mb-5 text-xs" style={{ color: 'var(--text-faint)' }}>
                  {group.blurb}
                </p>
                <div className={`gap-x-8 gap-y-4 ${solo ? 'grid sm:grid-cols-2' : 'space-y-4'}`}>
                  {group.skills.map((skill, si) => (
                    <SkillBar key={skill.name} skill={skill} delay={si * 0.04} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
