export const profile = {
  name: 'Muhammad Suhaib',
  initials: 'MS',
  title: 'Software Engineer',
  tagline:
    'I build backend services and cloud data pipelines — Python, Django and infrastructure automation across Azure, AWS and GCP.',
  location: 'Bristol, United Kingdom',
  relocation: 'Open to UK relocation',
  phone: '+44 7466 648517',
  email: 'suhaibkhan916@gmail.com',
  linkedin: 'linkedin.com/in/muhsuhaib',
  linkedinUrl: 'https://linkedin.com/in/muhsuhaib',
  github: 'github.com/suhaibkhan916',
  githubUrl: 'https://github.com/suhaibkhan916',
  summary:
    'Software engineer with three years of production experience building Python and Django REST Framework services across Azure, AWS and Google Cloud Platform, including data pipeline design and infrastructure automation. Built an Azure Data Factory ETL pipeline feeding Power BI reporting and deployed containerised workloads on AWS EKS using Docker and Kubernetes.',
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
    blurb: 'Core stack for day-to-day backend engineering.',
    skills: [
      { name: 'Python', tier: 'Expert' },
      { name: 'Django REST Framework', tier: 'Expert' },
      { name: 'SQL', tier: 'Advanced' },
    ],
  },
  {
    category: 'Cloud & Data',
    blurb: 'Provisioning, pipelines and reporting across three clouds.',
    skills: [
      { name: 'Microsoft Azure', tier: 'Expert' },
      { name: 'Azure Data Factory', tier: 'Advanced' },
      { name: 'Azure Synapse', tier: 'Proficient' },
      { name: 'Azure Data Lake', tier: 'Proficient' },
      { name: 'Azure Blob Storage & CDN', tier: 'Advanced' },
      { name: 'Amazon Web Services (AWS)', tier: 'Advanced' },
      { name: 'AWS EKS / Lambda / S3 / RDS', tier: 'Advanced' },
      { name: 'AWS CloudFormation', tier: 'Proficient' },
      { name: 'Google Cloud Platform', tier: 'Proficient' },
      { name: 'Google BigQuery', tier: 'Proficient' },
      { name: 'Databricks', tier: 'Proficient' },
      { name: 'Power BI', tier: 'Proficient' },
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
    category: 'Integration',
    blurb: 'Connecting services together, documented and testable.',
    skills: [
      { name: 'REST API integration', tier: 'Expert' },
      { name: 'Third-party API integration', tier: 'Advanced' },
      { name: 'Stripe API', tier: 'Proficient' },
      { name: 'Swagger / OpenAPI', tier: 'Advanced' },
      { name: 'Postman', tier: 'Advanced' },
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
      'Manage inbound customer support queries through Freshdesk and Freshservice within SLA-bound queues, escalating unresolved issues to internal IT teams with clear technical hand-off notes.',
      'Use SQL to query records and Excel to track and report on ticket status, coordinating with cross-functional teams via Trello to keep workflows visible.',
    ],
    tags: ['SQL', 'Freshdesk', 'Freshservice', 'Trello'],
  },
  {
    role: 'Central Operations Administrator',
    company: 'BCA UK',
    period: 'Aug 2024 – Aug 2026',
    highlights: [
      'Supported UK automotive dealers on a vehicle services helpdesk system, handling over 30 tickets daily while maintaining direct communication with dealers, internal stakeholders and C-suite contacts.',
      'Produced operational reporting on request and proactively surfaced recurring issues to reduce repeat queries reaching the queue.',
    ],
    tags: ['Stakeholder management', 'Reporting', 'Process improvement'],
  },
  {
    role: 'Software Engineer',
    company: 'Prismware Technologies',
    period: 'Dec 2020 – Sep 2023',
    highlights: [
      'Built .tf Terraform configuration from scratch alongside a colleague to provision Azure and Google Cloud Platform virtual machines and databases, as part of an ongoing internal infrastructure automation project.',
      'Developed a Jenkins CI/CD pipeline and supporting automation scripts from scratch with a colleague, and resolved version, library and compatibility issues in Docker builds pushed to Azure Container Registry.',
      'Designed and deployed a daily scheduled Python and Django Kubernetes CronJob on AWS EKS that replaced a manual daily reporting process, authoring manifests and Helm chart values for related workloads.',
      'Fed a Power BI reporting dataset with an Azure Data Factory ETL pipeline, partnering with the Power BI development team to validate the data model and reviewing dashboards for accuracy.',
      'Delivered the media storage and delivery pipeline for a video and social media application using Azure Blob Storage and Azure CDN, and documented integrated REST APIs with Swagger/OpenAPI.',
    ],
    tags: ['Python', 'Django', 'Terraform', 'Jenkins', 'Docker', 'AWS EKS', 'Kubernetes', 'Azure Data Factory', 'Power BI'],
  },
]

export const impactStats = [
  { value: 3, suffix: '+', label: 'years production engineering' },
  { value: 30, suffix: '+', label: 'support tickets handled daily' },
  { value: 3, suffix: '', label: 'cloud platforms in production (Azure, AWS, GCP)' },
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
  year: string
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
