export function isReviewDemoPreview(search: string) {
  return window.location.hostname === 'vip-transfer-dalaman-test.onrender.com'
    && new URLSearchParams(search).get('demo-reviews') === '1'
}
