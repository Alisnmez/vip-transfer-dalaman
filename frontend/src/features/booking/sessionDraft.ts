// Booking details belong to this tab only. Never restore sensitive legacy localStorage drafts.
export const TRANSFER_DRAFT_KEY = 'bookingTransferInfo'
export const PASSENGER_DRAFT_KEY = 'bookingPassengerInfo'
export const RECEIPT_DRAFT_KEY = 'lastBookingReceipt'

export function clearLegacyBookingStorage(): void {
  try {
    for (const key of [TRANSFER_DRAFT_KEY, PASSENGER_DRAFT_KEY, RECEIPT_DRAFT_KEY]) {
      localStorage.removeItem(key)
    }
  } catch {
    // Storage may be disabled by the browser.
  }
}

export function bookingSessionStorage(): Storage {
  clearLegacyBookingStorage()
  return sessionStorage
}

export function clearBookingDrafts(): void {
  clearLegacyBookingStorage()
  try {
    sessionStorage.removeItem(TRANSFER_DRAFT_KEY)
    sessionStorage.removeItem(PASSENGER_DRAFT_KEY)
  } catch {
    // A completed booking must not fail because storage is unavailable.
  }
}
