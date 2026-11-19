import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, readFile, rm, cp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve('scripts/prerender-routes.mjs')
const routes = resolve('scripts/destination-routes.mjs')
const publicPaths = ['', 'routes', 'routes/marmaris', 'routes/fethiye', 'routes/oludeniz',
  'routes/gocek', 'routes/icmeler', 'vehicles', 'services', 'contact', 'faq', 'reviews']
const template = '<!doctype html><html lang="en"><head><title>Template</title><meta name="description" content="Template" /><meta name="robots" content="noindex,nofollow" /></head><body><div id="root"></div></body></html>'

async function render(siteUrl) {
  const dir = await mkdtemp(join(tmpdir(), 'vip-prerender-seo-'))
  try {
    await cp(script, join(dir, 'prerender-routes.mjs'))
    await cp(routes, join(dir, 'destination-routes.mjs'))
    await writeFile(join(dir, 'package.json'), '{"type":"module"}')
    await mkdir(join(dir, 'dist'))
    await writeFile(join(dir, 'dist/index.html'), template)
    const result = spawnSync(process.execPath, ['prerender-routes.mjs'], {
      cwd: dir, encoding: 'utf8',
      env: { ...process.env, VITE_PUBLIC_SITE_URL: siteUrl },
    })
    assert.equal(result.status, 0, result.stderr)
    return new Map(await Promise.all(publicPaths.map(async path => [
      path, await readFile(join(dir, 'dist', path, 'index.html'), 'utf8'),
    ])))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('production prerendered route has crawlable title, description, canonical and content', async () => {
  const origin = 'https://dalamanway.com'
  const pages = await render(origin)
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
  assert.match(pages.get('faq'), /<h1>Frequently Asked Questions<\/h1>/)
})

test('all staging pages remain noindex without production canonicals', async () => {
  for (const url of ['', 'https://dalamanway-staging.onrender.com']) {
    for (const [path, html] of await render(url)) {
      assert.match(html, /<meta name="robots" content="noindex,nofollow"/, path)
      assert.doesNotMatch(html, /rel="canonical"|property="og:url"/, path)
    }
  }
})
