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
  assert.equal(bookingHttpError(408).uncertain, true)
  assert.equal(bookingHttpError(504).uncertain, true)
  assert.equal(bookingHttpError(429).uncertain, false)
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

test('shared user messages explain booking status conflicts without HTTP codes', () => {
  const conflict = bookingHttpError(409, 'Invalid booking status transition from CANCELLED to CONFIRMED.')
  assert.match(bookingErrorMessage(conflict, 'status'), /current status/)
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

test('status conflict message covers all invalid transitions, not just cancellations', () => {
  const message = bookingErrorMessage(bookingHttpError(409, 'Invalid booking status transition from PENDING to COMPLETED.'), 'status')
  assert.match(message, /status change is not allowed/i)
  assert.match(message, /current status/i)
  assert.doesNotMatch(message, /Cancelled bookings cannot be reopened/i)
  assert.match(message, /Refresh the booking/)
  assert.doesNotMatch(message, /409|HTTP|Conflict/)
})

test('shared messages handle edit conflicts, authorization and temporary service failures', () => {
  assert.match(bookingErrorMessage(bookingHttpError(409), 'edit'), /Refresh/)
  assert.match(bookingErrorMessage(bookingHttpError(401), 'read'), /sign in again/)
  assert.match(bookingErrorMessage(bookingHttpError(503), 'status'), /temporarily unavailable/)
  assert.match(bookingErrorMessage(new Error('unexpected'), 'read'), /Could not load bookings/)
})

test('rate-limited booking actions show a helpful message instead of HTTP 429', () => {
  const error = bookingHttpError(429, 'Too Many Requests')
  for (const action of ['create', 'read', 'edit', 'status']) {
    const message = bookingErrorMessage(error, action)
    assert.match(message, /wait a moment before trying again/i)
    assert.doesNotMatch(message, /\b429\b|\bHTTP\b/i)
    assert.notEqual(message, error.message)
  }
  assert.equal(error.uncertain, false)
})

test('HTTP 408 keeps booking outcome uncertain and gives a safe retry instruction', () => {
  const error = bookingHttpError(408, 'Request Timeout')
  assert.equal(error.uncertain, true)
  const message = bookingErrorMessage(error, 'create')
  assert.match(message, /may have been saved/i)
  assert.match(message, /retry the same request/i)
  assert.doesNotMatch(message, /HTTP|408/i)
})

test('HTTP 408 distinguishes read-only timeout from uncertain admin writes', () => {
  const error = bookingHttpError(408, 'Request Timeout')
  for (const action of ['edit', 'status']) {
    const message = bookingErrorMessage(error, action)
    assert.match(message, /changes may have been saved/i)
    assert.match(message, /Refresh to verify/i)
    assert.doesNotMatch(message, /408|HTTP|Request Timeout/i)
  }
  const readMessage = bookingErrorMessage(error, 'read')
  assert.match(readMessage, /Loading bookings timed out/i)
  assert.doesNotMatch(readMessage, /saved|changes|408|HTTP/i)
})

test('HTTP 5xx does not encourage unsafe admin write retries', () => {
  const error = bookingHttpError(503, 'Database unavailable')
  assert.equal(error.uncertain, true)
  for (const action of ['edit', 'status']) {
    const message = bookingErrorMessage(error, action)
    assert.match(message, /changes may have been saved/i)
    assert.match(message, /Refresh to verify/i)
    assert.doesNotMatch(message, /Database unavailable|HTTP|503/i)
  }
  const readMessage = bookingErrorMessage(error, 'read')
  assert.match(readMessage, /Could not load bookings/i)
  assert.doesNotMatch(readMessage, /saved|changes|HTTP|503/i)
  const createMessage = bookingErrorMessage(error, 'create')
  assert.match(createMessage, /may have saved your request/i)
  assert.match(createMessage, /retry the same request/i)
  assert.doesNotMatch(createMessage, /Database unavailable|HTTP|503/i)
})

test('other server failures keep write outcomes uncertain without exposing server details', () => {
  for (const status of [500, 502, 504]) {
    const error = bookingHttpError(status, 'internal database connection failed')
    assert.equal(error.uncertain, true)
    for (const action of ['create', 'edit', 'status']) {
      const message = bookingErrorMessage(error, action)
      assert.match(message, /may have (?:saved|been saved)/i)
      assert.doesNotMatch(message, /internal database|HTTP|500|502|504/i)
    }
    const readMessage = bookingErrorMessage(error, 'read')
    assert.match(readMessage, /Could not load bookings/i)
    assert.doesNotMatch(readMessage, /saved|internal database|HTTP|500|502|504/i)
  }
})
