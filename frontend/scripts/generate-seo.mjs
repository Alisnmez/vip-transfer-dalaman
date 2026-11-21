import { destinationRoutes } from './destination-routes.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import { localizedRouteCopy, routeLanguagePath, routeLanguages } from '../src/shared/localization/route-locales.ts'

const siteUrl = process.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
const isProductionSite = Boolean(siteUrl && /^https:\/\/[a-z0-9.-]+$/i.test(siteUrl) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(siteUrl))
const routes = ['/', '/routes', ...destinationRoutes.map(({ slug }) => `/routes/${slug}`), '/vehicles', '/services', '/contact', '/faq', '/reviews', '/guides/dalaman-airport-to-marmaris']
routes.push(...Object.keys(localizedRouteCopy).flatMap(slug =>
  routeLanguages.filter(language => language !== 'en').map(language => routeLanguagePath(slug, language)),
))

await mkdir('public', { recursive: true })
if (isProductionSite) {
  const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  const urls = routes.map((route) => '  <url><loc>' + escapeXml(siteUrl + route) + '</loc></url>').join('\n')
  await writeFile('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n')
  // Crawlers need access to booking routes to read the app shell's noindex tag.
  await writeFile('public/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ' + siteUrl + '/sitemap.xml\n')
} else {
  await writeFile('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n')
  await writeFile('public/robots.txt', 'User-agent: *\nDisallow: /\n')
}
console.log(isProductionSite ? 'SEO sitemap enabled for ' + siteUrl : 'SEO indexing disabled: production domain not configured')
