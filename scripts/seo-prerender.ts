/* Build-time SEO prerender.
 *
 * The app mounts with createRoot(), not hydrateRoot(), so React *replaces*
 * whatever sits inside #root on first paint. That makes it safe to ship a
 * static snapshot of the same content in the HTML: crawlers and non-JS clients
 * (Bing, LinkedIn's scraper, most AI crawlers) get the full text, browsers get
 * the real app a moment later, and there is no hydration mismatch to worry
 * about.
 *
 * Everything below is generated from the same src/data modules the components
 * render from, so the static copy cannot drift from the live copy — which also
 * keeps it clear of anything that looks like cloaking.
 */
import { about } from '../src/data/about'
import { certifications } from '../src/data/certifications'
import { experience } from '../src/data/experience'
import { extracurriculars } from '../src/data/extracurriculars'
import { profile } from '../src/data/profile'
import { projects } from '../src/data/projects'
import { skillGroups } from '../src/data/skills'

const SITE = 'https://brianchenhao.com'

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function month(v: string): string {
  if (v === 'present') return 'Present'
  const [y, m] = v.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return m ? `${names[Number(m) - 1] ?? m} ${y}` : v
}

/** Static mirror of the rendered page, in document order. */
export function buildStaticMarkup(): string {
  const parts: string[] = ['<div id="seo-static">']

  parts.push('<header><p>' + esc(profile.role) + '</p>')
  parts.push('<h1>' + esc(profile.name) + '</h1>')
  parts.push('<p>' + esc(about.tagline) + '</p>')
  parts.push(
    `<a href="${esc(profile.linkedinUrl)}" rel="noreferrer noopener">Connect on LinkedIn</a>`,
  )
  parts.push('</header>')

  parts.push('<section id="about-static"><h2>About</h2>')
  for (const p of about.paragraphs) parts.push('<p>' + esc(p) + '</p>')
  parts.push('<ul>')
  for (const f of about.facts) {
    parts.push('<li><strong>' + esc(f.label) + ':</strong> ' + esc(f.value) + '</li>')
  }
  parts.push('</ul></section>')

  parts.push('<section id="skills-static"><h2>Technical skills</h2>')
  for (const g of skillGroups) {
    parts.push('<h3>' + esc(g.title) + '</h3>')
    parts.push('<ul>' + g.items.map((i) => '<li>' + esc(i) + '</li>').join('') + '</ul>')
  }
  parts.push('</section>')

  parts.push('<section id="projects-static"><h2>Projects</h2>')
  for (const p of projects) {
    parts.push('<article><h3>' + esc(p.name) + '</h3>')
    parts.push('<p>' + esc(p.tagline) + '</p>')
    parts.push('<p>' + esc(p.description) + '</p>')
    parts.push('<ul>' + p.stack.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ul>')
    if (p.links?.live) {
      parts.push(`<a href="${esc(p.links.live)}" rel="noreferrer noopener">Live site</a>`)
    }
    if (p.links?.repo) {
      parts.push(`<a href="${esc(p.links.repo)}" rel="noreferrer noopener">Source code</a>`)
    }
    parts.push('</article>')
  }
  parts.push('</section>')

  parts.push('<section id="experience-static"><h2>Experience</h2>')
  for (const e of experience) {
    parts.push('<article><h3>' + esc(e.role) + ' — ' + esc(e.org) + '</h3>')
    parts.push('<p>' + month(e.start) + ' – ' + month(e.end) + '</p>')
    parts.push('<ul>' + e.bullets.map((b) => '<li>' + esc(b) + '</li>').join('') + '</ul>')
    parts.push('</article>')
  }
  parts.push('</section>')

  parts.push('<section id="certifications-static"><h2>Certifications</h2><ul>')
  for (const c of certifications) {
    parts.push('<li>' + esc(c.name) + ' — ' + esc(c.issuer) + ', ' + c.year + '</li>')
  }
  parts.push('</ul></section>')

  parts.push('<section id="extracurriculars-static"><h2>Extracurriculars</h2>')
  for (const x of extracurriculars) {
    parts.push('<article><h3>' + esc(x.role) + ' — ' + esc(x.org) + '</h3>')
    parts.push('<p>' + month(x.start) + ' – ' + month(x.end) + '</p>')
    parts.push('<p>' + esc(x.summary) + '</p></article>')
  }
  parts.push('</section>')

  parts.push('<section id="references-static"><h2>References</h2>')
  parts.push(
    '<p>References from prior managers and collaborators are available on ' +
      `request. Reach out via <a href="${esc(profile.linkedinUrl)}" ` +
      `rel="noreferrer noopener">LinkedIn</a> and I'll be glad to put you in ` +
      'touch.</p></section>',
  )

  parts.push('</div>')
  return parts.join('')
}

/** ItemList of projects, so each one can surface as its own entity. */
export function buildProjectsJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Projects by ${profile.name}`,
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: p.name,
        description: p.description,
        applicationCategory: 'DeveloperApplication',
        ...(p.links?.live ? { url: p.links.live } : {}),
        ...(p.links?.repo ? { codeRepository: p.links.repo } : {}),
        keywords: p.stack.join(', '),
        author: { '@type': 'Person', name: profile.name, url: `${SITE}/` },
      },
    })),
  }
  // Escaping "<" keeps a stray "</script>" inside any description from ending
  // the script block early.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/* Minimal styling for the snapshot. index.css is a render-blocking <link>, so
 * by the time this paints the page already has the dark background, light text
 * and mono font — this only adds width and rhythm so the pre-React frame reads
 * as a plain document rather than a wall of text. It is visible, never hidden:
 * showing crawlers markup that users cannot see is exactly what gets a site
 * flagged for cloaking. */
export const STATIC_STYLE = `
#seo-static{max-width:64rem;margin:0 auto;padding:3rem 1.5rem;line-height:1.6}
#seo-static h1{font-size:2.25rem;margin:.5rem 0}
#seo-static h2{font-size:1.5rem;margin:2.5rem 0 .5rem}
#seo-static h3{font-size:1.05rem;margin:1.25rem 0 .25rem}
#seo-static ul{padding-left:1.25rem}
#seo-static a{color:#60a5fa}
#seo-static article{margin-bottom:1.5rem}
`.trim()
