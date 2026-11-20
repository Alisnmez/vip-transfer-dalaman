export function isReviewTestHost() {
  return window.location.hostname === 'vip-transfer-dalaman-test.onrender.com'
}

export function isReviewDemoPreview(search: string) {
  const requested = new URLSearchParams(search).get('demo-reviews')
  return requested === '1' || (isReviewTestHost() && requested !== '0')
}
