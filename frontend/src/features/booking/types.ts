export type Booking = {
  id: number
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  price: number
}

export type BookingRequest = {
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  price: number
}
