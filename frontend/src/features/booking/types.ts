export type Booking = {
  id: number
  reference: string
  createdAt?: string | null
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
  status?: string | null
  phoneNumber?: string | null
  email?: string | null
  hotelName?: string | null
  transferAddress?: string | null
  specialRequests?: string | null
  vehicleId?: string | null
  tripType?: string | null
  countryOfResidence?: string | null
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

export type BookingManagementRequest = {
  id: number
  bookingId: number
  bookingReference: string | null
  requestType: 'CHANGE' | 'CANCEL'
  message: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'DECLINED'
  adminNote?: string | null
  createdAt: string
  updatedAt: string
  customerName: string
  customerEmail: string
  pickup: string
  destination: string
  transferDateTime: string | null
  returnDateTime: string | null
  bookingStatus: string
}

export type BookingManagementRequestSubmission = {
  bookingReference: string
  email: string
  requestType: 'CHANGE' | 'CANCEL'
  message: string
}

export type PublicBookingView = {
  reference: string
  status: string
  customerName: string
  passengerCount: number
  pickUpLocation: string
  dropOffLocation: string
  transferDateTime: string
  returnDateTime?: string | null
  vehicleId?: string | null
  tripType?: string | null
  price?: number | null
  flightNumber?: string | null
  luggageCount?: number | null
  babySeatCount?: number | null
  hotelName?: string | null
  transferAddress?: string | null
}
