import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'

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
import { RouteDetailPage } from '../pages/public/RouteDetailPage'
import {
  ContactPage,
  ServicesPage,
  VehiclesPage,
} from '../pages/public/InfoPages'

// Router-local layout helpers are not exported; keeping them here avoids unnecessary files.
// eslint-disable-next-line react-refresh/only-export-components
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    const site = (import.meta.env.VITE_PUBLIC_SITE_URL ?? '').trim().replace(/\/$/, '')
    const production = /^https:\/\/[a-z0-9.-]+$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
    const publicPaths = ['/', '/routes', '/vehicles', '/services', '/contact']
    const indexable = publicPaths.includes(pathname) || /^\/routes\/(marmaris|fethiye|oludeniz|gocek|icmeler)$/.test(pathname)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = production && indexable ? 'index,follow' : 'noindex,nofollow'
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
  return <><ScrollToTop /><PublicLayout /></>
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
