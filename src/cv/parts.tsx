import { Font, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import { certifications, skillGroups, type Certification, type SkillTier } from '../data/resume'

Font.registerHyphenationCallback((word) => [word])

export const contactParts = (p: { location: string; phone: string; email: string; linkedin: string; github: string }) => [
  p.location,
  p.phone,
  p.email,
  p.linkedin,
  p.github,
]

export function certLine(c: Certification) {
  return `${c.name} - ${c.issuer}${c.year ? `, ${c.year}` : ''}${c.expires ? ` (expires ${c.expires})` : ''}`
}

export function competencies(): string[] {
  const seen = new Set<string>()
  skillGroups.forEach((g) =>
    g.skills.forEach((s) => {
      if (s.tier === 'Expert' || s.tier === 'Advanced') seen.add(s.name)
    }),
  )
  return [...seen]
}

export function skillsByTier(): { tier: SkillTier; names: string[] }[] {
  const order: SkillTier[] = ['Expert', 'Advanced', 'Proficient', 'Working knowledge']
  return order
    .map((tier) => ({
      tier,
      names: skillGroups.flatMap((g) => g.skills.filter((s) => s.tier === tier).map((s) => s.name)),
    }))
    .filter((t) => t.names.length)
}

export const certsForCv = certifications

const s = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 2.5 },
  dot: { width: 10, fontSize: 9 },
  text: { flex: 1, lineHeight: 1.35 },
})

export function Bullet({ children, size = 9, color }: { children: ReactNode; size?: number; color?: string }) {
  return (
    <View style={s.row} wrap={false}>
      <Text style={[s.dot, { fontSize: size, color }]}>•</Text>
      <Text style={[s.text, { fontSize: size, color }]}>{children}</Text>
    </View>
  )
}
