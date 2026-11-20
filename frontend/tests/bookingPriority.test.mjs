import assert from 'node:assert/strict'
import test from 'node:test'
import { sortBookingsByPriority } from '../src/features/booking/bookingPriority.ts'

test('live bookings come first, then nearest future pickups', () => {
  const now = Date.parse('2026-11-20T06:00:00Z')
  const bookings = [
    { id: 1, status: 'PENDING', transferDateTime: '2026-11-20T10:00' },
    { id: 2, status: 'CONFIRMED', transferDateTime: '2026-11-20T09:00' },
    { id: 3, status: 'CONFIRMED', transferDateTime: '2026-11-20T09:30' },
    { id: 4, status: 'CONFIRMED', transferDateTime: '2026-11-19T08:00' },
  ]
  assert.deepEqual(sortBookingsByPriority(bookings, now).map(b => b.id), [4, 2, 3, 1])
  assert.deepEqual(sortBookingsByPriority(bookings, now - 1000).map(b => b.id), [4, 2, 3, 1])
})
