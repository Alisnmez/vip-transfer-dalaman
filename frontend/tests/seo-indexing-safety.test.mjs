import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, cp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve('scripts/generate-seo.mjs')
const destinations = resolve('scripts/destination-routes.mjs')

async function buildSeo(url) {
  const dir = await mkdtemp(join(tmpdir(), 'seo-security-'))
  try {
    await cp(script, join(dir, 'generate-seo.mjs'))
    await cp(destinations, join(dir, 'destination-routes.mjs'))
    await writeFile(join(dir, 'package.json'), '{"type":"module"}')
    const result = spawnSync(process.execPath, ['generate-seo.mjs'], {
      cwd: dir, encoding: 'utf8',
      env: { ...process.env, VITE_PUBLIC_SITE_URL: url },
    })
    assert.equal(result.status, 0, result.stderr)
    return {
      robots: await readFile(join(dir, 'public/robots.txt'), 'utf8'),
      sitemap: await readFile(join(dir, 'public/sitemap.xml'), 'utf8'),
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

test('SEO indexing remains disabled for localhost and Render domains', async () => {
  for (const url of ['http://localhost:5173', 'https://127.0.0.1', 'https://dalamanway.onrender.com']) {
    const { robots, sitemap } = await buildSeo(url)
    assert.match(robots, /User-agent: \*\nDisallow: \/\n/)
    assert.doesNotMatch(sitemap, /<loc>/)
  }
})

test('production sitemap includes only canonical public URLs with no booking data', async () => {
  const { robots, sitemap } = await buildSeo('https://dalamanway.com/')
  assert.match(robots, /Sitemap: https:\/\/dalamanway\.com\/sitemap\.xml/)
  assert.match(sitemap, /<loc>https:\/\/dalamanway\.com\/routes\/marmaris<\/loc>/)
  assert.doesNotMatch(sitemap, /<loc>[^<]*(booking|admin|token|reference)/i)
  assert.doesNotMatch(sitemap, /dalamanway\.com\/\//)
  assert.doesNotMatch(sitemap, /onrender\.com/)
})
