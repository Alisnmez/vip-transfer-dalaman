import type { Booking, BookingRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const BOOKING_URL = `${API_BASE_URL}/bookings`

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message ?? 'Request failed')
  }

  const responseText = await response.text()
  return (responseText ? JSON.parse(responseText) : undefined) as T
}

export function getBookings() {
  return request<Booking[]>(BOOKING_URL)
}

export function getBooking(id: number) {
  return request<Booking>(`${BOOKING_URL}/${id}`)
}

export function createBooking(data: BookingRequest) {
  return request<Booking>(BOOKING_URL, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateBooking(id: number, data: BookingRequest) {
  return request<Booking>(`${BOOKING_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteBooking(id: number) {
  return request<void>(`${BOOKING_URL}/${id}`, {
    method: 'DELETE',
  })
}
