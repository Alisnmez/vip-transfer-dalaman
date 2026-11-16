import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'
import { useLayoutEffect } from 'react'

import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { BookingDetailPage } from '../pages/admin/BookingDetailPage'
import { BookingListPage } from '../pages/admin/BookingListPage'
import { CalendarPage } from '../pages/admin/CalendarPage'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { AnalyticsPage } from '../pages/admin/AnalyticsPage'
import { DispatchHubPage } from '../pages/admin/DispatchHubPage'
import { FleetManagementPage } from '../pages/admin/FleetManagementPage'
import { RoutePricePage } from '../pages/admin/RoutePricePage'
import { BookingConfirmationPage } from '../pages/public/BookingConfirmationPage'
import { BookingFormPage } from '../pages/public/BookingFormPage'
import { BookingPassengerPage } from '../pages/public/BookingPassengerPage'
import { BookingLookupPage } from '../pages/public/BookingLookupPage'
import { BookingDbCheckPage } from '../pages/public/BookingDbCheckPage'
import { HomePage } from '../pages/public/HomePage'
import { RoutesPage } from '../pages/public/RoutesPage'
import {
  ContactPage,
  ServicesPage,
  VehiclesPage,
} from '../pages/public/InfoPages'

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

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
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'booking', element: <BookingFormPage /> },
      { path: 'booking/passenger', element: <BookingPassengerPage /> },
      { path: 'booking/confirmation', element: <BookingConfirmationPage /> },
      { path: 'booking/lookup', element: <BookingLookupPage /> },
      { path: 'test/db-check', element: <BookingDbCheckPage /> },
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
      { path: 'fleet-management', element: <FleetManagementPage /> },
      { path: 'route-prices', element: <RoutePricePage /> },
      { path: 'dispatch-hub', element: <DispatchHubPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
