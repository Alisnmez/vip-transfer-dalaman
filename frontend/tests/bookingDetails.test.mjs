import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateBookingDetails } from '../src/features/booking/validateBookingDetails.ts'

const transfer = {
  pickUpLocation: 'Dalaman Airport',
  dropOffLocation: 'Marmaris(Any Hotel)',
  pickUpDate: '2035-06-10',
  pickUpTime: '12:00',
  passengerCount: 2,
  luggageCount: 1,
  babySeatCount: 0,
  vehicleId: 'vip-minivan',
  tripType: 'one-way',
}
const passenger = {
  customerName: 'Test Passenger',
  phoneNumber: '+905551234567',
  email: 'test@example.com',
  countryOfResidence: 'Turkey',
  transferAddress: 'Example Hotel',
}

const now = Date.UTC(2030, 0, 1)
const check = (t = transfer, p = passenger) => validateBookingDetails(t, p, now)

test('valid booking and reverse airport direction are accepted', () => {
  assert.equal(check(), null)
  assert.equal(check({ ...transfer, pickUpLocation: transfer.dropOffLocation, dropOffLocation: 'Dalaman Airport' }), null)
})

test('valid return journey and optional flight and hotel fields are accepted', () => {
  assert.equal(check({
    ...transfer, tripType: 'round-trip', returnDate: '2035-06-12',
    returnTime: '10:30', flightNumber: 'TK 1234',
  }, { ...passenger, hotelName: 'Example Hotel', specialRequests: 'Please call on arrival' }), null)
})

test('past, invalid and reversed transfer dates are rejected', () => {
  assert.ok(validateBookingDetails(transfer, passenger, Date.UTC(2036, 0, 1)))
  assert.ok(check({ ...transfer, pickUpDate: '2035-02-30' }))
  assert.ok(check({ ...transfer, tripType: 'round-trip', returnDate: '2035-06-09', returnTime: '12:00' }))
  assert.ok(check({ ...transfer, tripType: 'round-trip', returnDate: '2035-06-10', returnTime: '12:00' }))
})

test('invalid route, vehicle and capacity are rejected', () => {
  assert.ok(check({ ...transfer, dropOffLocation: 'Unknown' }))
  assert.ok(check({ ...transfer, vehicleId: 'unknown' }))
  assert.ok(check({ ...transfer, passengerCount: 99 }))
  assert.ok(check({ ...transfer, luggageCount: 99 }))
  assert.ok(check({ ...transfer, babySeatCount: 3 }))
})

test('invalid contact details and missing residence are rejected', () => {
  assert.ok(check(transfer, { ...passenger, phoneNumber: '5551234567' }))
  assert.ok(check(transfer, { ...passenger, phoneNumber: '+123' }))
  assert.ok(check(transfer, { ...passenger, email: 'invalid' }))
  assert.ok(check(transfer, { ...passenger, countryOfResidence: '' }))
  assert.ok(check(transfer, { ...passenger, transferAddress: '  ' }))
})

test('oversized text and malformed optional fields are rejected', () => {
  assert.ok(check(transfer, { ...passenger, transferAddress: 'a'.repeat(251) }))
  assert.ok(check(transfer, { ...passenger, hotelName: 'a'.repeat(121) }))
  assert.ok(check(transfer, { ...passenger, specialRequests: 'a'.repeat(1001) }))
  assert.ok(check({ ...transfer, flightNumber: 'INVALID!!!' }))
  assert.ok(check(transfer, { ...passenger, hotelName: 7 }))
})

test('mobile form drafts reject blank fields and malformed saved values', () => {
  assert.ok(check(transfer, { ...passenger, customerName: '   ' }))
  assert.ok(check(transfer, { ...passenger, email: ' ' }))
  assert.ok(check({ ...transfer, passengerCount: 1.5 }))
  assert.ok(check({ ...transfer, pickUpTime: '' }))
  assert.ok(check({ ...transfer, tripType: 'round-trip', returnDate: '', returnTime: '' }))
  assert.ok(check(transfer, { ...passenger, phoneNumber: '+905551234567', transferAddress: '' }))
})

test('contact fields enforce maximum lengths and permit valid international numbers', () => {
  assert.equal(check(transfer, { ...passenger, phoneNumber: '+37061234567' }), null)
  assert.ok(check(transfer, { ...passenger, customerName: 'A'.repeat(162) }))
  assert.ok(check(transfer, { ...passenger, email: 'a'.repeat(250) + '@example.com' }))
  assert.ok(check(transfer, { ...passenger, phoneNumber: '+1234567890123456' }))
})
