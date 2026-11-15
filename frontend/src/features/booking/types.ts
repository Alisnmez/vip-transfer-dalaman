export type Booking = {
  id: number
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  price: number
  vehicleId: string
  tripType: 'one-way' | 'round-trip'
}

export type BookingRequest = {
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  price: number
}
