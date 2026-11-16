import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateTransferSchedule } from '../src/features/booking/validateTransferSchedule.ts'

const now = Date.UTC(2030, 0, 1)
const pickup = { pickUpDate: '2035-06-10', pickUpTime: '12:00', tripType: 'one-way' }

test('accepts future pickup and a later round-trip return', () => {
  assert.equal(validateTransferSchedule(pickup, now), null)
  assert.equal(validateTransferSchedule({
    ...pickup, tripType: 'round-trip', returnDate: '2035-06-10', returnTime: '12:01',
  }, now), null)
})

test('rejects invalid or past pickup dates', () => {
  assert.ok(validateTransferSchedule({ ...pickup, pickUpDate: '2035-02-30' }, now))
  assert.ok(validateTransferSchedule({ ...pickup, pickUpTime: '25:00' }, now))
  assert.ok(validateTransferSchedule(pickup, Date.UTC(2036, 0, 1)))
})

test('rejects missing, equal and earlier return times', () => {
  assert.ok(validateTransferSchedule({ ...pickup, tripType: 'round-trip' }, now))
  assert.ok(validateTransferSchedule({
    ...pickup, tripType: 'round-trip', returnDate: '2035-06-10', returnTime: '12:00',
  }, now))
  assert.ok(validateTransferSchedule({
    ...pickup, tripType: 'round-trip', returnDate: '2035-06-09', returnTime: '13:00',
  }, now))
})
