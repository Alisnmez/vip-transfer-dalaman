import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve('scripts/prerender-routes.mjs')
const publicPaths = ['', 'routes', 'routes/marmaris', 'routes/fethiye', 'routes/oludeniz',
  'routes/gocek', 'routes/icmeler', 'routes/dalyan', 'routes/sarigerme', 'vehicles', 'services', 'contact', 'faq', 'reviews']
const template = '<!doctype html><html lang="en"><head><title>Template</title><meta name="description" content="Template" /><meta name="robots" content="noindex,nofollow" /></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>'

async function render(siteUrl) {
  const dir = await mkdtemp(join(tmpdir(), 'vip-prerender-seo-'))
  try {
    await mkdir(join(dir, 'dist'))
    await writeFile(join(dir, 'dist/index.html'), template)
    const result = spawnSync(process.execPath, [script], {
      cwd: dir, encoding: 'utf8',
      env: { ...process.env, VITE_PUBLIC_SITE_URL: siteUrl },
    })
    assert.equal(result.status, 0, result.stderr)
    const pages = new Map(await Promise.all(publicPaths.map(async path => [
      path, await readFile(join(dir, 'dist', path, 'index.html'), 'utf8'),
    ])))
    return { pages, shell: await readFile(join(dir, 'dist/app-shell.html'), 'utf8') }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('production prerendered route has crawlable title, description, canonical and content', async () => {
  const origin = 'https://dalamanway.com'
  const { pages } = await render(origin)
  const titles = new Set()
  for (const [path, html] of pages) {
    const canonical = origin + '/' + path
    const [title] = [...html.matchAll(/<title>([^<]+)<\/title>/g)].map(match => match[1])
    assert.ok(title && !titles.has(title), path)
    titles.add(title)
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, path)
    assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1, path)
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), path)
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`), path)
    assert.ok(html.includes(`<meta property="og:title" content="${title}"`), path)
    assert.match(html, /<meta property="og:description" content="[^"]+"/)
    assert.match(html, /<meta name="twitter:card" content="summary"/)
    assert.match(html, /<meta name="robots" content="index,follow"/)
    assert.match(html, /data-prerender-fallback/)
  }
  assert.match(pages.get('routes/marmaris'), /<h1>Dalaman Airport to Marmaris Private Transfer/)
  assert.match(pages.get('routes/marmaris'), /include the marina name and the entrance/)
  assert.match(pages.get('routes/gocek'), /For a yacht handover/)
  assert.match(pages.get('routes/dalyan'), /Use the full address for your riverside hotel/)
  assert.match(pages.get('routes/sarigerme'), /hotel confirmation gives a resort entrance/)
  const organization = pages.get('').match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]
  assert.deepEqual(JSON.parse(organization), {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'DalamanWay', url: origin + '/',
  })
  assert.doesNotMatch(pages.get('routes/dalyan'), /application\/ld\+json/)
  assert.match(pages.get('faq'), /<h1>Frequently Asked Questions<\/h1>/)
})

test('all staging pages remain noindex without production canonicals', async () => {
  for (const url of ['', 'https://dalamanway-staging.onrender.com']) {
    const { pages } = await render(url)
    for (const [path, html] of pages) {
      assert.match(html, /<meta name="robots" content="noindex,nofollow"/, path)
      assert.doesNotMatch(html, /rel="canonical"|property="og:url"|application\/ld\+json/, path)
    }
  }
})

test('SPA fallback keeps the application entry point and excludes homepage SEO metadata', async () => {
  for (const origin of ['https://dalamanway.com', '']) {
    const { shell } = await render(origin)
    assert.match(shell, /<meta name="robots" content="noindex,nofollow"/)
    assert.match(shell, /<div id="root"><\/div>/)
    assert.match(shell, /src="\/assets\/app\.js"/)
    assert.doesNotMatch(shell, /rel="canonical"|property="og:|name="twitter:|data-prerender-fallback/)
  }
})
