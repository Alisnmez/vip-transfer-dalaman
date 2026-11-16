import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSingleFlight } from '../src/features/booking/singleFlight.ts'

test('simultaneous identical submissions execute only one task', async () => {
  const run = createSingleFlight()
  let calls = 0
  let finish
  const pending = new Promise((resolve) => { finish = resolve })
  const first = run('same-booking', () => { calls++; return pending })
  const second = run('same-booking', () => { calls++; return pending })
  assert.equal(first, second)
  await Promise.resolve()
  assert.equal(calls, 1)
  finish({ id: 101 })
  assert.deepEqual(await first, { id: 101 })
  assert.deepEqual(await second, { id: 101 })
})

test('different bookings run independently', async () => {
  const run = createSingleFlight()
  let calls = 0
  const [a, b] = await Promise.all([
    run('booking-a', async () => { calls++; return 'a' }),
    run('booking-b', async () => { calls++; return 'b' }),
  ])
  assert.deepEqual([a, b], ['a', 'b'])
  assert.equal(calls, 2)
})

test('a failed submission can retry and success is not cached', async () => {
  const run = createSingleFlight()
  let calls = 0
  await assert.rejects(run('retry', async () => { calls++; throw new Error('network') }), /network/)
  assert.equal(await run('retry', async () => { calls++; return 42 }), 42)
  assert.equal(await run('retry', async () => { calls++; return 43 }), 43)
  assert.equal(calls, 3)
})
