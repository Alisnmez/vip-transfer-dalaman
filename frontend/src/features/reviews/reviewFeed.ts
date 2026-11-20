import { getPublishedReviews } from './api'

export function loadReviewPage(page: number, demo: boolean) {
  return demo
    ? import('./classroomReviews').then(({ getClassroomReviews }) => getClassroomReviews(page))
    : getPublishedReviews(page)
}
