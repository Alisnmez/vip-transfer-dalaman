import { request } from '../booking/api'

const REVIEW_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/reviews`

export type PublicReview = {
  id: number
  name: string
  rating: number
  comment: string
}

export type PendingReview = {
  id: number
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

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

export function getPendingReviews() {
  return request<PendingReview[]>(`${REVIEW_URL}/moderation`, undefined, true)
}

export function moderateReview(id: number, status: 'APPROVED' | 'REJECTED') {
  return request<{ status: string }>(`${REVIEW_URL}/${id}/moderation`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, true)
}
