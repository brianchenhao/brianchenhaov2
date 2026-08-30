import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {
  STATIC_STYLE,
  buildProjectsJsonLd,
  buildStaticMarkup,
} from './scripts/seo-prerender'

/* Ships a static snapshot of the page inside #root, plus ItemList structured
 * data for the projects. Build-only: in dev the app mounts instantly and the
 * snapshot would just be noise. See scripts/seo-prerender.ts for why this is
 * safe with createRoot(). */
function seoPrerender() {
  return {
    name: 'seo-prerender',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      if (!html.includes('<div id="root"></div>')) {
        throw new Error(
          'seo-prerender: could not find <div id="root"></div> in index.html',
        )
      }

      return html
        .replace('<div id="root"></div>', `<div id="root">${buildStaticMarkup()}</div>`)
        .replace(
          '</head>',
          `  <style>${STATIC_STYLE}</style>\n` +
            `    <script type="application/ld+json">${buildProjectsJsonLd()}</script>\n` +
            `  </head>`,
        )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPrerender()],
})
