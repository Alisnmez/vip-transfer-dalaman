import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, readFile, rm, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const source = resolve('scripts/generate-seo.mjs')

async function generate(domain) {
  const directory = await mkdtemp(join(tmpdir(), 'vip-seo-'))
  await cp(source, join(directory, 'generate-seo.mjs'))
  const result = spawnSync(process.execPath, ['generate-seo.mjs'], {
    cwd: directory,
    encoding: 'utf8',
    env: { ...process.env, VITE_PUBLIC_SITE_URL: domain },
  })
  assert.equal(result.status, 0, result.stderr)
  const robots = await readFile(join(directory, 'public/robots.txt'), 'utf8')
  const sitemap = await readFile(join(directory, 'public/sitemap.xml'), 'utf8')
  await rm(directory, { recursive: true, force: true })
  return { robots, sitemap }
}

test('staging and missing domain remain blocked', async () => {
  for (const domain of ['', 'https://vip-transfer-dalaman-test.onrender.com']) {
    const { robots, sitemap } = await generate(domain)
    assert.match(robots, /Disallow: \/\s/)
    assert.doesNotMatch(sitemap, /<loc>/)
  }
})

test('production sitemap includes public routes and excludes private booking/admin', async () => {
  const { robots, sitemap } = await generate('https://example.com/')
  assert.match(robots, /Sitemap: https:\/\/example.com\/sitemap.xml/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/routes\/marmaris<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/routes\/fethiye<\/loc>/)
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/(booking|admin)/)
})
