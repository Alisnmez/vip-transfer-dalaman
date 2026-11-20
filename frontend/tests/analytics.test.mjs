import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

async function setup() {
  const dir = await mkdtemp(join(tmpdir(), 'vip-analytics-'))
  const source = await readFile(resolve('src/features/analytics/analytics.ts'), 'utf8')
  await writeFile(join(dir, 'analytics.mts'), source.replace('import.meta.env.VITE_GA_MEASUREMENT_ID', "'G-TEST123'"))
  const values = new Map()
  const scripts = []
  globalThis.localStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  globalThis.window = { dataLayer: [] }
  globalThis.document = {
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  }
  const analytics = await import(pathToFileURL(join(dir, 'analytics.mts')).href)
  return { analytics, scripts, values, cleanup: () => rm(dir, { recursive: true, force: true }) }
}

test('analytics requires consent and never sends private page paths', async () => {
  const { analytics, scripts, cleanup } = await setup()
  try {
    analytics.trackAnalyticsEvent('booking_started')
    analytics.trackPublicPage('/booking/confirmation')
    assert.equal(scripts.length, 0)
    assert.equal(window.dataLayer.length, 0)

    analytics.setAnalyticsConsent(true)
    assert.equal(scripts.length, 1)
    analytics.trackPublicPage('/admin/bookings/42')
    analytics.trackPublicPage('/routes/fethiye')
    analytics.trackAnalyticsEvent('booking_request_submitted')
    const events = window.dataLayer.filter(args => args[0] === 'event')
    assert.deepEqual(events.map(args => args[1]), ['page_view', 'booking_request_submitted'])
    assert.deepEqual(events[0][2], { page_path: '/routes/fethiye' })
    assert.equal(JSON.stringify(events).includes('42'), false)

    analytics.setAnalyticsConsent(false)
    analytics.trackAnalyticsEvent('booking_started')
    assert.equal(window.dataLayer.filter(args => args[0] === 'event').length, 2)
  } finally {
    await cleanup()
  }
})
