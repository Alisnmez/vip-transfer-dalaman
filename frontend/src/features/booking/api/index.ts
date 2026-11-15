import type { Booking, BookingRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const BOOKING_URL = `${API_BASE_URL}/bookings`

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      throw new Error(error?.message ?? `Booking service returned HTTP ${response.status}. Please contact support if this continues.`)
    }

    const responseText = await response.text()
    return (responseText ? JSON.parse(responseText) : undefined) as T
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The booking service did not respond within 60 seconds. Please contact support before retrying, as your booking may have been received.')
    }
    if (error instanceof TypeError) {
      throw new Error('Unable to reach the booking service. Please check your connection and contact support before retrying.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
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
