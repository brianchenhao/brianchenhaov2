// About-section copy. Plain TS so it's easy to grep and easy to swap without
// touching JSX. If you want a richer structure later (paragraph blocks,
// pull-quote, etc.) extend the shape — the consumer just renders what's here.

export type About = {
  // Short hero-line bio, also reused on the hero column.
  tagline: string
  // Longer prose for the About section. Each entry becomes its own paragraph.
  paragraphs: string[]
  // Three or four high-level facts, e.g. "based in {city}", "{N} years writing
  // TypeScript". Keep them concrete but never PII — no street, no phone.
  facts: { label: string; value: string }[]
}

export const about: About = {
  tagline:
    'Final-year CS student shipping production tools — a multi-tenant AI POS and an open-source ASGI security middleware on PyPI.',
  paragraphs: [
    "I'm Brian. Final-year Computer Science student at INTI International University, working across mobile (Flutter), backend (FastAPI / SQLAlchemy), and applied AI (YOLO, LLM function calling).",
    "My flagship work is two things. GEYAM — an AI-powered multi-tenant restaurant POS with real-time food tray recognition via fine-tuned YOLO, plus an LLM assistant that answers natural-language questions about live sales through function calling. And Antsilk — a drop-in ASGI security middleware published to PyPI that protects FastAPI apps with rate limiting, WAF pattern scanning, JWT validation, and structured attack logging in two lines of install.",
    'I like building things that fail loudly, ship in a single docker compose, and explain themselves in a README. CAPM-certified. Currently looking for internships in software engineering, AI/ML, or backend infrastructure.',
  ],
  facts: [
    { label: 'focus', value: 'AI plumbing, security middleware, multi-tenant systems' },
    { label: 'stack', value: 'Python / Dart / TypeScript' },
    { label: 'looking for', value: 'internships — SWE, AI/ML, backend infra' },
  ],
}
