// Projects shown on the home page. Order = priority — the first card is the
// one a recruiter sees first, so keep the most impressive piece at the top.
// Managed from portal.brianchenhao.com via content.json.

import content from './content.json'

export type Project = {
  name: string
  // One-sentence pitch. Plain language, no buzzwords.
  tagline: string
  // 2–4 sentences that explain what the project does and what was technically
  // interesting about it. Avoid jargon a non-engineer can't parse.
  description: string
  stack: string[]
  // Optional outbound links. Omit a key to hide the link.
  links?: {
    live?: string
    repo?: string
  }
  // Optional tag used for visual grouping ("flagship", "hackathon", "ongoing").
  tag?: 'flagship' | 'hackathon' | 'ongoing'
}

// Cast: JSON widens the `tag` literals to plain string; the portal's editor
// only offers the three valid values.
export const projects: Project[] = content.projects as Project[]
