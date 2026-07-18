// Experience entries, newest first. Dates use 'YYYY-MM' so they sort cleanly
// and so a future "compute duration" helper has structured input. Use 'present'
// for the current role's end date.

export type Experience = {
  role: string
  org: string
  start: string // 'YYYY-MM'
  end: string | 'present'
  // 2–4 short bullets, each one self-contained. Lead with the impact, not the
  // tooling. "Cut p95 from 800ms to 90ms" before "rewrote in Go".
  bullets: string[]
}

export const experience: Experience[] = [
  {
    role: 'Digital Strategy Intern',
    org: 'Yokogawa',
    start: '2023-05',
    end: '2023-07',
    bullets: [
      'Automated laptop provisioning scripts, cutting setup time from ~20 to ~5 minutes per machine.',
      'Built update-notification flow that reduced reminder turnaround from ~45 to ~15 minutes per rollout.',
      'Supported hardware procurement, including vendor sourcing and requisitions.',
      'Resolved hardware, software, and network issues remotely (AnyDesk) and on-site.',
    ],
  },
]
