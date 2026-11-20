import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bookingStatus, formatBookingReceivedAt, formatTransferDateTime } from '../src/features/booking/formatters.ts'

test('booking status retains server values and defaults missing legacy values', () => {
  assert.equal(bookingStatus('CONFIRMED'), 'CONFIRMED')
  assert.equal(bookingStatus('CANCELLED'), 'CANCELLED')
  assert.equal(bookingStatus(null), 'PENDING')
})

test('transfer wall-clock time is not shifted by browser timezone', () => {
  assert.equal(formatTransferDateTime('2035-01-02T09:30:00'), '2035-01-02 09:30')
  assert.equal(formatTransferDateTime(''), 'Not provided')
})

test('received-at timestamp uses Istanbul timezone and handles legacy missing values', () => {
  assert.equal(formatBookingReceivedAt('2035-01-02T00:30:00Z').includes('03:30'), true)
  assert.equal(formatBookingReceivedAt(null), 'Not recorded')
  assert.equal(formatBookingReceivedAt('invalid-date'), 'Not recorded')
})
