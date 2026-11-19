import { findTransferPrice, transferVehicles } from './pricing.ts'
import { bookingVehicles } from './bookingVehicles.ts'

export type TransferSelection = {
  pickUpLocation?: string
  dropOffLocation?: string
  vehicleId?: string
  tripType?: 'one-way' | 'round-trip'
  passengerCount?: number
  luggageCount?: number
  babySeatCount?: number
}

export function validateTransferSelection(transfer: TransferSelection, savedVehicleId?: string | null): string | null {
  const airport = 'Dalaman Airport'
  let destination: string | undefined
  if (transfer.pickUpLocation === airport) {
    destination = transfer.dropOffLocation
  } else if (transfer.dropOffLocation === airport) {
    destination = transfer.pickUpLocation
  }

  if (!destination || !transfer.vehicleId ||
      (transfer.tripType !== 'one-way' && transfer.tripType !== 'round-trip') ||
      findTransferPrice(destination, transfer.vehicleId, transfer.tripType) === null) {
    return 'Your route or vehicle is no longer available. Please return to the transfer step.'
  }

  // Admin edits may retain the saved legacy category; new choices use the current fleet.
  const vehicle = savedVehicleId && transfer.vehicleId === savedVehicleId
    ? transferVehicles.find(item => item.id === savedVehicleId)
    : bookingVehicles.find(item => item.id === transfer.vehicleId)
  const passengers = transfer.passengerCount
  const luggage = transfer.luggageCount
  const babySeats = transfer.babySeatCount

  if (!vehicle || !Number.isInteger(passengers) || passengers === undefined ||
      passengers < 1 || passengers > vehicle.maxPassengers ||
      !Number.isInteger(luggage) || luggage === undefined ||
      luggage < 0 || luggage > vehicle.maxLuggage ?? 0 ||
      !Number.isInteger(babySeats) || babySeats === undefined ||
      babySeats < 0 || babySeats > 2) {
    return 'Passenger, luggage or baby seat count is invalid for the selected vehicle. Please review your transfer.'
  }
  return null
}
