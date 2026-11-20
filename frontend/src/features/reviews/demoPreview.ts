export function isReviewTestHost() {
  return window.location.hostname === 'vip-transfer-dalaman-test.onrender.com'
}

export function isReviewDemoPreview(search: string) {
  if (!isReviewTestHost()) return false
  const requested = new URLSearchParams(search).get('demo-reviews')
  return requested !== '0'
}
