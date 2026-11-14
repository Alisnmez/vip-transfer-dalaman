import { useEffect, useState } from 'react'

import { getBookings } from '../../features/booking/api'
import type { Booking } from '../../features/booking/types'

const mockBookings = [
  {
    id: '#ATH-8842',
    customer: 'Alexander Sterling',
    note: 'VIP Guest • +44 7700 900341',
    from: 'DLM',
    to: 'Fethiye Marina',
    date: 'Oct 24, 2024',
    time: '14:30',
    vehicle: 'Mercedes V-Class VIP',
    price: '€145.00',
    driver: 'Ahmet Y.',
    driverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFnOvVfrp3kr2xQUx4sfBBm3_r--lyfhXSPerB0x859NR7XAhDo8ybpxlg3-VHO8T-ts9J6acjD73o6LzYg1byWyy4kOHNYu2zz0yMHw-q3iLEB5nYtdfJEDiV3cWY4nQ3rCCRLFnT-1FJNI5q-yry-fhOQFw-96V1q5aPO3wt7lJUEDfxh0ArTovOmLuyGM-XU2mjhMSueQZ_zOABDRja7w8XwJWUZnEFsqc1kzoRKUif7F09YioGbgjx8-Q7v0A33Zl6h4SLf0w',
    status: 'Confirmed',
    statusClass: 'bg-green-100 text-green-700',
  },
  {
    id: '#ATH-8843',
    customer: 'Sarah Van der Berg',
    note: 'Corporate • Booking.com',
    from: 'DLM',
    to: 'Gocek D-Resort',
    date: 'Oct 24, 2024',
    time: '15:15',
    vehicle: 'BMW 740Le Luxury',
    price: '€110.00',
    driver: null,
    driverImage: null,
    status: 'Pending',
    statusClass: 'bg-amber-100 text-amber-700',
  },
  {
    id: '#ATH-8844',
    customer: 'Gregory Peck',
    note: 'VIP Guest • Priority 1',
    from: 'Kalkan',
    to: 'DLM',
    date: 'Oct 24, 2024',
    time: '16:00',
    vehicle: 'Mercedes V-Class VIP',
    price: '€210.00',
    driver: 'Mehmet S.',
    driverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApZu2ABhKC9jMrsXGwRNcYMCdUQjmikpfLOacat5te8TYth2ZuecbWvhqLHZdMpoRh3BvvOhbM4tbtHB_bym3MDknWk2SY5bM1EBCOdTZo9AGtPbz5V8ObwyQxC3jRQCL7maxqmpFM3m2_3uS_4aLM-9uB3xgzFwldNq4W0lffehcj-XTz6VSntzHuGpUXaCAO4TV_E_4l6SDEVKGSTehJLvYg6USRkG4IBNA9mVOd-AiHRQ3E2WUiweQmpMcJ-gD4_wnfU8njz0E',
    status: 'In Progress',
    statusClass: 'bg-blue-100 text-blue-700',
    liveTracker: true,
  },
  {
    id: '#ATH-8845',
    customer: 'Julianne Moore',
    note: 'Individual • Last Minute',
    from: 'DLM',
    to: 'Oludeniz Liberty',
    date: 'Oct 24, 2024',
    time: '17:45',
    vehicle: 'Mercedes Sprinter VIP',
    price: '€180.00',
    driver: 'Caner T.',
    driverImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA84Oklg7f5ikqbCzGRzOS_G76wbeqO8sVazmBRopWuM-DwHFCThsNSKqx0FNu0H1zBo1EtSfC8P9ZM1uMWBlkUNtjkYYyu8gHrXaUeKNSTAzbQXOoVxBqqz7gPd9dAnZsbZDf5kWTvx_PFtcSXitw4HM39DO4_kesrf17ZbOJMF95tLl9Sa3IsKyC_RUfiHg3_jAURCfdbcObdLHLxzyRCpqCfAotIOK5r2Ld-0v1v7LPZb7QDYe58Gii7IbSNPmtQE8aOi0j6kKE',
    status: 'Payment Failed',
    statusClass: 'bg-red-100 text-red-700',
  },
]

void mockBookings

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

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const visibleBookings = bookings.length > 0 ? bookings : []

  return (
    <div className="h-full flex flex-col overflow-hidden bg-surface">
      <header className="h-20 flex items-center justify-between px-gutter border-b border-outline-variant bg-white">
        <div className="flex flex-col">
          <h2 className="font-title-md text-title-md text-on-surface">
            Booking Management
          </h2>
          <p className="text-on-surface-variant text-[12px]">
            Viewing {visibleBookings.length} active transfers for Dalaman International
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary cursor-pointer transition-colors">
              notifications
            </span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[10px] flex items-center justify-center rounded-full font-bold">
              3
            </span>
          </div>
          <div className="h-8 w-px bg-outline-variant" />
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">cloud_download</span>
            <span className="font-label-sm text-label-sm">Export CSV</span>
          </button>
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
              placeholder="Search ID, Customer..."
              type="text"
            />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              calendar_month
            </span>
            <input
              className="w-full bg-white border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md"
              placeholder="Select Date Range"
              type="text"
            />
          </div>
          <select className="bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all font-body-md text-body-md">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <select className="bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all font-body-md text-body-md">
            <option>All Drivers</option>
            <option>Ahmet Y.</option>
            <option>Mehmet S.</option>
            <option>Caner T.</option>
          </select>
          <select className="bg-white border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all font-body-md text-body-md">
            <option>All Vehicles</option>
            <option>Mercedes S-Class</option>
            <option>Mercedes V-Class (VIP Vito)</option>
            <option>BMW 7 Series</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="bg-white border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-label-sm font-label-sm hover:border-primary transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                check_box
              </span>
              Select All
            </button>
            <button className="bg-white border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-label-sm font-label-sm hover:text-error hover:border-error transition-all flex items-center gap-2 opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Bulk Cancel
            </button>
            <button className="bg-white border border-outline-variant text-on-surface px-4 py-2 rounded-lg text-label-sm font-label-sm hover:border-primary transition-all flex items-center gap-2 opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-[18px]">
                assignment_ind
              </span>
              Bulk Assign
            </button>
          </div>
          <p className="text-label-sm font-label-sm text-on-surface-variant">
            {visibleBookings.length} transfers found
          </p>
        </div>
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
                    €{Number(booking.price).toFixed(2)}
                  </span>
                </td>
                <td className="p-stack-md">
                  <button className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 px-3 py-1 rounded-md text-[11px] font-bold hover:bg-blue-600 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[14px]">
                      person_add
                    </span>
                    ASSIGN DRIVER
                  </button>
                </td>
                <td className="p-stack-md">
                  <div>
                    <span className="status-pill bg-amber-100 text-amber-700">
                      Pending
                    </span>
                  </div>
                </td>
                <td className="p-stack-md text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 hover:bg-primary-container/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        visibility
                      </span>
                    </button>
                    <button
                      className="p-2 hover:bg-primary-container/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                      title="Reassign"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        sync_alt
                      </span>
                    </button>
                    <button
                      className="p-2 hover:bg-error-container rounded-lg text-on-surface-variant hover:text-error transition-colors"
                      title="Cancel"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="h-16 flex items-center justify-between px-gutter border-t border-outline-variant bg-white">
        <div className="flex items-center gap-stack-md">
          <span className="text-label-sm font-label-sm text-on-surface-variant">
            Showing 1-10 of 48
          </span>
          <div className="flex items-center gap-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant">
              Rows per page:
            </span>
            <select className="bg-white border border-outline-variant text-[11px] rounded px-2 py-1 text-on-surface outline-none">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded hover:bg-surface-variant text-on-surface-variant disabled:opacity-30"
            disabled
          >
            <span className="material-symbols-outlined text-[20px]">
              first_page
            </span>
          </button>
          <button
            className="p-2 rounded hover:bg-surface-variant text-on-surface-variant disabled:opacity-30"
            disabled
          >
            <span className="material-symbols-outlined text-[20px]">
              chevron_left
            </span>
          </button>
          <div className="flex items-center gap-1 mx-2">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-bold text-label-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-variant text-on-surface text-label-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-variant text-on-surface text-label-sm">
              3
            </button>
            <span className="px-1 text-on-surface-variant">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-variant text-on-surface text-label-sm">
              5
            </button>
          </div>
          <button className="p-2 rounded hover:bg-surface-variant text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">
              chevron_right
            </span>
          </button>
          <button className="p-2 rounded hover:bg-surface-variant text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">
              last_page
            </span>
          </button>
        </div>
      </footer>
    </div>
  )
}
