/**
 * Minimal privacy-first GA4 integration.
 * Analytics stays disabled until the visitor explicitly opts in.
 * Events are allowlisted: no booking IDs, customer details, routes or free text.
 */
export type AnalyticsEvent = 'booking_started' | 'booking_passenger_step' | 'booking_request_submitted'
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID ?? ''
const validId = /^G-[A-Z0-9]+$/.test(measurementId)
const consentKey = 'vip-analytics-consent'
let initialized = false

export function analyticsConsent(): boolean {
  try { return localStorage.getItem(consentKey) === 'granted' } catch { return false }
}

export function initializeAnalytics(): void {
  if (initialized || !validId || !analyticsConsent()) return
  initialized = true
  const analyticsWindow = window as AnalyticsWindow
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? []
  analyticsWindow.gtag = function () { analyticsWindow.dataLayer?.push(arguments) }
  analyticsWindow.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  analyticsWindow.gtag('js', new Date())
  analyticsWindow.gtag('config', measurementId, { send_page_view: false, anonymize_ip: true })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export function setAnalyticsConsent(allowed: boolean): void {
  try { localStorage.setItem(consentKey, allowed ? 'granted' : 'denied') } catch { /* Analytics remains optional. */ }
  if (!validId) return
  const disableKey = `ga-disable-${measurementId}`
  Reflect.set(window, disableKey, !allowed)
  if (initialized) (window as AnalyticsWindow).gtag?.('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' })
  if (allowed) {
    initializeAnalytics()
    return
  }
  const host = window.location?.hostname ?? ''
  const domains = host.split('.').map((_, index, parts) => parts.slice(index).join('.'))
  for (const item of (document.cookie ?? '').split(';')) {
    const name = item.split('=')[0].trim()
    if (name !== '_ga' && name !== `_ga_${measurementId.slice(2)}`) continue
    const expired = `${name}=; Max-Age=0; Path=/`
    document.cookie = expired
    for (const domain of domains) {
      if (domain.includes('.')) document.cookie = `${expired}; Domain=${domain}`
    }
  }
}

export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  if (!analyticsConsent() || !validId) return
  initializeAnalytics()
  ;(window as AnalyticsWindow).gtag?.('event', event)
}

export function trackPublicPage(pathname: string): void {
  if (!analyticsConsent() || !validId) return
  const allowed = ['/', '/routes', '/vehicles', '/services', '/contact']
  if (!allowed.includes(pathname) && !/^\/routes\/(marmaris|fethiye|oludeniz|gocek|icmeler|dalyan|sarigerme)$/.test(pathname)) return
  initializeAnalytics()
  ;(window as AnalyticsWindow).gtag?.('event', 'page_view', { page_path: pathname })
}
