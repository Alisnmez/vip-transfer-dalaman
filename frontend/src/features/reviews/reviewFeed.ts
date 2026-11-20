import { getPublishedReviews } from './api'
import { getClassroomReviews } from './classroomReviews'

export function loadReviewPage(page: number, demo = false) {
  return demo ? Promise.resolve(getClassroomReviews(page)) : getPublishedReviews(page)
}
