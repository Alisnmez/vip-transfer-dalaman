import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const source = resolve('scripts/generate-seo.mjs')

async function generate(domain) {
  const directory = await mkdtemp(join(tmpdir(), 'vip-seo-'))
  const result = spawnSync(process.execPath, [source], {
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
  assert.match(sitemap, /<loc>https:\/\/example.com\/guides<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/guides\/dalaman-airport-to-marmaris<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/guides\/dalaman-airport-to-fethiye<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/guides\/kayakoy-oludeniz-day-plan<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/guides\/dalyan-kaunos-iztuzu<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/faq<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/reviews<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/de\/routes\/marmaris<\/loc>/)
  assert.match(sitemap, /<loc>https:\/\/example.com\/ru\/routes\/gocek<\/loc>/)
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/(booking|admin)/)
})

test('live SEO audit verifies all public pages and reciprocal language links', { timeout: 540000 }, () => {
  const result = spawnSync(process.execPath, [resolve('scripts/audit-live-seo.mjs')], {
    encoding: 'utf8',
    timeout: 520000,
    env: { ...process.env, SEO_AUDIT_ORIGIN: 'https://dalamanway.com' },
  })
  console.log(result.stdout)
  assert.equal(result.status, 0, result.error?.message || result.stderr || result.stdout)
})
