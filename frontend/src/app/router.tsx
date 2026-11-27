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
const BookingManagementRequestsPage = lazy(() => import('../pages/admin/BookingManagementRequestsPage').then((module) => ({ default: module.BookingManagementRequestsPage })))
// eslint-disable-next-line react-refresh/only-export-components
const RoutePricePage = lazy(() => import('../pages/admin/RoutePricePage').then((module) => ({ default: module.RoutePricePage })))
// eslint-disable-next-line react-refresh/only-export-components
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage').then((module) => ({ default: module.DashboardPage })))
import { BookingConfirmationPage } from '../pages/public/BookingConfirmationPage'
import { BookingFormPage } from '../pages/public/BookingFormPage'
import { BookingPassengerPage } from '../pages/public/BookingPassengerPage'
import { BookingLookupPage } from '../pages/public/BookingLookupPage'
import { BookingPolicyPage } from '../pages/public/BookingPolicyPage'
import { TravelGuidePage } from '../pages/public/TravelGuidePage'
import { travelGuides } from '../content/guides'

// Router-local layout helpers are not exported; keeping them here avoids unnecessary files.
// eslint-disable-next-line react-refresh/only-export-components
function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    trackPublicPage(pathname)
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
    path: `${language}/routes/${slug}`, lazy: async () => ({ Component: (await import('../pages/public/RouteDetailPage')).RouteDetailPage }),
  })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicPageLayout />,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('../pages/public/HomePage')).HomePage }) },
      { path: 'routes', lazy: async () => ({ Component: (await import('../pages/public/RoutesPage')).RoutesPage }) },
      { path: 'routes/:slug', lazy: async () => ({ Component: (await import('../pages/public/RouteDetailPage')).RouteDetailPage }) },
      { path: 'guides', lazy: async () => ({ Component: (await import('../pages/public/GuidesIndexPage')).GuidesIndexPage }) },
      ...travelGuides.map(guide => ({ path: guide.path.slice(1), element: <TravelGuidePage guide={guide} /> })),
      ...translatedRoutes,
      { path: 'vehicles', lazy: async () => ({ Component: (await import('../pages/public/InfoPages')).VehiclesPage }) },
      { path: 'services', lazy: async () => ({ Component: (await import('../pages/public/InfoPages')).ServicesPage }) },
      { path: 'contact', lazy: async () => ({ Component: (await import('../pages/public/InfoPages')).ContactPage }) },
      { path: 'faq', lazy: async () => ({ Component: (await import('../pages/public/InfoPages')).FAQPage }) },
      { path: 'reviews', lazy: async () => ({ Component: (await import('../pages/public/ReviewsPage')).ReviewsPage }) },
      { path: 'booking', element: <BookingFormPage /> },
      { path: 'booking/passenger', element: <BookingPassengerPage /> },
      { path: 'booking/confirmation', element: <BookingConfirmationPage /> },
      { path: 'booking/lookup', element: <BookingLookupPage /> },
      { path: 'booking-policy', element: <BookingPolicyPage /> },
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
      { path: 'management-requests', element: <Suspense fallback={<div role="status">Loading...</div>}><BookingManagementRequestsPage /></Suspense> },
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
