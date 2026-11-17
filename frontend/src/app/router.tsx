import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { trackPublicPage } from '../features/analytics/analytics'
import { AnalyticsConsent } from '../features/analytics/AnalyticsConsent'

import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { CalendarPage } from '../pages/admin/CalendarPage'
import { BookingDetailPage } from '../pages/admin/BookingDetailPage'
import { BookingListPage } from '../pages/admin/BookingListPage'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { BookingConfirmationPage } from '../pages/public/BookingConfirmationPage'
import { BookingFormPage } from '../pages/public/BookingFormPage'
import { BookingPassengerPage } from '../pages/public/BookingPassengerPage'
import { BookingLookupPage } from '../pages/public/BookingLookupPage'
import { HomePage } from '../pages/public/HomePage'
import { RoutesPage } from '../pages/public/RoutesPage'
import { ReviewsPage } from '../pages/public/ReviewsPage'
import { RouteDetailPage } from '../pages/public/RouteDetailPage'
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
    const site = (import.meta.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
    const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
    const publicPaths = ['/', '/routes', '/vehicles', '/services', '/contact', '/faq', '/reviews']
    const indexable = publicPaths.includes(pathname) || /^\/routes\/(marmaris|fethiye|oludeniz|gocek|icmeler)$/.test(pathname)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = production && indexable ? 'index,follow' : 'noindex,nofollow'
    const pageMetadata: Record<string, { title: string; description: string }> = {
      '/': { title: 'Dalaman Airport Transfers | VIP Transfer Dalaman', description: 'Request private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz and nearby destinations.' },
      '/routes': { title: 'Dalaman Airport Transfer Routes | VIP Transfer Dalaman', description: 'Explore Dalaman Airport private transfer routes to Marmaris, Fethiye, Oludeniz, Gocek and Icmeler.' },
      '/vehicles': { title: 'Airport Transfer Vehicles | VIP Transfer Dalaman', description: 'Explore private Dalaman airport transfer vehicle categories for your passengers and luggage.' },
      '/services': { title: 'Private Airport Transfer Services | VIP Transfer Dalaman', description: 'Request airport pickup, hotel transfers and return journeys from Dalaman Airport.' },
      '/contact': { title: 'Contact VIP Transfer Dalaman | Airport Transfer Support', description: 'Contact VIP Transfer Dalaman about transfer bookings, changes and cancellations.' },
      '/faq': { title: 'Dalaman Airport Transfer FAQ | VIP Transfer Dalaman', description: 'Answers to questions about airport transfers, return journeys, flight details and child seats.' },
      '/reviews': { title: 'Customer Reviews | VIP Transfer Dalaman', description: 'Share your experience with VIP Transfer Dalaman and learn how customer feedback is reviewed.' },
    }
    const metadata = pageMetadata[pathname]
    document.title = metadata?.title ?? (indexable ? 'Dalaman Airport Private Transfer | VIP Transfer Dalaman' : 'VIP Transfer Dalaman')
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
  return <><ScrollToTop /><PublicLayout /><AnalyticsConsent /></>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicPageLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'routes', element: <RoutesPage /> },
      { path: 'routes/:slug', element: <RouteDetailPage /> },
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
      { index: true, element: <DashboardPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'bookings', element: <BookingListPage /> },
      { path: 'bookings/:bookingId', element: <BookingDetailPage /> },
      { path: 'fleet-management', element: <Navigate to="/admin/bookings" replace /> },
      { path: 'route-prices', element: <Navigate to="/admin/bookings" replace /> },
      { path: 'dispatch-hub', element: <Navigate to="/admin/bookings" replace /> },
      { path: 'analytics', element: <Navigate to="/admin/bookings" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
