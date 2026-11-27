import { vehicleLabel } from './bookingVehicles.ts'
import type { PublicBookingView } from './types'

/** Small, offline, single-page PDF: no external CDN or customer-data upload. */
export function bookingPdfBytes(booking: PublicBookingView): Uint8Array {
  const rows = [
    'DALAMANWAY - PRIVATE AIRPORT TRANSFERS',
    'BOOKING SUMMARY - NOT A PAYMENT RECEIPT',
    '',
    'Reference: ' + booking.reference,
    'Status: ' + (booking.status || 'PENDING'),
    'Passenger: ' + booking.customerName,
    'Passengers: ' + booking.passengerCount,
    'Pickup: ' + booking.pickUpLocation,
    'Destination: ' + booking.dropOffLocation,
    'Pickup date/time (Turkey): ' + booking.transferDateTime.replace('T', ' '),
    ...(booking.returnDateTime ? ['Return date/time (Turkey): ' + booking.returnDateTime.replace('T', ' ')] : []),
    'Vehicle: ' + (booking.vehicleId ? vehicleLabel(booking.vehicleId).replaceAll('–', '-') : 'To be assigned'),
    'Trip: ' + (booking.tripType || 'One way'),
    'Price: ' + (booking.price == null ? 'To be confirmed' : 'GBP ' + booking.price.toFixed(2)),
    ...(booking.flightNumber ? ['Flight: ' + booking.flightNumber] : []),
    ...(booking.hotelName ? ['Hotel: ' + booking.hotelName] : []),
    ...(booking.transferAddress ? ['Transfer address: ' + booking.transferAddress] : []),
    '',
    booking.status === 'CONFIRMED' ? 'Booking confirmed by operator.' : 'Booking is not confirmed until operator approval.',
    'Changes and cancellations require written confirmation.',
    'dalamanway.com',
  ]
  const ascii = (s: string) => s.normalize('NFKD').replace(/[^\x20-\x7E]/g, '?')
  const escape = (s: string) => ascii(s).replace(/[\\()]/g, '\\$&')
  const commands = rows.map((line, index) => `BT /F1 ${index < 2 ? 13 : 10} Tf 45 ${795 - index * 23} Td (${escape(line).slice(0, 115)}) Tj ET`).join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
  }
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets.slice(1)) pdf += String(offset).padStart(10, '0') + ' 00000 n \n'
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return new TextEncoder().encode(pdf)
}

export function downloadBookingPdf(booking: PublicBookingView) {
  const bytes = bookingPdfBytes(booking)
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = `DalamanWay-Booking-${booking.reference}.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}
