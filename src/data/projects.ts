// Projects shown on the home page. Order = priority — the first card is the
// one a recruiter sees first, so keep the most impressive piece at the top.

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

export const projects: Project[] = [
  {
    name: 'GEYAM',
    tagline: 'AI-powered multi-tenant restaurant POS with live vision + LLM assistant.',
    description:
      'Cross-platform POS with multi-tenant isolation, real-time food tray recognition via a fine-tuned YOLO model, and an LLM assistant ("GEYAM, tell me sales today") that uses function calling to query live transactions. Integrated Billplz payments and deployed end-to-end with custom DNS via Cloudflare.',
    stack: ['Flutter', 'FastAPI', 'YOLO (Ultralytics)', 'Qwen 2.5 LLM', 'PostgreSQL', 'Billplz', 'Cloudflare'],
    links: { live: 'https://geyam.com' },
    tag: 'flagship',
  },
  {
    name: 'Antsilk',
    tagline: 'Open-source ASGI security middleware for FastAPI — two lines to install.',
    description:
      'Drop-in Python library that protects ASGI apps with bundled rate limiting, WAF pattern scanning, JWT validation, and structured attack logging. Two-line install. Published to PyPI; deployed on Geyam in production for live attack telemetry.',
    stack: ['Python', 'ASGI', 'FastAPI', 'PyPI'],
    links: { live: 'https://antsilk.com' },
    tag: 'flagship',
  },
  {
    name: 'brianchenhao.com',
    tagline: 'This site, v2. 3D head-tracking character, scroll animation, Gemini-backed chat.',
    description:
      'Single-page React + Vite portfolio with a rigged GLB whose head bone follows the cursor and Motion-driven animation throughout. The chat box is backed by a Supabase Edge Function that rate-limits per IP via Postgres and proxies to Gemini — no servers to keep alive. Frontend hosted on Vercel.',
    stack: ['React 19', 'Vite', 'Motion', 'react-three-fiber', 'Supabase Edge Functions', 'Gemini 2.5 Flash', 'Vercel'],
    links: { repo: 'https://github.com/brianchenhao/brianchenhaov2' },
    tag: 'ongoing',
  },
  {
    name: 'AI Medical chat — Great Malaysia AI Hackathon 2025',
    tagline: 'Hackathon: AI medical chat system deployed on AWS Amplify. Top 15 finalist.',
    description:
      'Co-built and deployed an AI medical chat system on AWS Amplify in a 48-hour team hackathon. Reached top 15 out of the open field.',
    stack: ['AWS Amplify', 'LLM', 'React'],
    tag: 'hackathon',
  },
  {
    name: 'GboBuy — dEVMatch 2024',
    tagline: 'Hackathon: decentralised e-commerce on Aptos. 2nd place.',
    description:
      'Co-built GboBuy, a decentralised e-commerce platform on the Aptos blockchain with smart-contract-backed listings and escrow. Placed 2nd in a 48-hour team hackathon.',
    stack: ['Aptos', 'Move', 'Smart Contracts', 'React'],
    tag: 'hackathon',
  },
]
