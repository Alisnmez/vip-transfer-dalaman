// Read-only production SEO smoke audit. Run: node frontend/scripts/audit-live-seo.mjs
// Uses only GET requests. Never modifies site or Search Console data.
const origin = process.env.SEO_AUDIT_ORIGIN || 'https://dalamanway.com'
const expected = new URL(origin)
if (expected.protocol !== 'https:' || !['dalamanway.com', 'www.dalamanway.com'].includes(expected.hostname)) {
  throw new Error('Audit origin must be an approved DalamanWay HTTPS host')
}
const paths = ['/', '/robots.txt', '/sitemap.xml', '/routes/marmaris', '/routes/gocek',
  '/de/routes/marmaris', '/ru/routes/marmaris', '/booking', '/admin', '/routes/not-a-real-destination']
let failures = 0
for (const path of paths) {
  try {
    const response = await fetch(new URL(path, origin), { redirect: 'follow', signal: AbortSignal.timeout(15000) })
    const html = await response.text()
    const isPublicPage = !['/robots.txt', '/sitemap.xml', '/booking', '/admin', '/routes/not-a-real-destination'].includes(path)
    const canonical = html.match(/<link\\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0] || ''
    const robots = html.match(/<meta\\b[^>]*name=["']robots["'][^>]*>/i)?.[0] || ''
    const ok = path === '/routes/not-a-real-destination' ? response.status === 404
      : isPublicPage ? response.status === 200 && canonical.includes('dalamanway.com') && !/noindex/i.test(robots)
      : path === '/booking' || path === '/admin' ? response.status === 200 && /noindex/i.test(robots)
      : response.status === 200
    if (!ok) failures++
    console.log(JSON.stringify({ path, status: response.status, finalUrl: response.url, canonical, robots, ok }))
  } catch (error) {
    failures++
    console.error(JSON.stringify({ path, ok: false, error: String(error) }))
  }
}
if (failures) {
  console.error(`SEO audit failed: ${failures} checks`)
  process.exitCode = 1
} else console.log('SEO audit passed')
