export type Booking = {
  id: number
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  returnDateTime?: string | null
  flightNumber?: string | null
  price: number
}

export type BookingRequest = {
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  returnDateTime?: string
  flightNumber?: string
  phoneNumber: string
  email: string
  vehicleId: string
  countryOfResidence?: string
  transferAddress: string
  specialRequests?: string
  tripType: 'one-way' | 'round-trip'
}
