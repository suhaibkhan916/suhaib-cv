import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { certifications, education, experience, profile, publications, skillGroups } from '../data/resume'
import { Bullet, certLine, contactParts } from './parts'

const s = StyleSheet.create({
  page: { paddingTop: 40, paddingBottom: 40, paddingHorizontal: 46, fontFamily: 'Helvetica', fontSize: 9.6, color: '#000', lineHeight: 1.35 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 20, lineHeight: 1.25 },
  title: { fontSize: 11.5, lineHeight: 1.25, marginTop: 2, color: '#222' },
  contact: { fontSize: 8.6, marginTop: 5, color: '#333' },
  h: { fontFamily: 'Helvetica-Bold', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 13, marginBottom: 5, paddingBottom: 2, borderBottomWidth: 0.8, borderBottomColor: '#000' },
  jobHead: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  skillRow: { marginBottom: 3 },
})

export function SimpleCv() {
  return (
    <Document title={`${profile.name} - CV`} author={profile.name} subject="Curriculum Vitae">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.title}>Software Engineer</Text>
        <Text style={s.contact}>{contactParts(profile).join('  |  ')}</Text>

        <Text style={s.h} minPresenceAhead={50}>Professional Summary</Text>
        <Text>{profile.summary}</Text>
        <Text style={{ marginTop: 4 }}>{profile.summarySecond}</Text>

        <Text style={s.h} minPresenceAhead={60}>Technical Skills</Text>
        {skillGroups.map((g) => (
          <View key={g.category} style={s.skillRow} wrap={false}>
            <Text>
              <Text style={s.bold}>{g.category}: </Text>
              {g.skills.map((k) => k.name).join(', ')}
            </Text>
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={60}>Work Experience</Text>
        {experience.map((job) => (
          <View key={job.role + job.company}>
            <View style={s.jobHead} minPresenceAhead={50}>
              <Text style={s.bold}>{job.role} | {job.company}</Text>
              <Text>{job.period}</Text>
            </View>
            {job.highlights.map((h) => (
              <Bullet key={h} size={9.4}>{h}</Bullet>
            ))}
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={50}>Publications</Text>
        {publications.map((p) => (
          <View key={p.url} wrap={false}>
            <Text>{p.citation}</Text>
            <Link src={p.url} style={{ color: '#0b3d91', fontSize: 8.6 }}>{p.url}</Link>
            <Text style={{ marginTop: 2 }}>{p.contribution}</Text>
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={50}>Certifications and Continuous Learning</Text>
        {certifications.map((c) => (
          <Bullet key={c.name} size={9.4}>{certLine(c)}</Bullet>
        ))}

        <Text style={s.h} minPresenceAhead={40}>Education</Text>
        {education.map((e) => (
          <Bullet key={e.degree} size={9.4}>
            {e.degree}{e.distinction ? `, ${e.distinction}` : ''}, {e.school}, {e.year}
          </Bullet>
        ))}
      </Page>
    </Document>
  )
}
