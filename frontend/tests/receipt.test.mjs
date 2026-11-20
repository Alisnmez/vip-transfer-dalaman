import assert from 'node:assert/strict'
import { test } from 'node:test'
import { clearPersistentBookingData, readReceiptFromStorages, saveReceiptToStorages, RECEIPT_KEY, RECEIPT_MAX_AGE_MS } from '../src/features/booking/receipt.ts'

function memoryStorage() {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}
const now = Date.parse('2027-01-01T12:00:00Z')
const receipt = {
  id: 42, customerName: 'Test Customer', pickUpLocation: 'Dalaman Airport',
  dropOffLocation: 'Marmaris', schedule: '2027-01-03 15:00', savedAt: now,
}

test('receipt survives reload in the same tab but is not copied to persistent storage', () => {
  const session = memoryStorage()
  const local = memoryStorage()
  saveReceiptToStorages(receipt, [session])
  assert.deepEqual(readReceiptFromStorages([session], now), receipt)
  assert.equal(readReceiptFromStorages([memoryStorage()], now), null)
  assert.equal(local.getItem(RECEIPT_KEY), null)
})

test('expired, future-dated and malformed receipts are discarded', () => {
  for (const invalid of [
    { ...receipt, savedAt: now - RECEIPT_MAX_AGE_MS - 1 },
    { ...receipt, savedAt: now + 1 },
    { ...receipt, id: -1 },
    { ...receipt, returnSchedule: 123 },
    [],
    null,
  ]) {
    const storage = memoryStorage()
    storage.setItem(RECEIPT_KEY, JSON.stringify(invalid))
    assert.equal(readReceiptFromStorages([storage], now), null)
    assert.equal(storage.getItem(RECEIPT_KEY), null)
  }
})

test('blocked storage does not hide a valid receipt in another storage', () => {
  const blocked = {
    getItem: () => { throw new Error('blocked') },
    setItem: () => { throw new Error('blocked') },
    removeItem: () => { throw new Error('blocked') },
  }
  const available = memoryStorage()
  saveReceiptToStorages(receipt, [blocked, available])
  assert.deepEqual(readReceiptFromStorages([blocked, available], now), receipt)
})

test('legacy persistent booking drafts and receipts are removed without touching other preferences', () => {
  const storage = memoryStorage()
  for (const key of ['bookingTransferInfo', 'bookingPassengerInfo', RECEIPT_KEY]) storage.setItem(key, 'private')
  storage.setItem('language', 'de')
  clearPersistentBookingData(storage)
  for (const key of ['bookingTransferInfo', 'bookingPassengerInfo', RECEIPT_KEY]) assert.equal(storage.getItem(key), null)
  assert.equal(storage.getItem('language'), 'de')
})
