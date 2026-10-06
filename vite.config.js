import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Public site URL for canonical/OG tags, sitemap and robots.txt.
// Set VITE_SITE_URL to use a custom domain; on Vercel the production URL is picked up automatically.
const siteUrl = (
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '')

function seo() {
  return {
    name: 'broommm-seo',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        // Tags that need an absolute URL are kept only when the site URL is known
        return html.replace(/<!--abs:([\s\S]*?)-->/g, (_, tag) =>
          siteUrl ? tag.replaceAll('__SITE_URL__', siteUrl) : '',
        )
      },
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`,
      })
      if (siteUrl) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
})
