export function isReviewTestHost() {
  return window.location.hostname === 'vip-transfer-dalaman-test.onrender.com'
}

export function isReviewDemoPreview(search: string) {
  return isReviewTestHost() && new URLSearchParams(search).get('demo-reviews') !== '0'
}
