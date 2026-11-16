import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateBookingDetails } from '../src/features/booking/validateBookingDetails.ts'

const future = {
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

test('valid booking can proceed to final submission', () => {
  assert.equal(validateBookingDetails(future, passenger, Date.UTC(2030, 0, 1)), null)
})

test('past dates and invalid return schedules are rejected', () => {
  assert.ok(validateBookingDetails(future, passenger, Date.UTC(2036, 0, 1)))
  assert.ok(validateBookingDetails({ ...future, tripType: 'round-trip', returnDate: '2035-06-09', returnTime: '12:00' }, passenger, Date.UTC(2030, 0, 1)))
})

test('invalid contact details and missing residence are rejected', () => {
  assert.ok(validateBookingDetails(future, { ...passenger, phoneNumber: '5551234567' }, Date.UTC(2030, 0, 1)))
  assert.ok(validateBookingDetails(future, { ...passenger, email: 'invalid' }, Date.UTC(2030, 0, 1)))
  assert.ok(validateBookingDetails(future, { ...passenger, countryOfResidence: '' }, Date.UTC(2030, 0, 1)))
})

test('invalid route, luggage and excessive passenger text are rejected', () => {
  assert.ok(validateBookingDetails({ ...future, dropOffLocation: 'Unknown' }, passenger, Date.UTC(2030, 0, 1)))
  assert.ok(validateBookingDetails({ ...future, luggageCount: 99 }, passenger, Date.UTC(2030, 0, 1)))
  assert.ok(validateBookingDetails(future, { ...passenger, transferAddress: 'a'.repeat(251) }, Date.UTC(2030, 0, 1)))
})
