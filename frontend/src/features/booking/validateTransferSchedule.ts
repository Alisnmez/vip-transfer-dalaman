import { parseTurkeyDateTime } from './turkeyTime.ts'

export type TransferSchedule = {
  pickUpDate?: string
  pickUpTime?: string
  tripType?: 'one-way' | 'round-trip'
  returnDate?: string
  returnTime?: string
}

/** Validate transfer times in Turkey local time, independent of the visitor's timezone. */
export function validateTransferSchedule(schedule: TransferSchedule, now = Date.now()): string | null {
  const pickup = typeof schedule.pickUpDate === 'string' && typeof schedule.pickUpTime === 'string'
    ? parseTurkeyDateTime(schedule.pickUpDate, schedule.pickUpTime)
    : null
  if (pickup === null || pickup <= now) {
    return 'Your transfer date is no longer valid. Please return to the transfer step and choose a future date in Turkey local time.'
  }
  if (schedule.tripType === 'round-trip') {
    const returning = typeof schedule.returnDate === 'string' && typeof schedule.returnTime === 'string'
      ? parseTurkeyDateTime(schedule.returnDate, schedule.returnTime)
      : null
    if (returning === null || returning <= pickup) {
      return 'Please choose a return date and time after your outbound pickup.'
    }
  }
  return null
}
