import {
  certifications,
  education,
  experience,
  profile,
  publications,
  skillGroups,
} from '../data/resume'

// Plain semantic HTML of the page content. It is written into index.html at build time
// so search engines and link-preview bots get the text without running any JavaScript.
export function StaticContent() {
  return (
    <div className="sr-only">
      <header>
        <h1>{profile.name}</h1>
        <p>{profile.title}</p>
        <p>
          {profile.location}. {profile.relocation}.
        </p>
        <p>{profile.tagline}</p>
      </header>

      <main>
        <section>
          <h2>About</h2>
          <p>{profile.summary}</p>
          <p>{profile.summarySecond}</p>
        </section>

        <section>
          <h2>Skills</h2>
          {skillGroups.map((group) => (
            <div key={group.category}>
              <h3>{group.category}</h3>
              <ul>
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    {skill.name} ({skill.tier})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Experience</h2>
          {experience.map((job) => (
            <article key={job.role + job.company}>
              <h3>
                {job.role}, {job.company}
              </h3>
              <p>{job.period}</p>
              <ul>
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <p>Technologies: {job.tags.join(', ')}</p>
            </article>
          ))}
        </section>

        <section>
          <h2>Publications</h2>
          {publications.map((p) => (
            <article key={p.url}>
              <p>{p.citation}</p>
              <p>{p.contribution}</p>
              <a href={p.url}>{p.url}</a>
            </article>
          ))}
        </section>

        <section>
          <h2>Education and Certifications</h2>
          <ul>
            {education.map((e) => (
              <li key={e.degree}>
                {e.degree}
                {e.distinction ? `, ${e.distinction}` : ''}, {e.school}, {e.year}
              </li>
            ))}
            {certifications.map((c) => (
              <li key={c.name}>
                {c.name}, {c.issuer}
                {c.year ? `, ${c.year}` : ''}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p>Phone: {profile.phone}</p>
          <p>
            <a href={profile.linkedinUrl}>LinkedIn</a>, <a href={profile.githubUrl}>GitHub</a>
          </p>
        </section>
      </main>
    </div>
  )
}
