import test from 'node:test'
import assert from 'node:assert/strict'
import { fleetExpansionDraft } from '../src/features/vehicle-type/fleetExpansionDraft.ts'
import { fleetCatalogue } from '../src/features/vehicle-type/fleetCatalogue.ts'
import { bookingVehicles, vehicleLabel } from '../src/features/booking/bookingVehicles.ts'

test('draft contains seven distinct research categories and fourteen local image paths', () => {
  assert.equal(fleetExpansionDraft.length, 7)
  assert.equal(new Set(fleetExpansionDraft.map(v => v.key)).size, 7)
  const paths = fleetExpansionDraft.flatMap(v => [v.exterior, v.interior])
  assert.equal(new Set(paths).size, 14)
  for (const path of paths) assert.match(path, /^\/images\/vehicles\/[a-z0-9-]+\.webp$/)
})

test('draft Sprinter capacities match the requested nine and fifteen passenger classes', () => {
  for (const vehicle of fleetExpansionDraft.filter(v => v.key.includes('sprinter'))) {
    assert.equal(vehicle.maxPassengers, vehicle.key.endsWith('-9') ? 9 : 15)
  }
})

test('current booking identifiers and labels remain unchanged during draft preparation', () => {
  const expected = [
    ['vip-minivan', 'VIP Vito', 5, 5],
    ['maybach', 'Ultra VIP Vito', 4, 4],
    ['minibus-long', 'Sprinter', 16, 16],
    ['vip-minibus', 'Ultra Sprinter', 9, 12],
  ]
  assert.deepEqual(bookingVehicles.map(v => [v.id, v.name, v.maxPassengers, v.maxLuggage]), expected)
  for (const [id, name] of expected) assert.equal(vehicleLabel(id), name)
  assert.equal(fleetCatalogue.length, 4)
})
