import { validateTransferSchedule } from './validateTransferSchedule.ts'
import { validateTransferSelection } from './validateTransferSelection.ts'

export type TransferDetails = {
  pickUpLocation?: string
  dropOffLocation?: string
  pickUpDate?: string
  pickUpTime?: string
  returnDate?: string
  returnTime?: string
  passengerCount?: number
  flightNumber?: string
  luggageCount?: number
  babySeatCount?: number
  vehicleId?: string
  vehicleName?: string
  vehicleType?: string
  vehicleClass?: string
  tripType?: 'one-way' | 'round-trip'
  price?: number
}

export type PassengerDetails = {
  customerName?: string
  phoneNumber?: string
  email?: string
  hotelName?: string
  countryOfResidence?: string
  transferAddress?: string
  specialRequests?: string
}

export function validateBookingDetails(transfer: TransferDetails, passenger: PassengerDetails, now = Date.now()): string | null {
  if (typeof passenger.customerName !== 'string' || typeof passenger.phoneNumber !== 'string' ||
      typeof passenger.email !== 'string' || typeof passenger.transferAddress !== 'string' ||
      typeof transfer.pickUpLocation !== 'string' || typeof transfer.dropOffLocation !== 'string' ||
      typeof transfer.pickUpDate !== 'string' || typeof transfer.pickUpTime !== 'string' ||
      typeof transfer.vehicleId !== 'string' || !Number.isInteger(transfer.passengerCount) ||
      (transfer.tripType !== 'one-way' && transfer.tripType !== 'round-trip') ||
      (transfer.tripType === 'round-trip' &&
        (typeof transfer.returnDate !== 'string' || typeof transfer.returnTime !== 'string'))) {
    return 'Saved booking details are invalid. Please return to the previous steps.'
  }

  const selectionError = validateTransferSelection(transfer)
  if (selectionError) return selectionError

  if ((transfer.flightNumber !== undefined &&
       (typeof transfer.flightNumber !== 'string' || !/^[A-Za-z0-9 -]{1,20}$/.test(transfer.flightNumber))) ||
      (passenger.hotelName !== undefined && typeof passenger.hotelName !== 'string') ||
      (passenger.countryOfResidence !== undefined && typeof passenger.countryOfResidence !== 'string') ||
      (passenger.specialRequests !== undefined && typeof passenger.specialRequests !== 'string')) {
    return 'Saved booking details contain invalid values. Please return to the previous steps.'
  }

  const scheduleError = validateTransferSchedule(transfer, now)
  if (scheduleError) return scheduleError

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
    return 'Please review the email address before confirming.'
  }
  if (!/^\+\d{8,15}$/.test(passenger.phoneNumber) ||
      !passenger.customerName.trim() || !passenger.transferAddress.trim() ||
      !passenger.countryOfResidence?.trim()) {
    return 'Saved passenger contact or pickup details are invalid. Please return to the passenger step.'
  }
  if (passenger.customerName.trim().length > 161 || passenger.phoneNumber.trim().length > 16 ||
      passenger.email.trim().length > 254 || passenger.transferAddress.trim().length > 250 ||
      (passenger.hotelName?.length ?? 0) > 120 || (passenger.specialRequests?.length ?? 0) > 1000) {
    return 'Some saved passenger details are too long. Please return to the passenger step and review them.'
  }
  return null
}
