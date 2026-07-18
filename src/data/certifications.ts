// Certifications, newest first. Keep year-only granularity — month adds noise
// without adding signal.

export type Certification = {
  name: string
  issuer: string
  year: number
  // Optional verification link (Credly, issuer page, etc.). External only —
  // do not link to anything that exposes contact details.
  href?: string
}

export const certifications: Certification[] = [
  {
    name: 'CAPM — Certified Associate in Project Management',
    issuer: 'PMI',
    year: 2026,
  },
  {
    name: 'AWS Academy Graduate — Generative AI Foundations',
    issuer: 'AWS',
    year: 2025,
  },
  {
    name: 'AWS Academy Graduate — Machine Learning for NLP',
    issuer: 'AWS',
    year: 2025,
  },
  {
    name: 'Artificial Intelligence Fundamentals',
    issuer: 'IBM',
    year: 2025,
  },
  {
    name: 'CCNA: Introduction to Networks',
    issuer: 'Cisco',
    year: 2025,
  },
]
