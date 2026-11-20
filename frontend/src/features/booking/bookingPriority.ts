import type { Booking } from './types'
import { isBookingLive } from './liveBooking.ts'
import { parseTurkeyDateTime } from './turkeyTime.ts'

export function bookingPickupMs(value: string | null | undefined): number {
  if (!value) return Number.POSITIVE_INFINITY
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(value)
  return match ? parseTurkeyDateTime(match[1], match[2]) ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY
}

/** Live rides first (oldest start first), then nearest scheduled pickups. */
export function sortBookingsByPriority<T extends Pick<Booking, 'status' | 'transferDateTime' | 'id'>>(bookings: T[], nowMs: number): T[] {
  return [...bookings].sort((a, b) => {
    const liveDifference = Number(isBookingLive(b.status, b.transferDateTime, nowMs)) - Number(isBookingLive(a.status, a.transferDateTime, nowMs))
    return liveDifference || bookingPickupMs(a.transferDateTime) - bookingPickupMs(b.transferDateTime) || a.id - b.id
  })
}
