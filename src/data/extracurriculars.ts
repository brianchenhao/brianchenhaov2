// Extracurricular roles — community, open source, volunteering, sport. Same
// shape as Experience but the bullets lean less on KPI-style impact and more
// on what was done.

export type Extracurricular = {
  role: string
  org: string
  start: string // 'YYYY-MM'
  end: string | 'present'
  summary: string
}

export const extracurriculars: Extracurricular[] = [
  {
    role: 'Treasurer',
    org: 'INTI Tech Club',
    start: '2024-01',
    end: '2024-12',
    summary:
      'Managed club finances and coordinated external communications for tech events. Handled event planning end-to-end.',
  },
  {
    role: 'Maintainer',
    org: 'Antsilk (open source)',
    start: '2025-01',
    end: 'present',
    summary:
      'Maintain the Antsilk ASGI security middleware on PyPI — issue triage, release cuts, and production telemetry from the Geyam deployment.',
  },
]
