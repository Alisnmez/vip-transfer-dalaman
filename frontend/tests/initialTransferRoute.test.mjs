import assert from 'node:assert/strict'
import test from 'node:test'
import { initialTransferRoute } from '../src/features/booking/initialTransferRoute.ts'

const reverseDraft = {
  pickUpLocation: 'Marmaris(Any Hotel)',
  dropOffLocation: 'Dalaman Airport',
}

test('route detail links override both locations of a reverse booking draft', () => {
  for (const [requested, expected] of [
    ['Marmaris(Any Hotel)', 'Marmaris(Any Hotel)'],
    ['Fethiye City Center(Any Hotel)', 'Fethiye City Center(Any Hotel)'],
    ['Oludeniz', 'Oludeniz(Any Hotel)'],
    ['Gocek', 'Gocek'],
    ['Icmeler(Any Hotel)', 'Icmeler(Any Hotel)'],
  ]) {
    assert.deepEqual(initialTransferRoute(requested, reverseDraft), {
      pickUpLocation: 'Dalaman Airport',
      dropOffLocation: expected,
    })
  }
})

test('direct booking and unknown destinations preserve the saved route', () => {
  for (const requested of [null, ' ', 'Unknown destination']) {
    assert.deepEqual(initialTransferRoute(requested, reverseDraft), reverseDraft)
  }
})
