import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { ProcessingButton } from '../../components/ProcessingButton'
import { adminBookingStatusLabel, formatBookingReceivedAt, formatTransferDateTime } from '../../features/booking/formatters'
import { BookingStatusIndicators } from '../../features/booking/components/BookingStatusIndicators'
import { LiveBookingBadge } from '../../features/booking/components/LiveBookingBadge'
import { useBookingClock } from '../../features/booking/useBookingClock'
import { useBookingPage } from '../../features/booking/useBookingPage'

export function BookingListPage() {
  const nowMs = useBookingClock()
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  useEffect(() => {
    const timeout = window.setTimeout(() => setSearchTerm(search.trim()), 350)
    return () => window.clearTimeout(timeout)
  }, [search])
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const { bookings, totalPages, totalElements, page, loading, refreshing, error, lastUpdatedAt, refresh, changePage, resetPage } = useBookingPage({ status: statusFilter === 'all' ? undefined : statusFilter, from: dateFrom, to: dateTo, search: searchTerm })

  const visibleBookings = loading || error ? [] : bookings

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-surface">
      <header className="border-b border-outline-variant bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-admin-primary">Booking management</h1>
            <p className="text-on-surface-variant">{visibleBookings.length} shown · {totalElements} total requests</p>
          </div>
          {lastUpdatedAt !== null && <span className="text-xs text-on-surface-variant">Last updated: {new Date(lastUpdatedAt).toLocaleTimeString()}</span>}
          <Link to="/admin/calendar" className="rounded-lg bg-admin-primary px-4 py-2 font-semibold text-white">Calendar</Link>
          <ProcessingButton type="button" onClick={() => { void refresh() }} processing={loading || refreshing} processingLabel="Refreshing..."
            className="rounded-lg border border-outline-variant bg-white px-4 py-2 font-semibold disabled:opacity-50">
            Refresh bookings
          </ProcessingButton>
        </div>
      </header>

      <section className="border-b border-outline-variant bg-white p-6">
        <label className="block max-w-lg text-sm font-semibold">
          Search all bookings
          <input type="search" value={search} onChange={event => { setSearch(event.target.value); resetPage() }}
            placeholder="Customer, route or booking ID"
            className="mt-2 w-full rounded-lg border border-outline-variant px-4 py-3" />
        </label>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm font-semibold">Status
            <select aria-label="Status" value={statusFilter} onChange={event => { setStatusFilter(event.target.value); resetPage() }} className="mt-2 block rounded-lg border border-outline-variant bg-white px-3 py-3">
              <option value="all">All statuses</option>
              {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(status => <option key={status} value={status}>{adminBookingStatusLabel(status)}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Transfer date from (Turkey)
            <input type="date" value={dateFrom} onChange={event => { setDateFrom(event.target.value); resetPage() }} className="mt-2 block rounded-lg border border-outline-variant px-3 py-3" />
          </label>
          <label className="text-sm font-semibold">Transfer date to (Turkey)
            <input type="date" value={dateTo} min={dateFrom || undefined} onChange={event => { setDateTo(event.target.value); resetPage() }} className="mt-2 block rounded-lg border border-outline-variant px-3 py-3" />
          </label>
          <button type="button" onClick={() => { setSearch(""); setStatusFilter("all"); setDateFrom(""); setDateTo(""); resetPage() }} className="rounded-lg border border-outline-variant px-4 py-3 text-sm font-semibold">Clear filters</button>
        </div>
        <p className="mt-2 text-xs text-on-surface-variant">Search, status and transfer date filters apply across all bookings.</p>
      </section>
      <section className="min-w-0 flex-1 p-4 sm:overflow-auto sm:p-6">
        {loading && <p>Loading booking requests...</p>}
        {error && <div role="alert" className="space-y-3 text-error"><p>Unable to load bookings: {error}</p><ProcessingButton type="button" onClick={refresh} processing={loading} processingLabel="Retrying..." className="rounded-lg border px-4 py-2 font-semibold disabled:opacity-50">Try again</ProcessingButton></div>}
        {!loading && !error && visibleBookings.length === 0 && <p>No booking requests found.</p>}
        {!loading && !error && visibleBookings.length > 0 && (
          <><div className="space-y-3 md:hidden">{visibleBookings.map(booking => (
            <article key={booking.id} className="min-w-0 rounded-xl border border-outline-variant bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><LiveBookingBadge status={booking.status} transferDateTime={booking.transferDateTime} nowMs={nowMs} /><p className="text-xs text-on-surface-variant">Booking #{booking.id}</p><h2 className="break-words font-bold">{booking.customerName}</h2></div><BookingStatusIndicators status={booking.status} transferDateTime={undefined} nowMs={nowMs} /></div>
              <p className="mt-3 break-words text-sm">{booking.pickUpLocation} → {booking.dropOffLocation}</p>
              <p className="mt-2 text-sm text-on-surface-variant">{formatTransferDateTime(booking.transferDateTime)} · {booking.passengerCount} passengers</p>
              <p className="mt-1 text-xs text-on-surface-variant">Received: {formatBookingReceivedAt(booking.createdAt)}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-outline-variant pt-3"><strong>£{Number(booking.price).toFixed(2)}</strong><Link className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-semibold text-white" to={`/admin/bookings/${booking.id}`}>View details</Link></div>
            </article>
          ))}</div><div className="hidden max-w-full overflow-x-auto md:block"><table className="w-full min-w-[760px] border-collapse bg-white text-left">
            <thead>
              <tr className="border-b border-outline-variant">
                {['ID', 'Customer', 'Route', 'Transfer time (Turkey)', 'Price (GBP)', 'Status', 'Details'].map(header =>
                  <th key={header} scope="col" className="p-4 text-sm font-semibold">{header}</th>,
                )}
              </tr>
            </thead>
            <tbody>
              {visibleBookings.map(booking => (
                <tr key={booking.id} className="border-b border-outline-variant">
                  <td className="p-4 font-semibold"><div className="flex items-center gap-2"><LiveBookingBadge status={booking.status} transferDateTime={booking.transferDateTime} nowMs={nowMs} />#{booking.id}</div></td>
                  <td className="p-4">
                    <span className="block font-semibold">{booking.customerName}</span>
                    <span className="text-sm text-on-surface-variant">{booking.passengerCount} passengers</span>
                  </td>
                  <td className="p-4">{booking.pickUpLocation} → {booking.dropOffLocation}</td>
                  <td className="p-4">{formatTransferDateTime(booking.transferDateTime)}</td>
                  <td className="p-4 font-semibold">£{Number(booking.price).toFixed(2)}</td>
                  <td className="p-4"><BookingStatusIndicators status={booking.status} transferDateTime={undefined} nowMs={nowMs} /></td>
                  <td className="p-4">
                    <Link className="text-admin-primary underline" to={`/admin/bookings/${booking.id}`}>View details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div></>
        )}
      </section>
      <nav aria-label="Booking pages" className="flex items-center justify-between gap-4 border-t border-outline-variant bg-white p-4">
        <button type="button" disabled={loading || page === 0} onClick={() => changePage(page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button>
        <span className="text-sm">Page {page + 1} of {Math.max(1, totalPages)}</span>
        <button type="button" disabled={loading || page + 1 >= totalPages} onClick={() => changePage(page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button>
      </nav>
    </main>
  )
}
