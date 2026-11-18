import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const source = resolve('scripts/prerender-routes.mjs')
const routesSource = resolve('scripts/destination-routes.mjs')
const template = '<html><head><title>Default</title><meta name="description" content="Default" /><meta name="robots" content="noindex,nofollow" /></head><body><div id="root"></div><script src="/assets/main.js"></script></body></html>'

async function run(domain, page = 'routes/fethiye') {
  const folder = await mkdtemp(join(tmpdir(), 'vip-prerender-'))
  try {
    await mkdir(join(folder, 'dist'))
    await writeFile(join(folder, 'dist/index.html'), template)
    await cp(source, join(folder, 'prerender-routes.mjs'))
    await cp(routesSource, join(folder, 'destination-routes.mjs'))
    const result = spawnSync(process.execPath, ['prerender-routes.mjs'], {
      cwd: folder,
      encoding: 'utf8',
      env: { ...process.env, VITE_PUBLIC_SITE_URL: domain },
    })
    assert.equal(result.status, 0, result.stderr)
    return await readFile(join(folder, 'dist', page, 'index.html'), 'utf8')
  } finally {
    await rm(folder, { recursive: true, force: true })
  }
}

test('staging prerender has readable content but no indexing', async () => {
  const html = await run('https://vip-transfer-dalaman-test.onrender.com')
  assert.match(html, /Dalaman Airport to Fethiye/)
  assert.match(html, /noindex,nofollow/)
  assert.doesNotMatch(html, /rel="canonical"/)
  assert.match(html, /src="\/assets\/main.js"/)
})

test('production prerender provides canonical and metadata in initial HTML', async () => {
  const html = await run('https://example.com/')
  assert.match(html, /content="index,follow"/)
  assert.match(html, /rel="canonical" href="https:\/\/example.com\/routes\/fethiye"/)
  assert.match(html, /<h1>Dalaman Airport to Fethiye/)
  assert.match(html, /<meta name="description" content="Plan a private Dalaman Airport to Fethiye transfer/)
})


test('staging landing pages keep noindex and do not advertise canonical URLs', async () => {
  for (const page of ['', 'routes', 'faq']) {
    const html = await run('https://vip-transfer-dalaman-test.onrender.com', page)
    assert.match(html, /<meta name="robots" content="noindex,nofollow"/)
    assert.doesNotMatch(html, /rel="canonical"/)
    assert.match(html, /<h1>[^<]+<\/h1>/)
  }
})

test('production landing pages have distinct initial HTML metadata', async () => {
  const home = await run('https://example.com', '')
  const routes = await run('https://example.com', 'routes')
  assert.match(home, /<title>Dalaman Airport Transfers \| DalamanWay<\/title>/)
  assert.match(home, /rel="canonical" href="https:\/\/example.com\/"/)
  assert.match(routes, /rel="canonical" href="https:\/\/example.com\/routes"/)
  assert.match(routes, /href="\/routes\/fethiye"/)
  assert.match(routes, /content="index,follow"/)
  assert.notEqual(home, routes)
})

test('all supported route pages have unique production canonicals', async () => {
  const slugs = ['marmaris', 'fethiye', 'oludeniz', 'gocek', 'icmeler']
  for (const slug of slugs) {
    const html = await run('https://example.com/', `routes/${slug}`)
    assert.match(html, new RegExp(`rel="canonical" href="https://example.com/routes/${slug}"`))
    assert.match(html, /<meta name="robots" content="index,follow"/)
    assert.match(html, /<h1>[^<]+<\/h1>/)
  }
})

test('unconfigured domain does not expose indexable landing pages', async () => {
  for (const page of ['', 'routes', 'faq']) {
    const html = await run('', page)
    assert.match(html, /<meta name="robots" content="noindex,nofollow"/)
    assert.doesNotMatch(html, /rel="canonical"/)
  }
})

test('every public landing page stays noindex on staging', async () => {
  const pages = ['', 'vehicles', 'services', 'contact', 'faq', 'reviews', 'routes']
  for (const page of pages) {
    const html = await run('https://vip-transfer-dalaman-test.onrender.com', page)
    assert.match(html, /<meta name="robots" content="noindex,nofollow"/)
    assert.doesNotMatch(html, /rel="canonical"/)
    assert.match(html, /<h1>[^<]+<\/h1>/)
  }
})

test('all public landing pages have their own production canonical', async () => {
  const pages = ['', 'vehicles', 'services', 'contact', 'faq', 'reviews', 'routes']
  for (const page of pages) {
    const html = await run('https://example.com', page)
    const canonical = `https://example.com/${page}`
    assert.ok(html.includes(`rel="canonical" href="${canonical}"`))
    assert.match(html, /<meta name="robots" content="index,follow"/)
    assert.match(html, /<title>[^<]+<\/title>/)
  }
})
