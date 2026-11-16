import { parseTurkeyDateTime } from './turkeyTime.ts'

/** A confirmed transfer is live from its scheduled Turkey pickup time until completion. */
export function isBookingLive(status: string | null | undefined, transferDateTime: string | null | undefined, nowMs: number = Date.now()): boolean {
  if (status !== 'CONFIRMED' || !transferDateTime) return false
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::\d{2})?$/.exec(transferDateTime)
  if (!match) return false
  const pickupMs = parseTurkeyDateTime(match[1], match[2])
  return pickupMs !== null && nowMs >= pickupMs
}
