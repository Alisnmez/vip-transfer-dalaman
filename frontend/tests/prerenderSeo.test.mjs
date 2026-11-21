import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'

test('prerender writes correct landing page SEO metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'vip-seo-'))
  try {
    mkdirSync(join(root, 'dist'))
    writeFileSync(join(root, 'dist/index.html'), '<html><head><title>Original</title><meta name="description" content="old" /><meta name="robots" content="noindex,nofollow" /></head><body><div id="root"></div></body></html>')
    execFileSync(process.execPath, [resolve('scripts/prerender-routes.mjs')], { cwd: root, env: { ...process.env, VITE_PUBLIC_SITE_URL: 'https://example.com' } })
    for (const [path, title] of [['', 'Dalaman Airport Transfers'], ['routes', 'Dalaman Airport Transfer Routes']]) {
      const html = readFileSync(join(root, 'dist', path, 'index.html'), 'utf8')
      assert.match(html, new RegExp('<title>' + title))
      assert.doesNotMatch(html, /<title>Original<\/title>/)
      assert.doesNotMatch(html, /content="old"/)
      assert.match(html, /name="robots" content="index,follow"/)
      assert.match(html, /rel="canonical"/)
      assert.match(html, /<h1>/)
    }
    const home = readFileSync(join(root, 'dist/index.html'), 'utf8')
    const routeIndex = readFileSync(join(root, 'dist/routes/index.html'), 'utf8')
    for (const slug of ['marmaris', 'fethiye', 'oludeniz', 'gocek', 'icmeler', 'dalyan', 'sarigerme']) {
      assert.match(home, new RegExp(`href="/routes/${slug}"`), `homepage route link: ${slug}`)
      assert.match(routeIndex, new RegExp(`href="/routes/${slug}"`), `route index link: ${slug}`)
    }
    assert.match(home, /to Marmaris, Fethiye, Oludeniz, Gocek, Icmeler, Dalyan and Sarigerme/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
