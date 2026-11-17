import { mkdir, writeFile } from 'node:fs/promises'

const siteUrl = process.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
const isProductionSite = Boolean(siteUrl && /^https:\/\/[a-z0-9.-]+$/i.test(siteUrl) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(siteUrl))
const routes = ['/', '/routes', '/routes/marmaris', '/routes/fethiye', '/routes/oludeniz', '/routes/gocek', '/routes/icmeler', '/vehicles', '/services', '/contact']

await mkdir('public', { recursive: true })
if (isProductionSite) {
  const escapeXml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
  const urls = routes.map((route) => '  <url><loc>' + escapeXml(siteUrl + route) + '</loc></url>').join('\n')
  await writeFile('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '\n</urlset>\n')
  await writeFile('public/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /booking\nSitemap: ' + siteUrl + '/sitemap.xml\n')
} else {
  await writeFile('public/sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n')
  await writeFile('public/robots.txt', 'User-agent: *\nDisallow: /\n')
}
console.log(isProductionSite ? 'SEO sitemap enabled for ' + siteUrl : 'SEO indexing disabled: production domain not configured')
