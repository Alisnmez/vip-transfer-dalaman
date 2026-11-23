import { describe, expect, it } from 'vitest'
import { readReceiptFromStorages, type ReceiptStorage } from './receipt'

function storedReceipt(reference?: string): ReceiptStorage {
  const receipt = {
    id: 18,
    ...(reference === undefined ? {} : { reference }),
    customerName: 'Test Passenger',
    pickUpLocation: 'Dalaman Airport',
    dropOffLocation: 'Marmaris',
    schedule: '2026-12-20 12:00',
    savedAt: 1000,
  }
  let data: string | null = JSON.stringify(receipt)
  return {
    getItem: () => data,
    setItem: (_key, value) => { data = value },
    removeItem: () => { data = null },
  }
}

describe('booking receipt reference', () => {
  it('rejects old receipts that only contain a numeric booking ID', () => {
    expect(readReceiptFromStorages([storedReceipt()], 2000)).toBeNull()
  })
  it('rejects numeric and hash-prefixed references', () => {
    expect(readReceiptFromStorages([storedReceipt('#18')], 2000)).toBeNull()
    expect(readReceiptFromStorages([storedReceipt('18')], 2000)).toBeNull()
  })
  it('accepts only a four-letter three-digit public reference', () => {
    expect(readReceiptFromStorages([storedReceipt('ABCD123')], 2000)?.reference).toBe('ABCD123')
  })
})
