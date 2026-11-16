export type Booking = {
  id: number
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  returnDateTime?: string | null
  flightNumber?: string | null
  luggageCount?: number | null
  babySeatCount?: number | null
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
  luggageCount?: number
  babySeatCount?: number
  phoneNumber: string
  email: string
  vehicleId: string
  countryOfResidence?: string
  transferAddress: string
  hotelName?: string
  specialRequests?: string
  tripType: 'one-way' | 'round-trip'
}
