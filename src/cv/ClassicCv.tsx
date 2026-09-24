import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import {
  certifications,
  cvHighlights,
  education,
  experience,
  profile,
  publications,
  skillGroups,
} from '../data/resume'
import { Bullet, certLine, competencies, contactParts } from './parts'

const NAVY = '#1f3864'

const s = StyleSheet.create({
  page: { paddingTop: 34, paddingBottom: 34, paddingHorizontal: 40, fontFamily: 'Helvetica', fontSize: 9.2, color: '#111', lineHeight: 1.3 },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 22, lineHeight: 1.25, textAlign: 'center', letterSpacing: 1.2, textTransform: 'uppercase' },
  contact: { fontFamily: 'Helvetica-Bold', fontSize: 8.3, color: '#555', textAlign: 'center', marginTop: 3, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 10, textAlign: 'center', marginTop: 6 },
  h: { fontFamily: 'Helvetica-Bold', fontSize: 11, textTransform: 'uppercase', marginTop: 12, marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1, borderBottomColor: NAVY },
  para: { textAlign: 'justify', marginBottom: 3 },
  jobHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 7 },
  jobTitle: { fontFamily: 'Helvetica-Bold', color: NAVY, fontSize: 10 },
  date: { fontFamily: 'Helvetica-Oblique', color: '#555', fontSize: 8.6 },
  label: { fontFamily: 'Helvetica-Bold', marginTop: 3, marginBottom: 2 },
  skillRow: { marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
})

export function ClassicCv() {
  return (
    <Document title={`${profile.name} - CV`} author={profile.name} subject="Curriculum Vitae">
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{profile.name}</Text>
        <Text style={s.contact}>{contactParts(profile).join('  |  ')}</Text>
        <Text style={s.title}>Software Engineer  |  MSc Cyber Security  |  Python, Django & Cloud Data Pipelines  |  IT Support & Automation</Text>

        <Text style={s.h} minPresenceAhead={60}>Executive Summary</Text>
        <Text style={s.para}>{profile.summary}</Text>
        <Text style={s.para}>{profile.summarySecond}</Text>

        <Text style={s.h} minPresenceAhead={60}>Career Highlights</Text>
        {cvHighlights.map((h) => (
          <Bullet key={h.lead}>
            <Text style={s.bold}>{h.lead}: </Text>
            {h.text}
          </Bullet>
        ))}

        <Text style={s.h} minPresenceAhead={40}>Core Competencies</Text>
        <Text>{competencies().join(' | ')}</Text>

        <Text style={s.h} minPresenceAhead={60}>Professional Experience</Text>
        {experience.map((job) => (
          <View key={job.role + job.company}>
            <View wrap={false}>
              <View style={s.jobHead}>
                <Text style={s.jobTitle}>{job.role} | {job.company}</Text>
                <Text style={s.date}>{job.period}</Text>
              </View>
              <Text style={s.label}>Key Responsibilities & Achievements:</Text>
              <Bullet>{job.highlights[0]}</Bullet>
            </View>
            {job.highlights.slice(1).map((h) => (
              <Bullet key={h}>{h}</Bullet>
            ))}
            <Text style={{ marginTop: 2 }}>
              <Text style={s.bold}>Technologies: </Text>
              {job.tags.join(', ')}
            </Text>
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={50}>Education & Certifications</Text>
        {education.map((e) => (
          <Bullet key={e.degree}>
            <Text style={s.bold}>{e.degree}{e.distinction ? ` (${e.distinction})` : ''}</Text>
            {` - ${e.school}, ${e.year}`}
          </Bullet>
        ))}
        {certifications.map((c) => (
          <Bullet key={c.name}>{certLine(c)}</Bullet>
        ))}

        <Text style={s.h} minPresenceAhead={50}>Publications</Text>
        {publications.map((p) => (
          <View key={p.url} wrap={false}>
            <Text style={s.para}>{p.citation}</Text>
            <Link src={p.url} style={{ color: NAVY, fontSize: 8.4 }}>{p.url}</Link>
            <Text style={{ marginTop: 2 }}>{p.contribution}</Text>
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={60}>Technical Skills Summary</Text>
        {skillGroups.map((g) => (
          <View key={g.category} style={s.skillRow} wrap={false}>
            <Text>
              <Text style={s.bold}>{g.category}: </Text>
              {g.skills.map((k) => k.name).join(', ')}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
