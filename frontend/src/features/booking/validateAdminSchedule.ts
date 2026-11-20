import { validateTransferSchedule } from './validateTransferSchedule.ts'

type Schedule = { transferDateTime: string; returnDateTime?: string | null; tripType?: string | null }

/** Preserve historical records for contact corrections, but never move a trip into the past. */
export function validateAdminSchedule(draft: Schedule, saved: Schedule, now = Date.now()): string | null {
  const sameTime = (a?: string | null, b?: string | null) => (a ?? '').slice(0, 16) === (b ?? '').slice(0, 16)
  if (sameTime(draft.transferDateTime, saved.transferDateTime)
      && sameTime(draft.returnDateTime, saved.returnDateTime) && draft.tripType === saved.tripType) return null
  return validateTransferSchedule({
    pickUpDate: draft.transferDateTime.slice(0, 10), pickUpTime: draft.transferDateTime.slice(11, 16),
    tripType: draft.tripType === 'round-trip' ? 'round-trip' : 'one-way',
    returnDate: draft.returnDateTime?.slice(0, 10), returnTime: draft.returnDateTime?.slice(11, 16),
  }, now) ? 'Choose a future pickup in Turkey local time and a return time after pickup before saving.' : null
}
