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
      'The booking service did not respond within 60 seconds. Your request may have been received. Please contact support if you are unsure.',
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
  // A server error may occur after the database commit; keep the retry key for 5xx.
  return new BookingApiError(message, status, status >= 500)
}

/** A successful HTTP response with unreadable booking data may still represent a committed booking. */
export function bookingInvalidSuccessResponse(cause?: unknown): BookingApiError {
  return new BookingApiError(
    'The booking service responded, but its booking reference could not be verified. Your request may have been saved. Please contact support before starting a new booking.',
    null, true, { cause },
  )
}
