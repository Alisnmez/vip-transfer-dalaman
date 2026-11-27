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
  return tag.match(new RegExp("(?:^|\\s)" + escaped + "\\s*=\\s*([\\\"'])(.*?)\\1", 'i'))?.[2] || ''
}
const tags = (html, name) => [...html.matchAll(new RegExp('<' + name + '\\b[^>]*>', 'gi'))].map(m => m[0])
const canonicalHref = (html) => tags(html, 'link')
  .filter(tag => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('canonical'))
  .map(tag => attribute(tag, 'href'))
const robotsContent = (html) => tags(html, 'meta')
  .filter(tag => attribute(tag, 'name').toLowerCase() === 'robots')
  .map(tag => attribute(tag, 'content').toLowerCase())


const hreflangLinks = (html) => tags(html, 'link')
  .filter(tag => attribute(tag, 'rel').toLowerCase().split(/\s+/).includes('alternate') && attribute(tag, 'hreflang'))
  .map(tag => ({ language: attribute(tag, 'hreflang').toLowerCase(), href: attribute(tag, 'href') }))
const localizedSlugs = new Set(['marmaris', 'fethiye', 'oludeniz', 'icmeler', 'dalyan', 'sarigerme', 'gocek'])
function checkHreflang(path, body) {
  const match = path.match(/^\/(?:de\/|ru\/)?routes\/([^/]+)$/)
  if (!match || !localizedSlugs.has(match[1])) return
  const base = '/routes/' + match[1]
  const expected = { en: base, de: '/de' + base, ru: '/ru' + base, 'x-default': base }
  const links = hreflangLinks(body)
  const ok = links.length === Object.keys(expected).length &&
    Object.entries(expected).every(([language, target]) =>
      links.filter(link => link.language === language && link.href === new URL(target, origin).href).length === 1 &&
      sitemapPaths.includes(target))
  report({ path, kind: 'hreflang', links, ok })
}

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
    if (kind === 'public') checkHreflang(path, body)
  } catch (error) {
    report({ path, kind, ok: false, error: String(error) })
  }
}

let sitemapPaths = []
try {
  const { response, body } = await fetchPage('/sitemap.xml')
  const locations = [...body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map(m => m[1].trim())
  const urls = locations.map(loc => new URL(loc))
  const valid = response.status === 200 && urls.length > 0 &&
    urls.every(url => url.origin === origin.origin && !url.search && !url.hash) &&
    new Set(urls.map(url => url.pathname)).size === urls.length
  sitemapPaths = valid ? urls.map(url => url.pathname) : []
  report({ path: '/sitemap.xml', kind: 'sitemap', status: response.status, urlCount: urls.length, unique: new Set(urls.map(url => url.pathname)).size, ok: valid })
} catch (error) {
  report({ path: '/sitemap.xml', kind: 'sitemap', ok: false, error: String(error) })
}
for (const slug of localizedSlugs) {
  for (const prefix of ['', '/de', '/ru']) {
    const path = prefix + '/routes/' + slug
    if (!sitemapPaths.includes(path)) report({ path, kind: 'hreflang-sitemap', ok: false })
  }
}
for (const path of sitemapPaths) await check(path, 'public')
await check('/robots.txt', 'resource')
for (const path of ['/booking/passenger', '/booking/confirmation', '/admin']) await check(path, 'private')
for (const path of ['/routes/not-a-real-destination', '/not-a-real-page']) await check(path, 'missing')
console.log(JSON.stringify({ summary: { sitemapUrlsChecked: sitemapPaths.length, failures, passed: failures === 0 } }))
if (failures) process.exitCode = 1
