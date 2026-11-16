import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getBookings } from '../../features/booking/api'
import type { Booking } from '../../features/booking/types'

const tableHeaders = [
  'ID',
  'Customer Name',
  'Route',
  'Date/Time',
  'Vehicle',
  'Price',
  'Driver',
  'Status',
  'Actions',
]

export function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleBookings = bookings.filter((booking) =>
    `${booking.id} ${booking.customerName} ${booking.pickUpLocation} ${booking.dropOffLocation}`
      .toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div className="h-full flex flex-col overflow-hidden bg-surface">
      <header className="h-20 flex items-center justify-between px-gutter border-b border-outline-variant bg-white">
        <div className="flex flex-col">
          <h2 className="font-title-md text-title-md text-on-surface">
            Booking Management
          </h2>
          <p className="text-on-surface-variant text-[12px]">
            Showing {visibleBookings.length} booking requests
          </p>
        </div>

      </header>

      <section className="p-gutter flex flex-col gap-stack-md bg-white border-b border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-stack-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            <input
              className="w-full bg-white border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md"
              placeholder="Search ID, Customer, Route..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
            />
          </div>

        </div>

        <p className="text-label-sm text-on-surface-variant">{visibleBookings.length} requests found</p>
      </section>

      <section className="flex-1 overflow-auto custom-scrollbar">
        {loading && (
          <div className="p-gutter text-on-surface-variant">Bookings loading...</div>
        )}
        {error && (
          <div className="p-gutter text-error">
            Backend error: {error}
          </div>
        )}
        {!loading && !error && visibleBookings.length === 0 && (
          <div className="p-gutter text-on-surface-variant">
            No bookings found.
          </div>
        )}
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 bg-[#F1F5F9] z-10">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  className={`p-stack-md font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider border-b border-outline-variant ${
                    header === 'Actions' ? 'text-right' : ''
                  }`}
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#1F2937]">
            {visibleBookings.map((booking) => (
              <tr
                className="zebra-row hover:bg-blue-50 transition-colors group cursor-pointer border-b border-outline-variant/30 border-l-4 border-l-transparent hover:border-l-primary"
                key={booking.id}
              >
                <td className="p-stack-md font-data-tabular text-data-tabular text-primary font-bold">
                  #{booking.id}
                </td>
                <td className="p-stack-md">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">
                      {booking.customerName}
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {booking.passengerCount} passenger
                    </span>
                  </div>
                </td>
                <td className="p-stack-md">
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface font-medium">
                      {booking.pickUpLocation}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      east
                    </span>
                    <span className="text-on-surface font-medium">
                      {booking.dropOffLocation}
                    </span>
                  </div>
                </td>
                <td className="p-stack-md">
                  <div className="flex flex-col">
                    <span className="text-on-surface">
                      {new Date(booking.transferDateTime).toLocaleDateString()}
                    </span>
                    <span className="text-on-surface font-bold">
                      {new Date(booking.transferDateTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </td>
                <td className="p-stack-md">
                  <span className="text-on-surface">VIP Transfer</span>
                </td>
                <td className="p-stack-md">
                  <span className="font-data-tabular text-on-surface font-bold">
                    £{Number(booking.price).toFixed(2)}
                  </span>
                </td>
                <td className="p-stack-md">
                  <span className="text-on-surface-variant">Not assigned</span>
                </td>
                <td className="p-stack-md">
                  <div>
                    <span className="status-pill bg-amber-100 text-amber-700">
                      Pending
                    </span>
                  </div>
                </td>
                <td className="p-stack-md text-right">
                  <Link className="text-admin-primary underline underline-offset-4" to={`/admin/bookings/${booking.id}`}>View details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="border-t border-outline-variant bg-white px-gutter py-4 text-sm text-on-surface-variant">
        Showing {visibleBookings.length} of {bookings.length} booking requests. Times are shown in your browser's timezone.
      </footer>
    </div>
  )
}
