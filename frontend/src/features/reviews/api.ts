import { request } from '../booking/api'
import { BookingApiError } from '../booking/api/errors'

const REVIEW_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/reviews`

export type PublicReview = {
  id: number
  name: string
  rating: number
  comment: string
  createdAt?: string
}

export type PendingReview = {
  id: number
  customerName: string
  rating: number
  comment: string
  createdAt: string
  status: ReviewStatus
}

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'

export type ReviewSubmission = {
  name: string
  rating: number
  comment: string
  publicationConsent: boolean
}

export function getPublishedReviews() {
  return request<PublicReview[]>(REVIEW_URL)
}

export function submitReview(review: ReviewSubmission) {
  return request<{ message: string }>(REVIEW_URL, {
    method: 'POST',
    body: JSON.stringify(review),
  })
}

export function getPendingReviews(status: ReviewStatus = 'PENDING') {
  return request<PendingReview[]>(`${REVIEW_URL}/moderation?status=${encodeURIComponent(status)}`, undefined, true)
}

export function moderateReview(id: number, status: 'APPROVED' | 'REJECTED' | 'ARCHIVED') {
  return request<{ status: string }>(`${REVIEW_URL}/${id}/moderation`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, true)
}

export function reviewErrorMessage(error: unknown, action: 'load' | 'submit' | 'moderate'): string {
  if (error instanceof BookingApiError) {
    if (error.status === 401 || error.status === 403) return 'Your admin session is not authorized. Please sign in again.'
    if (error.status === 409) return 'The review status changed. Refresh to see the latest status.'
    if (error.status === 429) return 'Too many requests. Please wait and try again.'
    if (error.status === 400 || error.status === 422) return 'Review details are invalid. Please check the form.'
  }
  return action === 'load' ? 'Unable to load reviews. Please retry.'
    : action === 'submit' ? 'Unable to submit your review. Please try again later.'
    : 'Unable to update the review. Refresh and try again.'
}
