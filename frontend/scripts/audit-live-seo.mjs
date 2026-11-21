// Read-only SEO audit. Run: node frontend/scripts/audit-live-seo.mjs
// GET requests only; no Search Console, booking, database, or deployment writes.
const origin = new URL(process.env.SEO_AUDIT_ORIGIN || 'https://dalamanway.com')
if (origin.protocol !== 'https:' || !['dalamanway.com', 'www.dalamanway.com'].includes(origin.hostname) ||
    origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
  throw new Error('SEO audit origin must be an approved DalamanWay HTTPS origin')
}

let failures = 0
const report = (item) => {
  if (!item.ok) failures++
  console.log(JSON.stringify(item))
}
const fetchPage = async (path) => {
  const response = await fetch(new URL(path, origin), {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    headers: { 'user-agent': 'DalamanWay-ReadOnly-SEO-Audit/1.0' },
  })
  const url = new URL(response.url)
  if (url.hostname !== origin.hostname || url.protocol !== 'https:') {
    throw new Error('Unexpected redirect outside approved HTTPS host')
  }
  return { response, body: await response.text() }
}
const attribute = (tag, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return tag.match(new RegExp('(?:^|\\s)' + escaped + '\\s*=\\s*(["\\\'])(.*?)\\1', 'i'))?.[2] || ''
}
const tags = (html, name) => [...html.matchAll(new RegExp('<' + name + '\\b[^>]*>', 'gi'))].map(m => m[0])
const canonicalHref = (html) => tags(html, 'link')
  .filter(tag => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'))
  .map(tag => attribute(tag, 'href'))
const robotsContent = (html) => tags(html, 'meta')
  .filter(tag => attribute(tag, 'name').toLowerCase() === 'robots')
  .map(tag => attribute(tag, 'content').toLowerCase())

async function check(path, kind) {
  try {
    const { response, body } = await fetchPage(path)
    const canonical = canonicalHref(body)
    const robots = robotsContent(body)
    const expectedUrl = new URL(path, origin).href
    const noindex = robots.some(value => /(?:^|[,\s])noindex(?:[,\s]|$)/i.test(value))
    const ok = kind === 'public'
      ? response.status === 200 && canonical.length === 1 && canonical[0] === expectedUrl && !noindex
      : kind === 'private'
        ? response.status === 200 && noindex
        : kind === 'missing'
          ? response.status === 404
          : response.status === 200
    report({ path, kind, status: response.status, canonical, robots, ok })
  } catch (error) {
    report({ path, kind, ok: false, error: String(error) })
  }
}

let sitemapPaths = []
try {
  const { response, body } = await fetchPage('/sitemap.xml')
  const locations = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m => m[1].trim())
  const urls = locations.map(loc => new URL(loc))
  const valid = response.status === 200 && urls.length === 28 &&
    urls.every(url => url.origin === origin.origin && !url.search && !url.hash) &&
    new Set(urls.map(url => url.pathname)).size === urls.length
  sitemapPaths = valid ? urls.map(url => url.pathname) : []
  report({ path: '/sitemap.xml', kind: 'sitemap', status: response.status, urlCount: urls.length, unique: new Set(urls.map(url => url.pathname)).size, ok: valid })
} catch (error) {
  report({ path: '/sitemap.xml', kind: 'sitemap', ok: false, error: String(error) })
}
for (const path of sitemapPaths) await check(path, 'public')
await check('/robots.txt', 'resource')
for (const path of ['/booking', '/admin']) await check(path, 'private')
for (const path of ['/routes/not-a-real-destination', '/not-a-real-page']) await check(path, 'missing')
console.log(JSON.stringify({ summary: { sitemapUrlsChecked: sitemapPaths.length, failures, passed: failures === 0 } }))
if (failures) process.exitCode = 1
