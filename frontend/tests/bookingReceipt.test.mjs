import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readReceiptFromStorages, saveReceiptToStorages, RECEIPT_KEY } from '../src/features/booking/receipt.ts'

function storage() {
  const values = new Map()
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
}

function receipt(reference, savedAt = Date.now()) {
  return { id: 42, reference, savedAt, customerName: 'Test Passenger',
    pickUpLocation: 'Dalaman Airport', dropOffLocation: 'Marmaris', schedule: '2035-06-10 12:00' }
}

test('mixed alphanumeric booking reference survives receipt reload', () => {
  const store = storage()
  const value = receipt('T7K2MA8')
  saveReceiptToStorages(value, [store])
  assert.deepEqual(readReceiptFromStorages([store], value.savedAt), value)
})

test('legacy references remain readable', () => {
  const store = storage()
  const value = receipt('VJXJ756')
  saveReceiptToStorages(value, [store])
  assert.deepEqual(readReceiptFromStorages([store], value.savedAt), value)
})

test('invalid references are rejected and cleared', () => {
  const store = storage()
  saveReceiptToStorages(receipt('INVALID-REF'), [store])
  assert.equal(readReceiptFromStorages([store]), null)
  assert.equal(store.getItem(RECEIPT_KEY), null)
})
