import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createRetryKeyStore } from '../src/features/booking/retryKeys.ts'

function storage() {
  const entries = new Map()
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: (key) => entries.delete(key),
  }
}

test('same payload reuses key until successful completion', () => {
  const saved = storage()
  let sequence = 0
  const keys = createRetryKeyStore(saved, () => 'key-' + ++sequence)
  assert.equal(keys.getOrCreate('payload-a'), 'key-1')
  assert.equal(keys.getOrCreate('payload-a'), 'key-1')
  assert.equal(keys.getOrCreate('payload-b'), 'key-2')
  keys.clear('payload-a')
  assert.equal(keys.getOrCreate('payload-a'), 'key-3')
})

test('key survives simulated page reload', () => {
  const saved = storage()
  const first = createRetryKeyStore(saved, () => 'original-key')
  assert.equal(first.getOrCreate('same-payload'), 'original-key')
  const afterReload = createRetryKeyStore(saved, () => 'different-key')
  assert.equal(afterReload.getOrCreate('same-payload'), 'original-key')
})

test('blocked browser storage falls back to memory', () => {
  const blocked = {
    getItem: () => { throw new Error('blocked') },
    setItem: () => { throw new Error('blocked') },
    removeItem: () => { throw new Error('blocked') },
  }
  const keys = createRetryKeyStore(blocked, () => 'memory-key')
  assert.equal(keys.getOrCreate('payload'), 'memory-key')
  assert.equal(keys.getOrCreate('payload'), 'memory-key')
  assert.doesNotThrow(() => keys.clear('payload'))
})
