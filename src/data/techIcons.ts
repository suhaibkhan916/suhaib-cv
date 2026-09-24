import type { IconType } from 'react-icons'
import {
  SiAnthropic,
  SiCursor,
  SiDjango,
  SiDocker,
  SiGit,
  SiGnubash,
  SiGo,
  SiGooglecloud,
  SiJavascript,
  SiJenkins,
  SiKubernetes,
  SiLinux,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTerraform,
  SiTryhackme,
  SiTypescript,
} from 'react-icons/si'
import { VscAzure } from 'react-icons/vsc'

export interface TechIcon {
  name: string
  icon: IconType
  color: string
}

export const tech = {
  python: { name: 'Python', icon: SiPython, color: '#4B8BBE' },
  linux: { name: 'Linux', icon: SiLinux, color: '#FCC624' },
  docker: { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  kubernetes: { name: 'Kubernetes', icon: SiKubernetes, color: '#4C7CE6' },
  azure: { name: 'Azure', icon: VscAzure, color: '#2AA7F0' },
  gcp: { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
  react: { name: 'React', icon: SiReact, color: '#61DAFB' },
  typescript: { name: 'TypeScript', icon: SiTypescript, color: '#3E8CE0' },
  javascript: { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  django: { name: 'Django', icon: SiDjango, color: '#2FA36B' },
  git: { name: 'Git', icon: SiGit, color: '#F05032' },
  terraform: { name: 'Terraform', icon: SiTerraform, color: '#8C5CE6' },
  jenkins: { name: 'Jenkins', icon: SiJenkins, color: '#E05A4B' },
  postgres: { name: 'PostgreSQL', icon: SiPostgresql, color: '#5A8FC9' },
  bash: { name: 'Bash', icon: SiGnubash, color: '#7BC96F' },
  go: { name: 'Go', icon: SiGo, color: '#00ADD8' },
  claude: { name: 'Claude', icon: SiAnthropic, color: '#D97757' },
  cursor: { name: 'Cursor', icon: SiCursor, color: '#B8C0CC' },
  tryhackme: { name: 'TryHackMe', icon: SiTryhackme, color: '#E3483E' },
} satisfies Record<string, TechIcon>

export type TechKey = keyof typeof tech
