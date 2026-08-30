// Skill buckets. Seven groups per the plan — keep the count if you can, the
// Skills grid is sized for it. If you genuinely need more, the grid wraps fine.
// Each item is a short token, not a sentence — recruiters skim this.
// Managed from portal.brianchenhao.com via content.json.

import content from './content.json'

export type SkillGroup = {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = content.skills
