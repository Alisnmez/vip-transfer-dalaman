import { useState } from 'react'

const kpiCards = [
  {
    label: "Today's Bookings",
    value: '18',
    valueClass: 'text-admin-primary',
    helper: '+12%',
    helperClass:
      'text-status-closed text-xs font-bold bg-status-closed/10 px-2 py-0.5 rounded flex items-center gap-1',
    icon: 'trending_up',
    cardClass: 'glass-card p-5 rounded-xl hover:-translate-y-0.5 transition-transform',
  },
  {
    label: 'Active Transfers',
    value: '4',
    valueClass: 'text-admin-primary',
    helper: 'in transit',
    helperClass: 'text-on-surface-variant text-xs font-medium',
    cardClass: 'glass-card p-5 rounded-xl hover:-translate-y-0.5 transition-transform',
  },
  {
    label: 'Waiting Assignment',
    value: '2',
    valueClass: 'text-error',
    helper: 'Critical',
    helperClass: 'text-error text-xs font-bold animate-pulse',
    cardClass:
      'glass-card p-5 rounded-xl border-error/30 bg-error/5 hover:-translate-y-0.5 transition-transform',
  },
  {
    label: 'Drivers On Duty',
    value: '12',
    valueClass: 'text-admin-primary',
    helper: '8 active',
    subHelper: '4 standby',
    helperClass: 'text-xs text-on-surface-variant text-right',
    cardClass: 'glass-card p-5 rounded-xl hover:-translate-y-0.5 transition-transform',
  },
  {
    label: "Today's Revenue",
    value: '€1,280',
    valueClass: 'text-admin-primary',
    helper: '+5%',
    helperClass:
      'text-status-closed text-xs font-bold bg-status-closed/10 px-2 py-0.5 rounded flex items-center gap-1',
    icon: 'trending_up',
    cardClass: 'glass-card p-5 rounded-xl hover:-translate-y-0.5 transition-transform',
  },
  {
    label: 'Problem Bookings',
    value: '1',
    valueClass: 'text-status-problem',
    helper: 'error',
    helperClass:
      'text-status-problem bg-status-problem/10 p-1 rounded-full material-symbols-outlined text-xs',
    cardClass: 'glass-card p-5 rounded-xl hover:-translate-y-0.5 transition-transform',
  },
]

const reservations = [
  {
    time: '14:00',
    customer: 'M. Demir',
    route: 'Fethiye → DLM',
    vehicle: 'Vito VIP',
    driver: 'Can K.',
    driverClass: '',
    status: 'Assigned',
    statusClass:
      'bg-status-assigned/10 text-status-assigned px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  },
  {
    time: '15:30',
    customer: 'E. White',
    route: 'Dalaman → Marmaris',
    vehicle: 'Sprinter',
    driver: 'Pending',
    driverClass: 'text-error font-medium',
    status: 'Searching',
    statusClass:
      'bg-status-searching/10 text-status-searching px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  },
  {
    time: '16:45',
    customer: 'S. Al-Fayed',
    route: 'Marmaris → DLM',
    vehicle: 'S-Class',
    driver: 'Burak Y.',
    driverClass: '',
    status: 'Payment',
    statusClass:
      'bg-status-payment/10 text-status-payment px-2 py-0.5 rounded text-[10px] font-bold uppercase',
  },
]

const driverPayments = [
  { initials: 'MT', name: 'Mehmet T.', transfers: '4 Transfers', amount: '€124.00' },
  { initials: 'BY', name: 'Burak Y.', transfers: '3 Transfers', amount: '€98.50' },
  { initials: 'CK', name: 'Can K.', transfers: '2 Transfers', amount: '€45.00' },
]

const revenueBars = ['40%', '65%', '55%', '85%', '70%', '95%', '30%']
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function DashboardPage() {
  const [showAlert, setShowAlert] = useState(true)

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-title-lg text-title-lg text-on-surface">
            Good Morning, Ali 👋
          </h2>
          <p className="text-on-surface-variant font-body-md text-body-md mt-1">
            Today you have:{' '}
            <span className="font-bold text-admin-primary">18 bookings</span> • 4
            drivers on duty •{' '}
            <span className="text-error font-bold">2 waiting assignment</span> •
            Estimated revenue:{' '}
            <span className="text-secondary font-bold">€1,280</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg font-label-sm text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg font-label-sm text-on-surface hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-sm">download</span>
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-admin-primary text-white rounded-lg font-label-sm hover:bg-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            New Booking
          </button>
        </div>
      </div>

      {showAlert && (
        <button
          className="w-full text-left bg-error-container text-on-error-container p-4 rounded-xl flex items-center justify-between border border-error/20"
          onClick={() => setShowAlert(false)}
          type="button"
        >
          <span className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-error"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <span className="font-title-md text-title-md text-base">
              3 bookings still waiting for driver assignment.
            </span>
          </span>
          <span className="bg-on-error-container text-white px-4 py-1.5 rounded-lg text-label-sm font-bold hover:opacity-90 flex items-center gap-2">
            Driver Assignment
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div className={card.cardClass} key={card.label}>
            <p className="text-on-surface-variant font-label-sm mb-1 uppercase tracking-wider opacity-60">
              {card.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className={`text-3xl font-extrabold ${card.valueClass}`}>
                {card.value}
              </h3>
              <span className={card.helperClass}>
                {card.icon && (
                  <span className="material-symbols-outlined text-xs">
                    {card.icon}
                  </span>
                )}
                {card.subHelper ? (
                  <>
                    <span className="block">{card.helper}</span>
                    <span className="block opacity-60">{card.subHelper}</span>
                  </>
                ) : (
                  card.helper
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-outline-variant flex items-center justify-between">
            <h4 className="font-title-md text-title-md">
              Today's Operational Timeline
            </h4>
            <button className="p-1.5 hover:bg-surface-container rounded transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                filter_list
              </span>
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[400px] custom-scrollbar">
            <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant">
              <div className="relative pl-10 flex items-start justify-between">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-status-assigned flex items-center justify-center border-4 border-white shadow-sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-admin-primary">09:00</span>
                    <span className="bg-status-assigned/10 text-status-assigned text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Assigned
                    </span>
                  </div>
                  <h5 className="font-title-md text-sm mt-1">Ali Sönmez</h5>
                  <div className="flex gap-4 mt-1 text-on-surface-variant text-label-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        location_on
                      </span>
                      DLM Airport
                    </span>
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                    <span className="flex items-center gap-1">Fethiye Center</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                    <span className="material-symbols-outlined text-sm">
                      directions_car
                    </span>
                    Mercedes Vito (Black)
                    <span className="mx-2">•</span>
                    <span className="material-symbols-outlined text-sm">person</span>
                    Mehmet T.
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-admin-primary transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              <div className="relative pl-10 flex items-start justify-between">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-status-searching flex items-center justify-center border-4 border-white shadow-sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-admin-primary">10:30</span>
                    <span className="bg-status-searching/10 text-status-searching text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Searching
                    </span>
                  </div>
                  <h5 className="font-title-md text-sm mt-1">Johnathan Moore</h5>
                  <div className="flex gap-4 mt-1 text-on-surface-variant text-label-sm">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">
                        location_on
                      </span>
                      Göcek Marina
                    </span>
                    <span className="material-symbols-outlined text-xs">
                      arrow_forward
                    </span>
                    <span className="flex items-center gap-1">DLM Airport</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs opacity-80">
                    <span className="material-symbols-outlined text-sm">
                      directions_car
                    </span>
                    VW Transporter
                    <span className="mx-2">•</span>
                    <span className="text-error font-semibold">Unassigned</span>
                  </div>
                </div>
              </div>

              <div className="relative pl-10 flex items-start justify-between">
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-status-closed flex items-center justify-center border-4 border-white shadow-sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-admin-primary opacity-50">
                      12:15
                    </span>
                    <span className="bg-status-closed/10 text-status-closed text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Completed
                    </span>
                  </div>
                  <h5 className="font-title-md text-sm mt-1 opacity-60">
                    Sarah Jenkins
                  </h5>
                  <p className="text-xs text-on-surface-variant opacity-60">
                    Fethiye -&gt; Ölüdeniz • Luxury Sedan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 flex flex-col">
          <h4 className="font-title-md text-title-md mb-6">Operations Calendar</h4>
          <div className="flex-1">
            <div className="grid grid-cols-7 text-center text-xs font-bold text-on-surface-variant mb-4">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-y-3 text-center text-label-sm">
              <span className="opacity-30">29</span>
              <span className="opacity-30">30</span>
              <span className="opacity-30">31</span>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <span
                  className="hover:bg-surface-container rounded-lg p-2 cursor-pointer"
                  key={day}
                >
                  {day}
                </span>
              ))}
              <span className="hover:bg-surface-container rounded-lg p-2 cursor-pointer font-bold text-admin-primary ring-2 ring-admin-primary ring-offset-2">
                8
              </span>
              <span className="hover:bg-surface-container rounded-lg p-2 cursor-pointer relative">
                9
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-status-problem rounded-full" />
              </span>
              {[10, 11, 12, 13, 14, 15, 16].map((day) => (
                <span
                  className="hover:bg-surface-container rounded-lg p-2 cursor-pointer"
                  key={day}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-outline-variant">
            <a
              className="text-admin-primary font-label-sm flex items-center justify-between hover:underline"
              href="#"
            >
              Go to Full Calendar
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-outline-variant flex items-center justify-between">
            <h4 className="font-title-md text-title-md">Recent Reservations</h4>
            <button className="text-admin-primary text-label-sm font-bold hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-label-sm">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Vehicle</th>
                  <th className="px-6 py-3">Driver</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {reservations.map((reservation) => (
                  <tr
                    className="hover:bg-surface-container-lowest transition-colors"
                    key={`${reservation.time}-${reservation.customer}`}
                  >
                    <td className="px-6 py-4 font-bold text-admin-primary">
                      {reservation.time}
                    </td>
                    <td className="px-6 py-4">{reservation.customer}</td>
                    <td className="px-6 py-4">{reservation.route}</td>
                    <td className="px-6 py-4 text-xs">{reservation.vehicle}</td>
                    <td className={`px-6 py-4 ${reservation.driverClass}`}>
                      {reservation.driver}
                    </td>
                    <td className="px-6 py-4">
                      <span className={reservation.statusClass}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-on-surface-variant hover:text-admin-primary">
                        <span className="material-symbols-outlined text-lg">
                          edit_square
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex flex-col">
          <h4 className="font-title-md text-title-md mb-8">Status Distribution</h4>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-40 h-40 rounded-full border-[16px] border-status-assigned border-r-status-new border-b-status-searching border-l-status-payment relative flex items-center justify-center">
              <div className="text-center">
                <span className="block text-2xl font-extrabold text-admin-primary">
                  18
                </span>
                <span className="text-[10px] uppercase opacity-60">Total</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 w-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-status-new" />
                <span className="text-xs text-on-surface-variant">New: 4</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-status-assigned" />
                <span className="text-xs text-on-surface-variant">
                  Assigned: 8
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-status-searching" />
                <span className="text-xs text-on-surface-variant">
                  Searching: 2
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-status-payment" />
                <span className="text-xs text-on-surface-variant">
                  Payment: 3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <div className="lg:col-span-2 glass-card rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-title-md text-title-md">Revenue Growth</h4>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-admin-primary" />
                Current Week
              </span>
              <span className="flex items-center gap-2 text-xs opacity-40">
                <span className="w-2 h-2 rounded-full bg-outline" />
                Last Week
              </span>
            </div>
          </div>
          <div className="flex-1 flex items-end gap-2 h-40">
            {revenueBars.map((height, index) => (
              <div
                className="flex-1 bg-surface-container-low rounded-t-lg relative group h-full"
                key={`${height}-${index}`}
              >
                <div
                  className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                    index === revenueBars.length - 1
                      ? 'bg-primary-container/40'
                      : 'bg-admin-primary'
                  }`}
                  style={{ height }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] uppercase font-bold text-on-surface-variant opacity-60">
            {weekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 flex flex-col">
          <h4 className="font-title-md text-title-md mb-6">
            Pending Driver Payments
          </h4>
          <div className="space-y-4 flex-1">
            {driverPayments.map((payment) => (
              <div
                className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low"
                key={payment.initials}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-admin-primary flex items-center justify-center text-white text-xs font-bold">
                    {payment.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{payment.name}</p>
                    <p className="text-[10px] text-on-surface-variant">
                      {payment.transfers}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-admin-primary">
                  {payment.amount}
                </span>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-2 border border-admin-primary text-admin-primary rounded-lg text-label-sm font-bold hover:bg-admin-primary hover:text-white transition-all">
            Process All Payments
          </button>
        </div>
      </div>
    </div>
  )
}
