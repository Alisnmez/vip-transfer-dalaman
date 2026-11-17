import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'

test('prerender writes correct landing page SEO metadata', () => {
  const root = mkdtempSync(join(tmpdir(), 'vip-seo-'))
  try {
    mkdirSync(join(root, 'scripts'))
    mkdirSync(join(root, 'dist'))
    writeFileSync(join(root, 'package.json'), '{"type":"module"}')
    copyFileSync(resolve('scripts/prerender-routes.mjs'), join(root, 'scripts/prerender-routes.mjs'))
    copyFileSync(resolve('scripts/destination-routes.mjs'), join(root, 'scripts/destination-routes.mjs'))
    writeFileSync(join(root, 'dist/index.html'), '<html><head><title>Original</title><meta name="description" content="old" /><meta name="robots" content="noindex,nofollow" /></head><body><div id="root"></div></body></html>')
    execFileSync(process.execPath, ['scripts/prerender-routes.mjs'], { cwd: root, env: { ...process.env, VITE_PUBLIC_SITE_URL: 'https://example.com' } })
    for (const [path, title] of [['', 'Dalaman Airport Transfers'], ['routes', 'Dalaman Airport Transfer Routes']]) {
      const html = readFileSync(join(root, 'dist', path, 'index.html'), 'utf8')
      assert.match(html, new RegExp('<title>' + title))
      assert.doesNotMatch(html, /<title>Original<\/title>/)
      assert.doesNotMatch(html, /content="old"/)
      assert.match(html, /name="robots" content="index,follow"/)
      assert.match(html, /rel="canonical"/)
      assert.match(html, /<h1>/)
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
