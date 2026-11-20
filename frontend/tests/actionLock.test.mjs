import assert from 'node:assert/strict'
import test from 'node:test'

import { createActionLock } from '../src/hooks/createActionLock.ts'

test('blocks a second click while the first request is pending', async () => {
  const lock = createActionLock()
  let finish
  let calls = 0
  const first = lock.run(async () => {
    calls += 1
    await new Promise(resolve => { finish = resolve })
  })
  assert.equal(lock.locked, true)
  assert.equal(await lock.run(async () => { calls += 1 }), false)
  assert.equal(calls, 1)
  finish()
  assert.equal(await first, true)
  assert.equal(lock.locked, false)
  assert.equal(await lock.run(async () => { calls += 1 }), true)
  assert.equal(calls, 2)
})

test('releases lock after failure so the customer can retry', async () => {
  const lock = createActionLock()
  await assert.rejects(lock.run(async () => { throw new Error('network error') }), /network error/)
  assert.equal(lock.locked, false)
  assert.equal(await lock.run(async () => {}), true)
})
