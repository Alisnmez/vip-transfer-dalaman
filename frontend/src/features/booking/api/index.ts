import type { Booking, BookingManagementRequest, BookingManagementRequestSubmission, BookingRequest, PublicBookingView } from '../types'
import { getAdminAuthorization } from '../adminCredentials'
import { createSingleFlight } from '../singleFlight'
import { createRetryKeyStore } from '../retryKeys'
import { bookingHttpError, bookingInvalidSuccessResponse, classifyBookingFailure } from './errors'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
const BOOKING_URL = `${API_BASE_URL}/bookings`
const ADMIN_AUTH_URL = `${API_BASE_URL}/admin/auth-check`
const ADMIN_SESSION_URL = `${API_BASE_URL}/admin/session`

async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${ADMIN_SESSION_URL}/csrf`, { credentials: 'include' })
  if (!response.ok) throw bookingHttpError(response.status)
  const body: unknown = await response.json()
  if (!body || typeof body !== 'object' || !('token' in body) || typeof body.token !== 'string') {
    throw new Error('Could not verify admin request security token.')
  }
  return body.token
}

export async function createAdminSession(): Promise<void> {
  const authorization = getAdminAuthorization()
  if (!authorization) throw new Error('Admin credentials are required.')
  const response = await fetch(`${ADMIN_SESSION_URL}/login`, {
    method: 'POST', credentials: 'include', headers: { Authorization: authorization },
  })
  if (!response.ok) throw bookingHttpError(response.status)
}

export async function endAdminSession(): Promise<void> {
  const authorization = getAdminAuthorization()
  const token = authorization ? null : await fetchCsrfToken()
  const response = await fetch(`${ADMIN_SESSION_URL}/logout`, {
    method: 'POST', credentials: 'include',
    headers: authorization
      ? { Authorization: authorization, 'X-Admin-Request': '1' }
      : { 'X-CSRF-TOKEN': token! },
  })
  if (!response.ok) throw bookingHttpError(response.status)
}

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

export async function request<T>(url: string, options?: RequestInit, admin = false, timeoutMs = 60000): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const method = (options?.method ?? 'GET').toUpperCase()
    const unsafe = !['GET', 'HEAD', 'OPTIONS'].includes(method)
    // The server accepts explicitly authenticated admin writes with a custom
    // preflighted header; cookie-only writes still require their CSRF token.
    const fallbackAuthorization = admin ? getAdminAuthorization() : null
    const csrfToken = admin && unsafe && !fallbackAuthorization ? await fetchCsrfToken() : null
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        ...(fallbackAuthorization ? { Authorization: fallbackAuthorization } : {}),
        ...(fallbackAuthorization && unsafe ? { 'X-Admin-Request': '1' } : {}),
        ...options?.headers,
      },
      signal: controller.signal,
      credentials: admin ? 'include' : 'omit',
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
        throw new Error('Could not connect to the booking service. It may be starting up. Please wait a moment and refresh.', { cause: error })
      }
    }
    throw failure
  } finally {
    clearTimeout(timeout)
  }
}

export function checkAdminAccess() {
  // Authentication does not need to download private booking details.
  return request<void>(ADMIN_AUTH_URL, undefined, true, 150000)
}

export type DashboardSummary = {
  total: number
  pending: number
  today: number
  upcoming: Booking[]
  started?: Booking[]
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

export type BookingFilters = { sort?: string; status?: string; from?: string; to?: string; search?: string }

export function getBookingPage(page: number, size = 25, filters: BookingFilters = {}) {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.status) params.set('status', filters.status)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.search?.trim()) params.set('search', filters.search.trim())
  return request<BookingPage>(`${BOOKING_URL}/page?${params.toString()}`, undefined, true)
}

export function lookupPublicBooking(bookingReference: string, email: string) {
  return request<PublicBookingView>(`${BOOKING_URL}/public-lookup`, {
    method: 'POST',
    body: JSON.stringify({ bookingReference, email }),
  })
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


export type BookingEmailStatus = {
  id: string
  bookingId: number
  eventType: string
  status: string
  recipientRole: string
  attempts: number
  createdAt: string
  nextAttemptAt: string | null
  expiresAt: string | null
  lastError: string | null
  providerAccepted: boolean
}

export function getBookingEmailStatuses(id: number) {
  return request<BookingEmailStatus[]>(`${BOOKING_URL}/${id}/email-status`, undefined, true)
}

export function submitBookingManagementRequest(data: BookingManagementRequestSubmission, idempotencyKey: string) {
  return request<{ message: string }>(`${BOOKING_URL}/management-requests`, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(data),
  })
}

export function getBookingManagementRequests(status = 'ALL') {
  const params = new URLSearchParams({ status })
  return request<BookingManagementRequest[]>(`${BOOKING_URL}/management-requests?${params.toString()}`, undefined, true)
}

export function updateBookingManagementRequest(id: number, status: BookingManagementRequest['status'], adminNote: string) {
  return request<BookingManagementRequest>(`${BOOKING_URL}/management-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, adminNote }),
  }, true)
}

export function cancelBookingFromManagementRequest(id: number, adminNote: string) {
  return request<BookingManagementRequest>(`${BOOKING_URL}/management-requests/${id}/cancel-booking`, {
    method: 'POST',
    body: JSON.stringify({ adminNote }),
  }, true)
}

export type DispatchRow = {
  id: number; leg: string; local_pickup: string; customer_name: string; origin: string; destination: string
  status: string; priority: number; driver: string | null; phone: string | null; plate: string | null
  capacity: number | null; stage: string; revision: number; reviewed_at: string | null; assigned_at: string | null; last_request: string | null; verified_at: string | null; reviewed_priority: number | null; available_local: string | null
}
export const dispatchQueue = (params: string) => request<{ rows: DispatchRow[]; total: number }>(`${BOOKING_URL}/dispatch?${params}`, undefined, true)
export const dispatchCounts = () => request<Record<string, number>>(`${BOOKING_URL}/dispatch/counts`, undefined, true)
export const dispatchDetails = (id: number) => request<DispatchRow[]>(`${BOOKING_URL}/dispatch/${id}`, undefined, true)
export const updateDispatch = (row: DispatchRow, values: Record<string, unknown>) =>
  request<{warning: string}>(`${BOOKING_URL}/dispatch/${row.id}/${row.leg}`, {
    method: 'PUT', body: JSON.stringify({ ...values, revision: row.revision }),
  }, true)

export const dispatchHistory = (id: number) => request<{leg:string; description:string; occurred_at:string}[]>(`${BOOKING_URL}/dispatch/${id}/history`, undefined, true)
