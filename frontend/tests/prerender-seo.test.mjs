import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, readFile, rm, cp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve('scripts/prerender-routes.mjs')
const routes = resolve('scripts/destination-routes.mjs')
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
    return {
      home: await readFile(join(dir, 'dist/index.html'), 'utf8'),
      route: await readFile(join(dir, 'dist/routes/marmaris/index.html'), 'utf8'),
      faq: await readFile(join(dir, 'dist/faq/index.html'), 'utf8'),
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('production prerendered route has crawlable title, description, canonical and content', async () => {
  const { route, faq } = await render('https://dalamanway.com')
  assert.match(route, /<title>Dalaman Airport to Marmaris Private Transfer \| DalamanWay<\/title>/)
  assert.match(route, /<meta name="robots" content="index,follow"/)
  assert.match(route, /<link rel="canonical" href="https:\/\/dalamanway\.com\/routes\/marmaris"/)
  assert.match(route, /<h1>Dalaman Airport to Marmaris Private Transfer/)
  assert.match(route, /data-prerender-fallback/)
  assert.match(faq, /<h1>Frequently Asked Questions<\/h1>/)
  assert.match(faq, /<meta name="robots" content="index,follow"/)
})

test('staging prerendered pages remain noindex without production canonicals', async () => {
  for (const url of ['', 'https://dalamanway-staging.onrender.com']) {
    const { route, faq } = await render(url)
    for (const html of [route, faq]) {
      assert.match(html, /<meta name="robots" content="noindex,nofollow"/)
      assert.doesNotMatch(html, /rel="canonical"/)
    }
  }
})
