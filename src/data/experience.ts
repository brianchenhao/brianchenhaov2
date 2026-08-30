// Experience entries, newest first. Dates use 'YYYY-MM' so they sort cleanly
// and so a future "compute duration" helper has structured input. Use 'present'
// for the current role's end date.
// Managed from portal.brianchenhao.com via content.json.

import content from './content.json'

export type Experience = {
  role: string
  org: string
  start: string // 'YYYY-MM'
  end: string | 'present'
  // 2–4 short bullets, each one self-contained. Lead with the impact, not the
  // tooling. "Cut p95 from 800ms to 90ms" before "rewrote in Go".
  bullets: string[]
}

export const experience: Experience[] = content.experience
