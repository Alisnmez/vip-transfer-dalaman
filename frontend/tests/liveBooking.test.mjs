import assert from 'node:assert/strict'
import test from 'node:test'
import { isBookingLive } from '../src/features/booking/liveBooking.ts'

const pickup = '2026-11-20T09:00'
const before = Date.parse('2026-11-20T05:59:59Z')
const start = Date.parse('2026-11-20T06:00:00Z')

test('confirmed booking becomes live exactly at 09:00 Turkey time', () => {
  assert.equal(isBookingLive('CONFIRMED', pickup, before), false)
  assert.equal(isBookingLive('CONFIRMED', pickup, start), true)
  assert.equal(isBookingLive('CONFIRMED', pickup, start + 86400000), true)
})

test('completed, cancelled and pending bookings never show LIVE', () => {
  for (const status of ['COMPLETED', 'CANCELLED', 'PENDING']) {
    assert.equal(isBookingLive(status, pickup, start + 86400000), false)
  }
})

test('missing or invalid transfer time does not activate LIVE', () => {
  assert.equal(isBookingLive('CONFIRMED', null, start), false)
  assert.equal(isBookingLive('CONFIRMED', 'invalid', start), false)
  assert.equal(isBookingLive('CONFIRMED', '2026-02-30T09:00', start), false)
})
