import { LanguageProvider } from '../shared/localization/LanguageProvider'
import { localizedRouteCopy, matchLocalizedRoute, routeLanguages } from '../shared/localization/route-locales'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useLayoutEffect } from 'react'
import { trackPublicPage } from '../features/analytics/analytics'
import { AnalyticsConsent } from '../features/analytics/AnalyticsConsent'

import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
// eslint-disable-next-line react-refresh/only-export-components
const CalendarPage = lazy(() => import('../pages/admin/CalendarPage').then((module) => ({ default: module.CalendarPage })))
// eslint-disable-next-line react-refresh/only-export-components
const BookingDetailPage = lazy(() => import('../pages/admin/BookingDetailPage').then((module) => ({ default: module.BookingDetailPage })))
// eslint-disable-next-line react-refresh/only-export-components
const BookingListPage = lazy(() => import('../pages/admin/BookingListPage').then((module) => ({ default: module.BookingListPage })))
// eslint-disable-next-line react-refresh/only-export-components
const ReviewModerationPage = lazy(() => import('../pages/admin/ReviewModerationPage').then((module) => ({ default: module.ReviewModerationPage })))
// eslint-disable-next-line react-refresh/only-export-components
const RoutePricePage = lazy(() => import('../pages/admin/RoutePricePage').then((module) => ({ default: module.RoutePricePage })))
// eslint-disable-next-line react-refresh/only-export-components
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage').then((module) => ({ default: module.DashboardPage })))
import { BookingConfirmationPage } from '../pages/public/BookingConfirmationPage'
import { BookingFormPage } from '../pages/public/BookingFormPage'
import { BookingPassengerPage } from '../pages/public/BookingPassengerPage'
import { BookingLookupPage } from '../pages/public/BookingLookupPage'
import { HomePage } from '../pages/public/HomePage'
import { RoutesPage } from '../pages/public/RoutesPage'
import { ReviewsPage } from '../pages/public/ReviewsPage'
import { RouteDetailPage } from '../pages/public/RouteDetailPage'
import { DalamanMarmarisGuidePage } from '../pages/public/DalamanMarmarisGuidePage'
import {
  ContactPage,
  FAQPage,
  ServicesPage,
  VehiclesPage,
} from '../pages/public/InfoPages'

// Router-local layout helpers are not exported; keeping them here avoids unnecessary files.
// eslint-disable-next-line react-refresh/only-export-components
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    trackPublicPage(pathname)
    if (matchLocalizedRoute(pathname)) return
    const site = (import.meta.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
    const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
    const publicPaths = ['/', '/routes', '/vehicles', '/services', '/contact', '/faq', '/reviews', '/guides/dalaman-airport-to-marmaris']
    const indexable = publicPaths.includes(pathname) || /^\/routes\/(marmaris|fethiye|oludeniz|gocek|icmeler|dalyan|sarigerme)$/.test(pathname)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = production && indexable ? 'index,follow' : 'noindex,nofollow'
    const pageMetadata: Record<string, { title: string; description: string }> = {
      '/': { title: 'Dalaman Airport Transfers | DalamanWay', description: 'Request private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz and nearby destinations.' },
      '/routes': { title: 'Dalaman Airport Transfer Routes | DalamanWay', description: 'Explore Dalaman Airport private transfer routes to Marmaris, Fethiye, Oludeniz, Gocek and Icmeler.' },
      '/vehicles': { title: 'Airport Transfer Vehicles | DalamanWay', description: 'Explore private Dalaman airport transfer vehicle categories for your passengers and luggage.' },
      '/services': { title: 'Private Airport Transfer Services | DalamanWay', description: 'Request airport pickup, hotel transfers and return journeys from Dalaman Airport.' },
      '/contact': { title: 'Contact DalamanWay | Airport Transfer Support', description: 'Contact DalamanWay about transfer bookings, changes and cancellations.' },
      '/faq': { title: 'Dalaman Airport Transfer FAQ | DalamanWay', description: 'Answers to questions about airport transfers, return journeys, flight details and child seats.' },
      '/reviews': { title: 'Customer Reviews | DalamanWay', description: 'Share your experience with DalamanWay and learn how customer feedback is reviewed.' },
      '/guides/dalaman-airport-to-marmaris': { title: 'Dalaman Airport to Marmaris: Bus, Taxi or Private Transfer? | DalamanWay', description: 'Compare practical ways to travel from Dalaman Airport to Marmaris, what to check before you fly, and how to choose for your group.' },
    }
    const destinationNames: Record<string, string> = {
      marmaris: 'Marmaris',
      fethiye: 'Fethiye',
      oludeniz: 'Oludeniz',
      gocek: 'Gocek',
      icmeler: 'Icmeler',
      dalyan: 'Dalyan',
      sarigerme: 'Sarigerme',
    }
    const destinationSlug = /^\/routes\/([a-z]+)$/.exec(pathname)?.[1]
    const destination = destinationSlug ? destinationNames[destinationSlug] : undefined
    const metadata = destination
      ? {
          title: `Dalaman Airport to ${destination} Private Transfer | DalamanWay`,
          description: `Request a private transfer from Dalaman Airport to ${destination}. Compare available vehicle options and plan your journey.`,
        }
      : pageMetadata[pathname]
    document.title = metadata?.title ?? (indexable ? 'Dalaman Airport Private Transfer | DalamanWay' : 'DalamanWay')
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!description) {
      description = document.createElement('meta')
      description.name = 'description'
      document.head.appendChild(description)
    }
    description.content = metadata?.description ?? 'Request and manage private Dalaman Airport transfer bookings.'
    document.querySelector('link[rel="canonical"]')?.remove()
    if (production && indexable) {
      const canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = site + pathname
      document.head.appendChild(canonical)
    }
  }, [pathname])
  return null
}

// eslint-disable-next-line react-refresh/only-export-components
function PublicPageLayout() {
  const { pathname } = useLocation()
  return <LanguageProvider routeLanguage={matchLocalizedRoute(pathname)?.language}><ScrollToTop /><PublicLayout /><AnalyticsConsent /></LanguageProvider>
}

const translatedRoutes = routeLanguages.filter(language => language !== 'en').flatMap(language =>
  Object.keys(localizedRouteCopy).map(slug => ({
    path: `${language}/routes/${slug}`, element: <RouteDetailPage />,
  })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicPageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'routes', element: <RoutesPage /> },
      { path: 'routes/:slug', element: <RouteDetailPage /> },
      { path: 'guides/dalaman-airport-to-marmaris', element: <DalamanMarmarisGuidePage /> },
      ...translatedRoutes,
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'booking', element: <BookingFormPage /> },
      { path: 'booking/passenger', element: <BookingPassengerPage /> },
      { path: 'booking/confirmation', element: <BookingConfirmationPage /> },
      { path: 'booking/lookup', element: <BookingLookupPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Suspense fallback={<div role="status">Loading...</div>}><DashboardPage /></Suspense> },
      { path: 'calendar', element: <Suspense fallback={<div role="status">Loading...</div>}><CalendarPage /></Suspense> },
      { path: 'bookings', element: <Suspense fallback={<div role="status">Loading...</div>}><BookingListPage /></Suspense> },
      { path: 'reviews', element: <Suspense fallback={<div role="status">Loading...</div>}><ReviewModerationPage /></Suspense> },
      { path: 'bookings/:bookingId', element: <Suspense fallback={<div role="status">Loading...</div>}><BookingDetailPage /></Suspense> },
      { path: 'fleet-management', element: <Navigate to="/admin/bookings" replace /> },
      { path: 'route-prices', element: <Suspense fallback={<div role="status">Loading...</div>}><RoutePricePage /></Suspense> },
      { path: 'dispatch-hub', element: <Navigate to="/admin/bookings" replace /> },
      { path: 'analytics', element: <Navigate to="/admin/bookings" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
