import assert from 'node:assert/strict'
import { test } from 'node:test'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const source = resolve('scripts/prerender-routes.mjs')
const template = '<html><head><title>Default</title><meta name="description" content="Default" /><meta name="robots" content="noindex,nofollow" /></head><body><div id="root"></div><script src="/assets/main.js"></script></body></html>'

async function run(domain) {
  const folder = await mkdtemp(join(tmpdir(), 'vip-prerender-'))
  try {
    await mkdir(join(folder, 'dist'))
    await writeFile(join(folder, 'dist/index.html'), template)
    await cp(source, join(folder, 'prerender-routes.mjs'))
    const result = spawnSync(process.execPath, ['prerender-routes.mjs'], {
      cwd: folder,
      encoding: 'utf8',
      env: { ...process.env, VITE_PUBLIC_SITE_URL: domain },
    })
    assert.equal(result.status, 0, result.stderr)
    return await readFile(join(folder, 'dist/routes/fethiye/index.html'), 'utf8')
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
