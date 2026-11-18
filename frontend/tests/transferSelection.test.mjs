import { bookingVehicles } from '../src/features/booking/bookingVehicles.ts'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateTransferSelection } from '../src/features/booking/validateTransferSelection.ts'
import { findTransferPrice, transferPrices, transferVehicles } from '../src/features/booking/pricing.ts'
import { readFileSync } from 'node:fs'
import { destinationGroups } from '../src/features/booking/destinationGroups.ts'

test('frontend, backend and destination selector share the complete priced catalogue', () => {
  const backendPrices = JSON.parse(readFileSync(new URL('../../src/main/resources/transfer-prices.json', import.meta.url), 'utf8'))
  assert.deepEqual(transferPrices, backendPrices)
  assert.equal(backendPrices.length, 531)
  const original = JSON.parse(readFileSync(new URL('../../docs/pricing/original-catalogue-2026-11-18.json', import.meta.url), 'utf8'))
  for (const row of original) assert.deepEqual(backendPrices.find(item => item.destination === row.destination && item.vehicleId === row.vehicleId), row)
  for (const name of new Set(backendPrices.map(row => row.destination))) {
    assert.equal(backendPrices.filter(row => row.destination === name).length, transferVehicles.length)
  }
  const names = destinationGroups.flatMap(group => group.names)
  assert.equal(names.length, new Set(names).size)
  assert.deepEqual(new Set(names), new Set(backendPrices.map(row => row.destination)))
})

test('source aliases preserve verified fares and cruise vehicles use the Marmaris zone', () => {
  assert.equal(findTransferPrice('Marmaris Cruise Port', 'taxi', 'one-way'), 42.5)
  assert.equal(findTransferPrice('Marmaris Cruise Port', 'taxi', 'round-trip'), 85)
  for (const vehicle of transferVehicles) {
    assert.equal(findTransferPrice('Marmaris Cruise Port', vehicle.id, 'one-way'), findTransferPrice('Marmaris(Any Hotel)', vehicle.id, 'one-way'))
  }
  for (const name of ['Bozburun', 'Sogut']) {
    for (const vehicle of transferVehicles) {
      assert.equal(findTransferPrice(name, vehicle.id, 'one-way'), findTransferPrice('Bozburun / Sogut', vehicle.id, 'one-way'))
      assert.equal(findTransferPrice(name, vehicle.id, 'round-trip'), findTransferPrice('Bozburun / Sogut', vehicle.id, 'round-trip'))
    }
  }
})

const valid = {
  pickUpLocation: 'Dalaman Airport',
  dropOffLocation: 'Marmaris(Any Hotel)',
  vehicleId: 'vip-minivan',
  tripType: 'one-way',
  passengerCount: 5,
  luggageCount: 5,
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

test('every bookable vehicle accepts its exact passenger limit and rejects one extra', () => {
  for (const vehicle of bookingVehicles) {
    const route = transferPrices.find(entry => entry.vehicleId === vehicle.id)
    assert.ok(route, 'missing route for ' + vehicle.id)
    const luggage = Math.min(8, vehicle.maxLuggage ?? 8)
    const selection = {
      ...valid,
      dropOffLocation: route.destination,
      vehicleId: vehicle.id,
      passengerCount: vehicle.maxPassengers,
      luggageCount: luggage,
    }
    assert.equal(validateTransferSelection(selection), null, vehicle.id + ' should accept published capacity')
    assert.ok(validateTransferSelection({ ...selection, passengerCount: vehicle.maxPassengers + 1 }),
      vehicle.id + ' must reject overcapacity')
    assert.ok(validateTransferSelection({ ...selection, luggageCount: luggage + 1 }),
      vehicle.id + ' must reject excess luggage')
  }
})

test('fractional, missing and non-finite counts are rejected', () => {
  for (const count of [undefined, -1, 1.5, NaN, Infinity]) {
    assert.ok(validateTransferSelection({ ...valid, luggageCount: count }))
    assert.ok(validateTransferSelection({ ...valid, babySeatCount: count }))
  }
  for (const count of [undefined, 0, -1, 1.5, NaN, Infinity]) {
    assert.ok(validateTransferSelection({ ...valid, passengerCount: count }))
  }
})


test('the four public fleet categories retain their intended existing fares', () => {
  assert.deepEqual(bookingVehicles.map(v => [v.name, v.id]), [
    ['VIP Vito', 'vip-minivan'], ['Ultra VIP Vito', 'maybach'],
    ['Sprinter', 'minibus-long'], ['Ultra Sprinter', 'vip-minibus'],
  ])
  for (const vehicle of bookingVehicles) {
    for (const destination of new Set(transferPrices.map(row => row.destination))) {
      assert.ok(findTransferPrice(destination, vehicle.id, 'one-way') > 0)
      assert.ok(findTransferPrice(destination, vehicle.id, 'round-trip') > 0)
    }
  }
  for (const id of ['taxi', 'premium-vip-minivan', 'maybach-plus', 'minibus', 'vip-minibus-long']) {
    assert.ok(validateTransferSelection({ ...valid, vehicleId: id }))
  }
})
