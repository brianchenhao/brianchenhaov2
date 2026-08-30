// Build-time content fetch. Pulls portal-managed content for site 'portfolio'
// from Supabase and regenerates src/data/content.json so the committed data
// modules (and the SEO prerender that imports them) pick it up.
//
// Behavior:
//   - no VITE_SUPABASE_URL/ANON_KEY locally -> keep the committed baseline
//   - no env on Vercel/CI                   -> FAIL (a misconfigured production
//                                              build must never silently ship
//                                              the stale committed baseline)
//   - env present but fetch fails           -> fail the build loudly
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Minimal .env loader (no dependency) — fills only vars not already set.
// .env.local is read first so it overrides .env, matching Vite's precedence.
for (const file of ['.env.local', '.env']) {
  const p = join(root, file)
  if (!existsSync(p)) continue
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/)
    if (!m || process.env[m[1]] !== undefined) continue
    let value = m[2].trim()
    // Strip one matched pair of surrounding quotes; otherwise leave as-is.
    if (value.length >= 2 && (value[0] === '"' || value[0] === "'") && value.endsWith(value[0])) {
      value = value.slice(1, -1)
    }
    process.env[m[1]] = value
  }
}

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
const out = join(root, 'src', 'data', 'content.json')
const SECTIONS = ['profile', 'about', 'skills', 'projects', 'experience', 'certifications', 'extracurriculars']

if (!url || !key) {
  if (process.env.VERCEL || process.env.CI) {
    console.error('[fetch-content] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing in CI — refusing to ship the stale committed baseline')
    process.exit(1)
  }
  console.warn('[fetch-content] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — keeping committed content.json')
  process.exit(0)
}

const res = await fetch(`${url}/rest/v1/portal_content?site=eq.portfolio&select=section,content`, {
  headers: { apikey: key, authorization: `Bearer ${key}` },
})
if (!res.ok) {
  console.error(`[fetch-content] Supabase responded ${res.status} ${res.statusText} — aborting build`)
  process.exit(1)
}
const rows = await res.json()
const bySection = Object.fromEntries(rows.map((r) => [r.section, r.content]))
const missing = SECTIONS.filter((s) => bySection[s] == null)
if (missing.length) {
  console.error(`[fetch-content] portal_content missing sections: ${missing.join(', ')} — aborting build`)
  process.exit(1)
}
const content = Object.fromEntries(SECTIONS.map((s) => [s, bySection[s]]))
// Write via temp file + rename so a killed build can't leave a truncated JSON.
writeFileSync(`${out}.tmp`, JSON.stringify(content, null, 2) + '\n', 'utf8')
renameSync(`${out}.tmp`, out)
console.log(`[fetch-content] wrote src/data/content.json (${SECTIONS.length} sections)`)
