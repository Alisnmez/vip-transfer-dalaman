import { findTransferPrice, transferVehicles } from './pricing'

export type TransferSelection = {
  pickUpLocation?: string
  dropOffLocation?: string
  vehicleId?: string
  tripType?: 'one-way' | 'round-trip'
  passengerCount?: number
  luggageCount?: number
  babySeatCount?: number
}

export function validateTransferSelection(transfer: TransferSelection): string | null {
  const destination = transfer.pickUpLocation === 'Dalaman Airport'
    ? transfer.dropOffLocation
    : transfer.dropOffLocation === 'Dalaman Airport'
      ? transfer.pickUpLocation
      : null
  if (!destination || !transfer.vehicleId ||
      (transfer.tripType !== 'one-way' && transfer.tripType !== 'round-trip') ||
      findTransferPrice(destination, transfer.vehicleId, transfer.tripType) === null) {
    return 'Your route or vehicle is no longer available. Please return to the transfer step.'
  }
  const vehicle = transferVehicles.find(item => item.id === transfer.vehicleId)
  if (!vehicle || !Number.isInteger(transfer.passengerCount) ||
      (transfer.passengerCount ?? 0) < 1 || (transfer.passengerCount ?? 0) > vehicle.maxPassengers ||
      !Number.isInteger(transfer.luggageCount) || (transfer.luggageCount ?? -1) < 0 ||
      (transfer.luggageCount ?? 0) > Math.min(8, vehicle.maxLuggage ?? 8) ||
      !Number.isInteger(transfer.babySeatCount) || (transfer.babySeatCount ?? -1) < 0 ||
      (transfer.babySeatCount ?? 0) > 2) {
    return 'Passenger, luggage or baby seat count is invalid for the selected vehicle. Please review your transfer.'
  }
  return null
}
