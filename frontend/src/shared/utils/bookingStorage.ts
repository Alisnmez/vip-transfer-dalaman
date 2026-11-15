// Shared browser storage helpers for the booking flow.
export const BOOKING_STORAGE_KEYS = {
  transfer: 'bookingTransferInfo',
  passenger: 'bookingPassengerInfo',
} as const

export function readStoredJson<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

export function writeStoredJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function clearBookingStorage(): void {
  localStorage.removeItem(BOOKING_STORAGE_KEYS.transfer)
  localStorage.removeItem(BOOKING_STORAGE_KEYS.passenger)
}
