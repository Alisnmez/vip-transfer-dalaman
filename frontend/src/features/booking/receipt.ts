export const RECEIPT_KEY = 'lastBookingReceipt'
export const RECEIPT_MAX_AGE_MS = 24 * 60 * 60 * 1000

export type BookingReceipt = {
  id: number
  reference: string
  customerName: string
  pickUpLocation: string
  dropOffLocation: string
  schedule: string
  returnSchedule?: string
  savedAt: number
}

export type ReceiptStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export function readReceiptFromStorages(storages: readonly ReceiptStorage[], now = Date.now()): BookingReceipt | null {
  for (const storage of storages) {
    try {
      const raw = storage.getItem(RECEIPT_KEY)
      if (!raw) continue
      const value: unknown = JSON.parse(raw)
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        storage.removeItem(RECEIPT_KEY)
        continue
      }
      const receipt = value as Record<string, unknown>
      if (typeof receipt.id !== 'number' || !Number.isSafeInteger(receipt.id) || receipt.id < 1 ||
          typeof receipt.savedAt !== 'number' || !Number.isFinite(receipt.savedAt) ||
          receipt.savedAt > now || now - receipt.savedAt > RECEIPT_MAX_AGE_MS ||
          (typeof receipt.reference !== 'string' || !/^[A-Z]{4}[0-9]{3}$/.test(receipt.reference)) ||
          typeof receipt.customerName !== 'string' ||
          typeof receipt.pickUpLocation !== 'string' ||
          typeof receipt.dropOffLocation !== 'string' ||
          typeof receipt.schedule !== 'string' ||
          (receipt.returnSchedule !== undefined && typeof receipt.returnSchedule !== 'string')) {
        storage.removeItem(RECEIPT_KEY)
        continue
      }
      return receipt as BookingReceipt
    } catch {
      // Unavailable storage or malformed JSON: try the next storage.
    }
  }
  return null
}

export function saveReceiptToStorages(receipt: BookingReceipt, storages: readonly ReceiptStorage[]): void {
  for (const storage of storages) {
    try {
      storage.setItem(RECEIPT_KEY, JSON.stringify(receipt))
    } catch {
      // A successful booking must not be reported as failed because storage is unavailable.
    }
  }
}

/** Remove only legacy booking keys, never unrelated site preferences. */
export function clearPersistentBookingData(storage: Pick<Storage, 'removeItem'>): void {
  for (const key of ['bookingTransferInfo', 'bookingPassengerInfo', RECEIPT_KEY]) {
    try { storage.removeItem(key) } catch { /* Storage may be unavailable. */ }
  }
}
