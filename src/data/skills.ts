// Skill buckets. Seven groups per the plan — keep the count if you can, the
// Skills grid is sized for it. If you genuinely need more, the grid wraps fine.
// Each item is a short token, not a sentence — recruiters skim this.

export type SkillGroup = {
  title: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'languages',
    items: ['Python', 'Dart', 'JavaScript', 'TypeScript', 'SQL', 'Bash'],
  },
  {
    title: 'frontend',
    items: ['Flutter', 'React', 'Vite', 'HTML', 'CSS', 'Tailwind'],
  },
  {
    title: 'backend',
    items: ['FastAPI', 'SQLAlchemy', 'Alembic', 'PostgreSQL', 'Redis', 'Firebase'],
  },
  {
    title: 'cloud / infra',
    items: ['Docker', 'AWS Amplify', 'Cloudflare', 'Cloudflare Tunnel', 'DigitalOcean', 'Hostinger'],
  },
  {
    title: 'ai / llm',
    items: ['YOLO (Ultralytics)', 'Qwen 2.5 LLM', 'function calling', 'Gemini API', 'Pandas', 'NumPy'],
  },
  {
    title: 'security',
    items: ['ASGI middleware', 'WAF pattern scanning', 'rate limiting', 'JWT / OAuth 2.0', 'CORS hardening'],
  },
  {
    title: 'tooling',
    items: ['Git', 'REST APIs', 'WebSockets', 'multi-tenant architecture', 'Billplz', 'Apros'],
  },
]
