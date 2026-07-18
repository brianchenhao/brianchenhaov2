// Single source of truth for the handful of "who is this site about" fields
// that get reused across Hero, Footer, OG tags, etc. PII rules: no email,
// no phone, no postal address. LinkedIn and GitHub URLs are professional
// presence and are fine to publish.

export const profile = {
  name: 'Brian Chen Jun Hao',
  role: 'Software Engineer · Final-year CS',
  // LinkedIn is the *only* contact CTA on the site. Recruiters DM here and
  // Brian shares the resume 1:1 after intro — that's the policy.
  linkedinUrl: 'https://www.linkedin.com/in/brianchenhao',
  githubUrl: 'https://github.com/brianchenhao',
} as const
