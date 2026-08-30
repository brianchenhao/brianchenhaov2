// About-section copy. Managed from portal.brianchenhao.com — content.json is
// regenerated from Supabase by scripts/fetch-content.mjs at build time. If you
// want a richer structure later (paragraph blocks, pull-quote, etc.) extend
// the shape — the consumer just renders what's here.

import content from './content.json'

export type About = {
  // Short hero-line bio, also reused on the hero column.
  tagline: string
  // Longer prose for the About section. Each entry becomes its own paragraph.
  paragraphs: string[]
  // Three or four high-level facts, e.g. "based in {city}", "{N} years writing
  // TypeScript". Keep them concrete but never PII — no street, no phone.
  facts: { label: string; value: string }[]
}

export const about: About = content.about
