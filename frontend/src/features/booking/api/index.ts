import type { Booking, BookingRequest } from '../types'
import { getAdminAuthorization } from '../adminCredentials'
import { createSingleFlight } from '../singleFlight'
import { createRetryKeyStore } from '../retryKeys'
import { bookingHttpError, bookingInvalidSuccessResponse, classifyBookingFailure } from './errors'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const BOOKING_URL = `${API_BASE_URL}/bookings`
const ADMIN_AUTH_URL = `${API_BASE_URL}/admin/auth-check`

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

async function request<T>(url: string, options?: RequestInit, admin = false, timeoutMs = 60000): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const authorization = admin ? getAdminAuthorization() : null
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
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
    const failure = classifyBookingFailure(error)
    if (!options?.method || options.method === 'GET') {
      if (failure.status === null && failure.uncertain) {
        throw new Error('Could not connect to the booking service. It may be starting up. Please wait a moment and refresh.')
      }
    }
    throw failure
  } finally {
    clearTimeout(timeout)
  }
}

export function checkAdminAccess() {
  // Authentication does not need to download private booking details.
  return request<void>(ADMIN_AUTH_URL, undefined, true, 20000)
}

export type DashboardSummary = {
  total: number
  pending: number
  today: number
  upcoming: Booking[]
}

export function getDashboardSummary() {
  return request<DashboardSummary>(`${BOOKING_URL}/dashboard`, undefined, true)
}

export function getBookings() {
  return request<Booking[]>(BOOKING_URL, undefined, true)
}

export type BookingPage = {
  content: Booking[]
  totalElements: number
  totalPages: number
  number: number
}

export function getCalendarBookings(month: string) {
  return request<Booking[]>(`${BOOKING_URL}/calendar?month=${encodeURIComponent(month)}`, undefined, true)
}

export function getBookingPage(page: number, size = 25) {
  return request<BookingPage>(`${BOOKING_URL}/page?page=${page}&size=${size}`, undefined, true)
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

export function updateBookingStatus(id: number, status: string) {
  return request<Booking>(`${BOOKING_URL}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, true)
}

