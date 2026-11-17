import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BookingApiError, bookingHttpError, bookingInvalidSuccessResponse, classifyBookingFailure, bookingErrorMessage } from '../src/features/booking/api/errors.ts'

test('HTTP errors retain status and distinguish definite rejection from server uncertainty', () => {
  const conflict = bookingHttpError(409, 'Booking already exists')
  assert.equal(conflict.status, 409)
  assert.equal(conflict.uncertain, false)
  assert.equal(conflict.message, 'Booking already exists')
  assert.equal(classifyBookingFailure(conflict), conflict)
  assert.match(bookingHttpError(503).message, /HTTP 503/)
  assert.equal(bookingHttpError(503).uncertain, true)
  assert.equal(bookingHttpError(422).uncertain, false)
})

test('network and timeout failures indicate uncertain submission outcome', () => {
  const network = classifyBookingFailure(new TypeError('Failed to fetch'))
  assert.equal(network.uncertain, true)
  assert.equal(network.status, null)
  const abort = new Error('aborted')
  abort.name = 'AbortError'
  assert.equal(classifyBookingFailure(abort).uncertain, true)
})

test('ordinary errors are not classified as uncertain network outcomes', () => {
  const error = classifyBookingFailure(new SyntaxError('Invalid JSON'))
  assert.equal(error.uncertain, false)
  assert.equal(error.message, 'Invalid JSON')
  assert.ok(error instanceof BookingApiError)
})

test('unreadable successful response keeps the booking outcome uncertain', () => {
  const error = bookingInvalidSuccessResponse(new SyntaxError('bad JSON'))
  assert.equal(error.uncertain, true)
  assert.equal(error.status, null)
  assert.match(error.message, /may have been saved/)
  assert.equal(classifyBookingFailure(error), error)
})

test('shared user messages explain cancelled booking conflicts without HTTP codes', () => {
  const conflict = bookingHttpError(409, 'Invalid booking status transition from CANCELLED to CONFIRMED.')
  assert.match(bookingErrorMessage(conflict, 'status'), /Cancelled bookings cannot be reopened/)
  assert.doesNotMatch(bookingErrorMessage(conflict, 'status'), /409|Conflict/)
  assert.match(bookingErrorMessage(conflict, 'edit'), /Refresh/)
  assert.match(bookingErrorMessage(bookingHttpError(401), 'status'), /sign in again/)
  assert.match(bookingErrorMessage(classifyBookingFailure(new TypeError('offline')), 'status'), /may have been saved/)
})

test('read-only admin failures never suggest that a booking was modified', () => {
  const message = bookingErrorMessage(classifyBookingFailure(new TypeError('offline')), 'read')
  assert.match(message, /Could not load bookings/)
  assert.doesNotMatch(message, /changes may have been saved/i)
  assert.match(bookingErrorMessage(bookingHttpError(403), 'read'), /sign in again/)
})
