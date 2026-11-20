import { getPublishedReviews } from './api'

export function loadReviewPage(page: number) {
  return getPublishedReviews(page)
}
