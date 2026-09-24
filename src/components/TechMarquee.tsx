import type { IconType } from 'react-icons'
import { FiBarChart2 } from 'react-icons/fi'
import {
  SiAnthropic,
  SiBraintree,
  SiComptia,
  SiCursor,
  SiDatabricks,
  SiDjango,
  SiDocker,
  SiFlask,
  SiGit,
  SiGnubash,
  SiGo,
  SiGooglecloud,
  SiGooglemaps,
  SiJavascript,
  SiJenkins,
  SiKubernetes,
  SiLinux,
  SiMysql,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiStripe,
  SiSwagger,
  SiTerraform,
  SiTryhackme,
  SiTypescript,
} from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'

const items: { name: string; icon: IconType }[] = [
  { name: 'Python', icon: SiPython },
  { name: 'Django', icon: SiDjango },
  { name: 'Flask', icon: SiFlask },
  { name: 'React', icon: SiReact },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'Go', icon: SiGo },
  { name: 'Azure', icon: VscAzure },
  { name: 'Google Cloud', icon: SiGooglecloud },
  { name: 'Databricks', icon: SiDatabricks },
  { name: 'Power BI', icon: FiBarChart2 },
  { name: 'Docker', icon: SiDocker },
  { name: 'Kubernetes', icon: SiKubernetes },
  { name: 'Terraform', icon: SiTerraform },
  { name: 'Jenkins', icon: SiJenkins },
  { name: 'PostgreSQL', icon: SiPostgresql },
  { name: 'MySQL', icon: SiMysql },
  { name: 'Linux', icon: SiLinux },
  { name: 'Bash', icon: SiGnubash },
  { name: 'Git', icon: SiGit },
  { name: 'Postman', icon: SiPostman },
  { name: 'Swagger', icon: SiSwagger },
  { name: 'Stripe', icon: SiStripe },
  { name: 'Braintree', icon: SiBraintree },
  { name: 'Google Maps', icon: SiGooglemaps },
  { name: 'Claude', icon: SiAnthropic },
  { name: 'Cursor', icon: SiCursor },
  { name: 'TryHackMe', icon: SiTryhackme },
  { name: 'CompTIA', icon: SiComptia },
]

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {items.map(({ name, icon: Icon }) => (
        <li
          key={name}
          className="group flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors hover:border-[var(--accent)]"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text-muted)' }}
        >
          <Icon size={16} className="transition-colors group-hover:text-[var(--accent)]" />
          {name}
        </li>
      ))}
    </ul>
  )
}

export function TechMarquee() {
  return (
    <div
      className="marquee no-print relative overflow-hidden py-6"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
      }}
      aria-label="Technologies I work with"
    >
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  )
}
