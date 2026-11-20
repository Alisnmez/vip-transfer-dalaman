import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateAdminSchedule } from '../src/features/booking/validateAdminSchedule.ts'
const now = Date.parse('2030-06-10T10:00:00Z') // 13:00 in Turkey
const saved = { transferDateTime: '2030-06-11T12:00:00', tripType: 'one-way' }
test('admin cannot move pickup into the past or current minute in Turkey', () => {
  for (const transferDateTime of ['2025-01-01T12:00', '2030-06-10T12:59', '2030-06-10T13:00', '2030-02-30T12:00']) {
    assert.ok(validateAdminSchedule({ ...saved, transferDateTime }, saved, now))
  }
  assert.equal(validateAdminSchedule({ ...saved, transferDateTime: '2030-06-10T13:01' }, saved, now), null)
})
test('admin validates return order and required return', () => {
  for (const returnDateTime of [undefined, '2030-06-11T11:59', '2030-06-11T12:00']) {
    assert.ok(validateAdminSchedule({ ...saved, tripType: 'round-trip', returnDateTime }, saved, now))
  }
  assert.equal(validateAdminSchedule({ ...saved, tripType: 'round-trip', returnDateTime: '2030-06-12T12:00' }, saved, now), null)
})
test('unchanged historical schedule allows contact corrections and ignores omitted seconds', () => {
  const historical = { ...saved, transferDateTime: '2025-01-01T12:00:00' }
  assert.equal(validateAdminSchedule({ ...historical, transferDateTime: '2025-01-01T12:00' }, historical, now), null)
  assert.ok(validateAdminSchedule({ ...historical, transferDateTime: '2025-01-02T12:00' }, historical, now))
})
