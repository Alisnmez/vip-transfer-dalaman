import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateTransferSelection } from '../src/features/booking/validateTransferSelection.ts'
import { findTransferPrice, transferPrices, transferVehicles } from '../src/features/booking/pricing.ts'

const valid = {
  pickUpLocation: 'Dalaman Airport',
  dropOffLocation: 'Marmaris(Any Hotel)',
  vehicleId: 'vip-minivan',
  tripType: 'one-way',
  passengerCount: 5,
  luggageCount: 6,
  babySeatCount: 0,
}

test('published price catalogue contains unique routes, supported vehicles and positive fares', () => {
  const vehicles = new Set(transferVehicles.map(vehicle => vehicle.id))
  const keys = new Set()
  for (const entry of transferPrices) {
    const key = entry.destination + ':' + entry.vehicleId
    assert.ok(!keys.has(key), 'duplicate fare ' + key)
    keys.add(key)
    assert.ok(vehicles.has(entry.vehicleId), 'unknown vehicle ' + key)
    assert.ok(Number.isFinite(entry.oneWay) && entry.oneWay > 0, key)
    assert.ok(Number.isFinite(entry.roundTrip) && entry.roundTrip > 0, key)
    assert.equal(findTransferPrice(entry.destination, entry.vehicleId, 'one-way'), entry.oneWay)
    assert.equal(findTransferPrice(entry.destination, entry.vehicleId, 'round-trip'), entry.roundTrip)
  }
  assert.ok(keys.size > 0)
})

test('valid selection and reverse airport transfer are accepted', () => {
  assert.equal(validateTransferSelection(valid), null)
  assert.equal(validateTransferSelection({
    ...valid, pickUpLocation: valid.dropOffLocation, dropOffLocation: 'Dalaman Airport',
  }), null)
})

test('unknown routes, vehicles and non-airport transfers are rejected', () => {
  assert.ok(validateTransferSelection({ ...valid, dropOffLocation: 'Unknown resort' }))
  assert.ok(validateTransferSelection({ ...valid, vehicleId: 'fake' }))
  assert.ok(validateTransferSelection({ ...valid, pickUpLocation: 'Marmaris(Any Hotel)', dropOffLocation: 'Sarigerme' }))
})

test('passenger, luggage and baby-seat capacity is checked before booking submission', () => {
  assert.ok(validateTransferSelection({ ...valid, passengerCount: 6 }))
  assert.ok(validateTransferSelection({ ...valid, passengerCount: 0 }))
  assert.ok(validateTransferSelection({ ...valid, luggageCount: 7 }))
  assert.ok(validateTransferSelection({ ...valid, luggageCount: -1 }))
  assert.ok(validateTransferSelection({ ...valid, babySeatCount: 3 }))
  assert.ok(validateTransferSelection({ ...valid, babySeatCount: undefined }))
  assert.ok(validateTransferSelection({ ...valid, passengerCount: 2.5 }))
  assert.equal(validateTransferSelection({ ...valid, passengerCount: 4, luggageCount: 5, babySeatCount: 2 }), null)
})
