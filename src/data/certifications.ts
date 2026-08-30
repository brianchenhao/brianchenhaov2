// Certifications, newest first. Keep year-only granularity — month adds noise
// without adding signal.
// Managed from portal.brianchenhao.com via content.json.

import content from './content.json'

export type Certification = {
  name: string
  issuer: string
  year: number
  // Optional verification link (Credly, issuer page, etc.). External only —
  // do not link to anything that exposes contact details.
  href?: string
}

export const certifications: Certification[] = content.certifications
