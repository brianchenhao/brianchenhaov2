// Single source of truth for the handful of "who is this site about" fields
// that get reused across Hero, Footer, OG tags, etc. PII rules: no email,
// no phone, no postal address. LinkedIn and GitHub URLs are professional
// presence and are fine to publish.
//
// Values are managed from portal.brianchenhao.com — content.json is
// regenerated from Supabase by scripts/fetch-content.mjs at build time.

import content from './content.json'

export type Profile = {
  name: string
  role: string
  // LinkedIn is the *only* contact CTA on the site. Recruiters DM here and
  // Brian shares the resume 1:1 after intro — that's the policy.
  linkedinUrl: string
  githubUrl: string
}

export const profile: Profile = content.profile
