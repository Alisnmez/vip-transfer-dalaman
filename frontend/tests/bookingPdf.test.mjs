import assert from 'node:assert/strict'
import { test } from 'node:test'
import { bookingPdfBytes } from '../src/features/booking/bookingPdf.ts'

test('booking PDF is valid-shaped, downloadable, and clearly pending', () => {
  const pdf = new TextDecoder().decode(bookingPdfBytes({
    reference: 'T7K2MA8', status: 'PENDING', customerName: 'Test Passenger',
    passengerCount: 2, pickUpLocation: 'Dalaman Airport', dropOffLocation: 'Marmaris',
    transferDateTime: '2027-06-10T12:00:00', vehicleId: 'vip-minivan', price: 85,
  }))
  assert.ok(pdf.startsWith('%PDF-1.4'))
  assert.ok(pdf.includes('T7K2MA8'))
  assert.ok(pdf.includes('Booking is not confirmed'))
  assert.ok(pdf.includes('GBP 85.00'))
  assert.ok(pdf.includes('xref'))
  assert.ok(pdf.endsWith('%%EOF\n'))
})

test('confirmed bookings have correct status and escaped PDF text', () => {
  const pdf = new TextDecoder().decode(bookingPdfBytes({
    reference: 'VJXJ756', status: 'CONFIRMED', customerName: 'Test (Passenger)',
    passengerCount: 1, pickUpLocation: 'Airport', dropOffLocation: 'Fethiye',
    transferDateTime: '2027-06-10T12:00:00', price: null,
  }))
  assert.ok(pdf.includes('Booking confirmed by operator'))
  assert.ok(pdf.includes('Test \\(Passenger\\)'))
  assert.ok(pdf.includes('To be confirmed'))
})
