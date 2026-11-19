import { transferVehicles } from './pricing.ts'
import { fleetCatalogue } from '../vehicle-type/fleetCatalogue.ts'

// Keep existing pricing IDs so route prices and historical bookings stay valid.
// Larger luggage requests require operator confirmation, as stated on Vehicles.
export const bookingVehicles = fleetCatalogue.map(vehicle => ({
  id: vehicle.bookingVehicleId,
  name: vehicle.name,
  maxPassengers: vehicle.maxPassengers,
  maxLuggage: vehicle.luggage,
}))

export function getVehicleLimits(vehicleId: string) {
  return bookingVehicles.find(vehicle => vehicle.id === vehicleId) ?? null
}

export function clampVehicleCount(value: number, maximum: number, minimum = 0): number {
  return Math.max(minimum, Math.min(maximum, value))
}

export function vehicleLabel(id?: string | null): string {
  return bookingVehicles.find(vehicle => vehicle.id === id)?.name
    ?? transferVehicles.find(vehicle => vehicle.id === id)?.name
    ?? (id || 'Not provided')
}
