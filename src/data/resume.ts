export const profile = {
  name: 'Muhammad Suhaib',
  initials: 'MS',
  title: 'Software Engineer · MSc Cyber Security',
  tagline:
    'Five years across software engineering, IT support and data reporting. I build Python and Django services, Azure and GCP data pipelines and automation, backed by an MSc in Cyber Security, CompTIA Security+ and TryHackMe SAL1.',
  location: 'Bristol, United Kingdom',
  relocation: 'Open to UK & EU relocation',
  phone: '+44 7466 648517',
  email: 'suhaibkhan916@gmail.com',
  linkedin: 'linkedin.com/in/muhsuhaib',
  linkedinUrl: 'https://linkedin.com/in/muhsuhaib',
  github: 'github.com/suhaibkhan916',
  githubUrl: 'https://github.com/suhaibkhan916',
  photo: '/profile.jpg',
  summary:
    'Software engineer with 5+ years of professional experience across engineering and IT support. Three years building Python and Django REST Framework services, data pipelines and infrastructure automation on Azure and Google Cloud Platform, including an Azure Data Factory ETL pipeline feeding Power BI reporting and containerised workloads on Docker and Kubernetes. Two further years in IT support at BCA UK, handling 30+ tickets a day and producing operational data reporting, and now working as an IT Support / Service Desk Agent.',
  summarySecond:
    'Holds an MSc in Cyber Security (Distinction), CompTIA Security+ and TryHackMe SAL1, with hands-on cyber security lab experience on TryHackMe and a peer-reviewed publication on AES encryption under quantum computing techniques.',
} as const

export type SkillTier = 'Expert' | 'Advanced' | 'Proficient' | 'Working knowledge'

export const tierWeight: Record<SkillTier, number> = {
  Expert: 95,
  Advanced: 80,
  Proficient: 65,
  'Working knowledge': 50,
}

export interface Skill {
  name: string
  tier: SkillTier
}

export interface SkillGroup {
  category: string
  blurb: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages & Frameworks',
    blurb: 'Core stack for backend and full-stack engineering.',
    skills: [
      { name: 'Python', tier: 'Expert' },
      { name: 'Django REST Framework', tier: 'Expert' },
      { name: 'Flask', tier: 'Proficient' },
      { name: 'SQL', tier: 'Advanced' },
      { name: 'JavaScript', tier: 'Proficient' },
      { name: 'TypeScript', tier: 'Proficient' },
      { name: 'React', tier: 'Proficient' },
      { name: 'Go', tier: 'Working knowledge' },
    ],
  },
  {
    category: 'Cyber Security',
    blurb: 'MSc-level theory backed by hands-on lab practice.',
    skills: [
      { name: 'CompTIA Security+', tier: 'Advanced' },
      { name: 'TryHackMe labs & SAL1', tier: 'Advanced' },
      { name: 'ISO 27001 Annex A controls', tier: 'Proficient' },
      { name: 'Phishing analysis', tier: 'Proficient' },
      { name: 'Cryptography research (AES, quantum)', tier: 'Proficient' },
    ],
  },
  {
    category: 'Cloud & Data',
    blurb: 'Pipelines, storage and reporting on Azure and GCP.',
    skills: [
      { name: 'Microsoft Azure', tier: 'Expert' },
      { name: 'Azure Data Factory', tier: 'Advanced' },
      { name: 'Azure Synapse', tier: 'Proficient' },
      { name: 'Azure Data Lake', tier: 'Proficient' },
      { name: 'Azure Blob Storage & CDN', tier: 'Advanced' },
      { name: 'Google Cloud Platform', tier: 'Proficient' },
      { name: 'Google BigQuery', tier: 'Proficient' },
      { name: 'Databricks', tier: 'Proficient' },
      { name: 'Power BI', tier: 'Proficient' },
      { name: 'Data pipeline design & reporting', tier: 'Advanced' },
    ],
  },
  {
    category: 'Databases & Infrastructure',
    blurb: 'The layer beneath the app: data stores, containers and IaC.',
    skills: [
      { name: 'PostgreSQL', tier: 'Advanced' },
      { name: 'MySQL', tier: 'Advanced' },
      { name: 'Docker', tier: 'Advanced' },
      { name: 'Kubernetes', tier: 'Advanced' },
      { name: 'Terraform', tier: 'Advanced' },
      { name: 'Linux & shell scripting', tier: 'Advanced' },
    ],
  },
  {
    category: 'DevOps & Delivery',
    blurb: 'Shipping changes safely and repeatably.',
    skills: [
      { name: 'CI/CD', tier: 'Advanced' },
      { name: 'Jenkins', tier: 'Advanced' },
      { name: 'Git / GitHub / GitLab', tier: 'Expert' },
      { name: 'Azure DevOps / Repos', tier: 'Advanced' },
      { name: 'Agile / Scrum', tier: 'Advanced' },
    ],
  },
  {
    category: 'API Integration',
    blurb: 'Connecting services together, documented and testable.',
    skills: [
      { name: 'REST API integration', tier: 'Expert' },
      { name: 'Third-party API integration', tier: 'Advanced' },
      { name: 'IBM Quantum Platform', tier: 'Proficient' },
      { name: 'Google Maps API', tier: 'Proficient' },
      { name: 'Google SERP API', tier: 'Proficient' },
      { name: 'OpenRouteService API', tier: 'Proficient' },
      { name: 'Google OAuth', tier: 'Proficient' },
      { name: 'Stripe API', tier: 'Proficient' },
      { name: 'Braintree', tier: 'Proficient' },
      { name: 'Swagger / OpenAPI', tier: 'Advanced' },
      { name: 'Postman', tier: 'Advanced' },
    ],
  },
  {
    category: 'AI & Automation',
    blurb: 'Using AI tooling and scripting to remove manual work.',
    skills: [
      { name: 'Claude Code', tier: 'Advanced' },
      { name: 'Cursor AI', tier: 'Advanced' },
      { name: 'Chatbots', tier: 'Proficient' },
      { name: 'Automation', tier: 'Advanced' },
    ],
  },
  {
    category: 'IT Support & Service Desk',
    blurb: 'Two years of live helpdesk operations and reporting.',
    skills: [
      { name: 'Freshdesk & Freshservice', tier: 'Advanced' },
      { name: 'SLA-driven ticket management', tier: 'Advanced' },
      { name: 'SQL & Excel reporting', tier: 'Advanced' },
      { name: 'Stakeholder communication', tier: 'Advanced' },
    ],
  },
]

export interface ExperienceEntry {
  role: string
  company: string
  period: string
  current?: boolean
  highlights: string[]
  tags: string[]
}

export const experience: ExperienceEntry[] = [
  {
    role: 'IT Support / Service Desk Agent',
    company: 'Opus Apeiro',
    period: 'Aug 2026 – Present',
    current: true,
    highlights: [
      'Resolve inbound customer queries in Freshdesk and Freshservice within SLA-bound queues, escalating unresolved issues to internal IT teams with clear technical hand-off notes so engineers can act without re-triaging.',
      'Query records with SQL and report on ticket status in Excel, coordinating with cross-functional teams through Trello to keep workflows visible.',
    ],
    tags: ['Freshdesk', 'Freshservice', 'SLA management', 'SQL', 'Excel', 'Trello'],
  },
  {
    role: 'IT Support',
    company: 'BCA UK',
    period: 'Aug 2024 – Aug 2026',
    highlights: [
      'Supported UK automotive dealers on a vehicle services helpdesk system, handling over 30 tickets a day while communicating directly with dealers, internal stakeholders and C-suite contacts.',
      'Produced operational and data reporting on request, and proactively surfaced recurring issues to reduce repeat queries reaching the queue.',
      'Triaged and documented incidents on the helpdesk platform, following each ticket through to resolution or a clean escalation.',
    ],
    tags: ['Helpdesk', 'Incident triage', 'Data reporting', 'Stakeholder communication'],
  },
  {
    role: 'Software Engineer',
    company: 'Prismware Technologies',
    period: 'Dec 2020 – Sep 2023',
    highlights: [
      'Built Terraform configuration from scratch alongside a colleague to provision Azure and Google Cloud Platform virtual machines and databases, as part of an ongoing internal infrastructure automation project.',
      'Developed a Jenkins CI/CD pipeline and supporting automation scripts from scratch with a colleague, and resolved version, library and compatibility issues in Docker builds pushed to Azure Container Registry.',
      'Designed and deployed a daily scheduled Python and Django Kubernetes CronJob that replaced a manual daily reporting process, authoring manifests and Helm chart values for related workloads.',
      'Fed a Power BI reporting dataset with an Azure Data Factory ETL pipeline, partnering with the Power BI development team to validate the data model and reviewing dashboards for accuracy.',
      'Delivered the media storage and delivery pipeline for a video and social media application using Azure Blob Storage and Azure CDN, and documented integrated REST APIs with Swagger/OpenAPI.',
    ],
    tags: ['Python', 'Django', 'Terraform', 'Jenkins', 'Docker', 'Kubernetes', 'Azure Data Factory', 'Power BI'],
  },
]

export const impactStats = [
  { value: 5, suffix: '+', label: 'years professional experience' },
  { value: 3, suffix: '+', label: 'years in software engineering' },
  { value: 30, suffix: '+', label: 'support tickets handled daily' },
  { value: 1, suffix: '', label: 'peer-reviewed publication' },
] as const

export interface Publication {
  citation: string
  url: string
  contribution: string
}

export const publications: Publication[] = [
  {
    citation:
      'Gorine, A. and Suhaib, M. (2024). Exploring AES Encryption Implementation Through Quantum Computing Techniques. American Journal of Computer Science and Technology, 7(4), 139–155.',
    url: 'https://doi.org/10.11648/j.ajcst.20240704.12',
    contribution:
      'Contributed data curation, methodology, software implementation and original draft writing to a peer-reviewed study on AES encryption under quantum computing techniques.',
  },
]

export interface Certification {
  name: string
  issuer: string
  year?: string
  expires?: string
  credentialUrl?: string
  credentialId?: string
  skills?: string[]
}

export const certifications: Certification[] = [
  {
    name: 'CompTIA Security+ ce Certification',
    issuer: 'CompTIA',
    year: 'Dec 2025',
    expires: 'Dec 2028',
    credentialUrl: 'https://www.credly.com/badges/26cec992-f533-4365-a135-8c2dd5486d44/public_url',
    skills: ['Windows', 'Technical Documentation'],
  },
  {
    name: 'Security Analyst Level 1 (SAL1)',
    issuer: 'TryHackMe',
    skills: ['Security analysis', 'Hands-on labs'],
  },
  {
    name: 'ISO 27001:2022-Compliant Cybersecurity: The Annex A Controls',
    issuer: 'LinkedIn',
    year: 'Oct 2024',
    skills: ['Information Security', 'ISO 27001'],
  },
  {
    name: 'Microsoft Certified: Azure AI Fundamentals',
    issuer: 'Microsoft',
    year: 'May 2024',
  },
  {
    name: 'Mastercard Cybersecurity Job Simulation',
    issuer: 'Forage',
    year: 'Jul 2026',
    credentialId: '6a5e7b87a285deac746bebe9',
    skills: ['Phishing'],
  },
]

export interface EducationEntry {
  degree: string
  distinction?: string
  school: string
  year: string
}

export const education: EducationEntry[] = [
  {
    degree: 'MSc Cyber Security',
    distinction: 'Distinction',
    school: 'University of the West of England',
    year: '2024',
  },
  {
    degree: 'BSc Computer Software Engineering',
    school: 'University of Lahore',
    year: '2020',
  },
]
