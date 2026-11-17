export class BookingApiError extends Error {
  readonly status: number | null
  readonly uncertain: boolean

  constructor(message: string, status: number | null, uncertain: boolean, options?: ErrorOptions) {
    super(message, options)
    this.name = 'BookingApiError'
    this.status = status
    this.uncertain = uncertain
  }
}

/** A timeout or transport failure cannot tell us whether the server committed a booking. */
export function classifyBookingFailure(error: unknown): BookingApiError {
  if (error instanceof BookingApiError) return error
  if (error instanceof Error && error.name === 'AbortError') {
    return new BookingApiError(
      'The booking service did not respond before the timeout. Your request may have been received. Please contact support if you are unsure.',
      null, true, { cause: error },
    )
  }
  if (error instanceof TypeError) {
    return new BookingApiError(
      'Unable to reach the booking service. Your request may have been received. Please check your connection before retrying.',
      null, true, { cause: error },
    )
  }
  return new BookingApiError(
    error instanceof Error ? error.message : 'Booking request failed.',
    null, false, { cause: error },
  )
}

export function bookingHttpError(status: number, serverMessage?: unknown): BookingApiError {
  const message = typeof serverMessage === 'string' && serverMessage.trim()
    ? serverMessage
    : `Booking service returned HTTP ${status}. Please contact support if this continues.`
  // A timeout (408) or server failure (5xx) may happen after the booking was saved.
  // Keep the idempotency key so a retry cannot create a second booking.
  return new BookingApiError(message, status, status === 408 || status >= 500)
}

/** A successful HTTP response with unreadable booking data may still represent a committed booking. */
export function bookingInvalidSuccessResponse(cause?: unknown): BookingApiError {
  return new BookingApiError(
    'The booking service responded, but its booking reference could not be verified. Your request may have been saved. Please contact support before starting a new booking.',
    null, true, { cause },
  )
}

/** Convert API failures into safe, actionable messages for booking screens. */
export function bookingErrorMessage(error: unknown, action: 'status' | 'edit' | 'create' | 'read' = 'create'): string {
  if (error instanceof BookingApiError) {
    if (error.status === 409) {
      if (action === 'status') return 'This status change is not allowed for the current status of this booking. Refresh the booking to check its latest status.'
      if (action === 'edit') return 'This booking has changed or the edit is not allowed. Refresh the booking and try again.'
      if (action === 'read') return 'Booking data has changed. Refresh to load the latest information.'
      return 'This booking request conflicts with an existing request. Please check your details or contact support.'
    }
    if (error.status === 401 || error.status === 403) return 'Your session is not authorized. Please sign in again.'
    if (error.status === 429) return 'Too many requests. Please wait a moment before trying again.'
    if (error.status === null && action === 'read') return 'Could not load bookings. Check your connection and try again.'
    if (error.status === null && action !== 'create') return 'Connection failed. Your changes may have been saved. Refresh to verify before trying again.'
    if (error.status !== null && error.status >= 500) return 'The booking service is temporarily unavailable. Please try again later.'
    return error.message
  }
  return action === 'status' ? 'Could not update booking status.'
    : action === 'edit' ? 'Could not save booking details.'
    : action === 'read' ? 'Could not load bookings. Please try again.'
    : error instanceof Error ? error.message : 'Booking could not be created.'
}
