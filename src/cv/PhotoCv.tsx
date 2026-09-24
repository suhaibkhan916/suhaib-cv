import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { certifications, education, experience, profile, publications } from '../data/resume'
import { Bullet, skillsByTier } from './parts'

const SIDE = 176
const NAVY = '#0f1b33'
const ACCENT = '#0891b2'
const SOFT = '#7dd3fc'

const s = StyleSheet.create({
  page: { paddingTop: 30, paddingBottom: 30, paddingLeft: SIDE + 26, paddingRight: 28, fontFamily: 'Helvetica', fontSize: 9, color: '#1e293b', lineHeight: 1.35 },
  sideBg: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SIDE, backgroundColor: NAVY },
  side: { position: 'absolute', left: 0, top: 0, width: SIDE, paddingTop: 30, paddingHorizontal: 18, color: '#e2e8f0' },
  photoRing: { width: 96, height: 96, borderRadius: 48, alignSelf: 'center', marginBottom: 10, borderWidth: 2, borderColor: SOFT, overflow: 'hidden' },
  photoImg: { width: 92, height: 92, objectFit: 'cover' },
  initials: { width: 92, height: 92, borderRadius: 46, alignSelf: 'center', marginBottom: 10, borderWidth: 2, borderColor: SOFT, justifyContent: 'center', alignItems: 'center' },
  initialsText: { fontFamily: 'Helvetica-Bold', fontSize: 30, color: SOFT },
  name: { fontFamily: 'Helvetica-Bold', fontSize: 17, lineHeight: 1.2, color: '#fff', textAlign: 'center' },
  role: { fontSize: 8.6, color: SOFT, textAlign: 'center', marginTop: 5, lineHeight: 1.4 },
  sideH: { fontFamily: 'Helvetica-Bold', fontSize: 8.6, letterSpacing: 1.1, textTransform: 'uppercase', color: SOFT, marginTop: 15, marginBottom: 5, paddingBottom: 3, borderBottomWidth: 0.6, borderBottomColor: '#334155' },
  sideLabel: { fontSize: 6.8, letterSpacing: 1, color: '#94a3b8', textTransform: 'uppercase', marginTop: 5 },
  sideText: { fontSize: 8.4, color: '#e2e8f0' },
  sideBold: { fontFamily: 'Helvetica-Bold', fontSize: 8.6, color: '#fff' },
  sideMuted: { fontSize: 8, color: '#a8b3c5' },
  h: { fontFamily: 'Helvetica-Bold', fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: NAVY, marginTop: 14, marginBottom: 6, paddingBottom: 3, borderBottomWidth: 1.4, borderBottomColor: ACCENT },
  jobHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  jobTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10.2, color: NAVY },
  company: { fontSize: 9, color: ACCENT, marginBottom: 3, fontFamily: 'Helvetica-Bold' },
  date: { fontSize: 8.4, color: '#64748b' },
  tags: { fontSize: 8, color: '#64748b', marginTop: 2 },
  tier: { marginBottom: 3 },
  bold: { fontFamily: 'Helvetica-Bold' },
})

export function PhotoCv({ photo }: { photo?: string }) {
  return (
    <Document title={`${profile.name} - CV`} author={profile.name} subject="Curriculum Vitae">
      <Page size="A4" style={s.page}>
        <View fixed style={s.sideBg} />

        <View style={s.side}>
          {photo ? (
            <View style={s.photoRing}>
              <Image src={photo} style={s.photoImg} />
            </View>
          ) : (
            <View style={s.initials}>
              <Text style={s.initialsText}>{profile.initials}</Text>
            </View>
          )}
          <Text style={s.name}>{profile.name.replace(' ', String.fromCharCode(10))}</Text>
          <Text style={s.role}>Software Engineer{'\n'}MSc Cyber Security</Text>

          <Text style={s.sideH}>Contact</Text>
          <Text style={s.sideLabel}>Email</Text>
          <Link src={`mailto:${profile.email}`} style={[s.sideText, { textDecoration: 'none' }]}>{profile.email}</Link>
          <Text style={s.sideLabel}>Phone</Text>
          <Text style={s.sideText}>{profile.phone}</Text>
          <Text style={s.sideLabel}>Location</Text>
          <Text style={s.sideText}>{profile.location}</Text>
          <Text style={s.sideLabel}>LinkedIn</Text>
          <Link src={profile.linkedinUrl} style={[s.sideText, { textDecoration: 'none' }]}>{profile.linkedin}</Link>
          <Text style={s.sideLabel}>GitHub</Text>
          <Link src={profile.githubUrl} style={[s.sideText, { textDecoration: 'none' }]}>{profile.github}</Link>

          <Text style={s.sideH}>Education</Text>
          {education.map((e) => (
            <View key={e.degree} style={{ marginBottom: 6 }}>
              <Text style={s.sideBold}>{e.degree}</Text>
              {e.distinction && <Text style={{ fontSize: 8, color: SOFT }}>{e.distinction}</Text>}
              <Text style={s.sideMuted}>{e.school}</Text>
              <Text style={s.sideMuted}>{e.year}</Text>
            </View>
          ))}

          <Text style={s.sideH}>Certifications</Text>
          {certifications.map((c) => (
            <View key={c.name} style={{ marginBottom: 5 }}>
              <Text style={s.sideBold}>{c.name}</Text>
              <Text style={s.sideMuted}>
                {c.issuer}
                {c.year ? `, ${c.year}` : ''}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[s.h, { marginTop: 0 }]}>Career Profile</Text>
        <Text style={{ textAlign: 'justify' }}>{profile.summary}</Text>
        <Text style={{ textAlign: 'justify', marginTop: 4 }}>{profile.summarySecond}</Text>

        <Text style={s.h} minPresenceAhead={70}>Experience</Text>
        {experience.map((job) => (
          <View key={job.role + job.company}>
            <View style={s.jobHead} minPresenceAhead={60}>
              <Text style={s.jobTitle}>{job.role}</Text>
              <Text style={s.date}>{job.period}</Text>
            </View>
            <Text style={s.company}>{job.company}</Text>
            {job.highlights.map((h) => (
              <Bullet key={h}>{h}</Bullet>
            ))}
            <Text style={s.tags}>{job.tags.join('  ·  ')}</Text>
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={110}>Publications</Text>
        {publications.map((p) => (
          <View key={p.url} wrap={false}>
            <Text>{p.citation}</Text>
            <Link src={p.url} style={{ color: ACCENT, fontSize: 8.2 }}>{p.url}</Link>
            <Text style={{ marginTop: 2 }}>{p.contribution}</Text>
          </View>
        ))}

        <Text style={s.h} minPresenceAhead={70}>Skills & Proficiency</Text>
        {skillsByTier().map((t) => (
          <View key={t.tier} style={s.tier} wrap={false}>
            <Text>
              <Text style={s.bold}>{t.tier}: </Text>
              {t.names.join(', ')}
            </Text>
          </View>
        ))}
        <Text style={{ fontSize: 7.6, color: '#64748b', marginTop: 2 }}>
          Proficiency is self-assessed by depth of production use.
        </Text>
      </Page>
    </Document>
  )
}
