import assert from 'node:assert/strict'
import { test } from 'node:test'
import { BookingApiError, bookingHttpError, bookingInvalidSuccessResponse, classifyBookingFailure } from '../src/features/booking/api/errors.ts'

test('HTTP errors retain status and are not mistaken for uncertain transport errors', () => {
  const conflict = bookingHttpError(409, 'Booking already exists')
  assert.equal(conflict.status, 409)
  assert.equal(conflict.uncertain, false)
  assert.equal(conflict.message, 'Booking already exists')
  assert.equal(classifyBookingFailure(conflict), conflict)
  assert.match(bookingHttpError(503).message, /HTTP 503/)
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
