import type { Booking, BookingRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const BOOKING_URL = `${API_BASE_URL}/bookings`

// Retry keys survive a page refresh in the same tab without storing customer details.
const pendingBookingKeys = new Map<string, string>()

async function retryStorageKey(payload: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))
  const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  return `booking-retry:${hex}`
}

function readRetryKey(storageKey: string): string | null {
  try {
    return sessionStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function saveRetryKey(storageKey: string, key: string): void {
  try {
    sessionStorage.setItem(storageKey, key)
  } catch {
    // In-memory retry protection still works when browser storage is unavailable.
  }
}

function clearRetryKey(storageKey: string): void {
  try {
    sessionStorage.removeItem(storageKey)
  } catch {
    // Browser storage may be disabled.
  }
}

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

export async function createBooking(data: BookingRequest) {
  const payload = JSON.stringify(data)
  const storageKey = await retryStorageKey(payload)
  let key = pendingBookingKeys.get(storageKey) ?? readRetryKey(storageKey)
  if (!key) {
    key = crypto.randomUUID()
  }
  pendingBookingKeys.set(storageKey, key)
  saveRetryKey(storageKey, key)

  const booking = await request<Booking>(BOOKING_URL, {
    method: 'POST',
    headers: { 'Idempotency-Key': key },
    body: payload,
  })
  pendingBookingKeys.delete(storageKey)
  clearRetryKey(storageKey)
  return booking
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
