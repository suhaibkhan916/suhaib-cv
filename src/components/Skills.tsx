import { motion } from 'framer-motion'
import { skillGroups, tierWeight, type Skill } from '../data/resume'
import { Section } from './Section'

function SkillBar({ skill, delay }: { skill: Skill; delay: number }) {
  const weight = tierWeight[skill.tier]

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm" style={{ color: 'var(--text)' }}>
          {skill.name}
        </span>
        <span className="font-mono text-[11px] shrink-0" style={{ color: 'var(--text-faint)' }}>
          {skill.tier}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--border)' }}>
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

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      title="Skills"
      subtitle="Self-assessed proficiency by depth of production use — grouped the way I actually reach for them on the job."
    >
      <div className="grid gap-8 sm:grid-cols-2">
        {skillGroups.map((group, gi) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: gi * 0.05 }}
            className={`rounded-2xl border p-5 ${
              gi === skillGroups.length - 1 && skillGroups.length % 2 === 1 ? 'sm:col-span-2' : ''
            }`}
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h3 className="font-[var(--font-display)] text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {group.category}
            </h3>
            <p className="mt-1 mb-5 text-xs" style={{ color: 'var(--text-faint)' }}>
              {group.blurb}
            </p>
            <div className="space-y-4">
              {group.skills.map((skill, si) => (
                <SkillBar key={skill.name} skill={skill} delay={si * 0.04} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
