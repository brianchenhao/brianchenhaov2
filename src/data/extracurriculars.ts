// Extracurricular roles — community, open source, volunteering, sport. Same
// shape as Experience but the bullets lean less on KPI-style impact and more
// on what was done.
// Managed from portal.brianchenhao.com via content.json.

import content from './content.json'

export type Extracurricular = {
  role: string
  org: string
  start: string // 'YYYY-MM'
  end: string | 'present'
  summary: string
}

export const extracurriculars: Extracurricular[] = content.extracurriculars
