import type { Booking, BookingRequest } from '../types'
import { getAdminAuthorization } from '../adminCredentials'
import { createSingleFlight } from '../singleFlight'
import { createRetryKeyStore } from '../retryKeys'
import { bookingHttpError, bookingInvalidSuccessResponse, classifyBookingFailure } from './errors'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const BOOKING_URL = `${API_BASE_URL}/bookings`

// Retry keys survive refreshes within the same tab, with an in-memory fallback.
const retryKeys = createRetryKeyStore(
  (() => { try { return sessionStorage } catch { return null } })(),
  () => crypto.randomUUID(),
)
const runBookingOnce = createSingleFlight<Booking>()

async function retryStorageKey(payload: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))
  const hex = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  return `booking-retry:${hex}`
}

async function request<T>(url: string, options?: RequestInit, admin = false): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(admin && getAdminAuthorization() ? { Authorization: getAdminAuthorization()! } : {}),
        ...options?.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      throw bookingHttpError(response.status, error?.message)
    }

    const responseText = await response.text()
    try {
      return (responseText ? JSON.parse(responseText) : undefined) as T
    } catch (error) {
      throw bookingInvalidSuccessResponse(error)
    }
  } catch (error) {
    throw classifyBookingFailure(error)
  } finally {
    clearTimeout(timeout)
  }
}

export function getBookings() {
  return request<Booking[]>(BOOKING_URL, undefined, true)
}

export function getBooking(id: number) {
  return request<Booking>(`${BOOKING_URL}/${id}`, undefined, true)
}

export async function createBooking(data: BookingRequest) {
  const payload = JSON.stringify(data)
  const storageKey = await retryStorageKey(payload)
  return runBookingOnce(storageKey, async () => {
    const key = retryKeys.getOrCreate(storageKey)

    const booking = await request<Booking>(BOOKING_URL, {
      method: 'POST',
      headers: { 'Idempotency-Key': key },
      body: payload,
    })
    if (!booking || !Number.isSafeInteger(booking.id) || booking.id < 1) {
      throw bookingInvalidSuccessResponse()
    }
    retryKeys.clear(storageKey)
    return booking
  })
}

export function updateBooking(id: number, data: BookingRequest) {
  return request<Booking>(`${BOOKING_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true)
}

export function deleteBooking(id: number) {
  return request<void>(`${BOOKING_URL}/${id}`, {
    method: 'DELETE',
  }, true)
}
