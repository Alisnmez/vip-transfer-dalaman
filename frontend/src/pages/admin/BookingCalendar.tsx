import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCalendarBookings } from '../../features/booking/api'
import { bookingStatus } from '../../features/booking/formatters'
import type { Booking } from '../../features/booking/types'

const turkeyDate = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`
}

function shiftMonth(month: string, offset: number) {
  const [year, number] = month.split('-').map(Number)
  return monthKey(new Date(year, number - 1 + offset, 1))
}

const statusStyle: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-950',
  CONFIRMED: 'bg-emerald-100 text-emerald-900',
  COMPLETED: 'bg-slate-200 text-slate-700',
  CANCELLED: 'bg-rose-100 text-rose-900',
}

export function BookingCalendar() {
  const [month, setMonth] = useState(() => turkeyDate().slice(0, 7) + '-01')
  const [selectedDay, setSelectedDay] = useState(() => turkeyDate())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState('ACTIVE')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    let active = true
    getCalendarBookings(month)
      .then(data => { if (active) { setBookings(data); setError('') } })
      .catch(err => { if (active) setError(err instanceof Error ? err.message : 'Could not load calendar') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [month, revision])

  const [year, number] = month.split('-').map(Number)
  const daysInMonth = new Date(year, number, 0).getDate()
  const startOffset = (new Date(year, number - 1, 1).getDay() + 6) % 7
  const days = Array.from({ length: Math.ceil((startOffset + daysInMonth) / 7) * 7 }, (_, index) => {
    const day = index - startOffset + 1
    return day > 0 && day <= daysInMonth ? day : null
  })
  const filtered = bookings.filter(booking => filter === 'ALL' ||
    (filter === 'ACTIVE' ? ['PENDING', 'CONFIRMED'].includes(bookingStatus(booking.status)) :
      bookingStatus(booking.status) === filter))
  const byDay = new Map<string, Booking[]>()
  for (const booking of filtered) {
    const key = booking.transferDateTime?.slice(0, 10)
    if (key) byDay.set(key, [...(byDay.get(key) ?? []), booking])
  }
  const dayBookings = byDay.get(selectedDay) ?? []
  const today = turkeyDate()
  const monthTitle = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })
    .format(new Date(year, number - 1, 1))

  function move(offset: number) {
    const next = shiftMonth(month, offset)
    setMonth(next)
    setSelectedDay(next)
    setLoading(true)
  }

  return (
    <section className="space-y-5" aria-label="Transfer calendar">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-xl font-bold text-admin-primary">Transfer calendar</h2>
          <p className="text-sm text-on-surface-variant">Pickup dates and times in Turkey · Select a day to manage bookings</p></div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Filter booking status" value={filter} onChange={event => setFilter(event.target.value)}
            className="rounded-lg border border-outline-variant bg-white px-3 py-2">
            <option value="ACTIVE">Active requests</option><option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option><option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
          </select>
          <button type="button" className="rounded-lg border bg-white px-3 py-2" onClick={() => {
            const current = today.slice(0, 7) + '-01'
            setMonth(current); setSelectedDay(today); setLoading(true); setRevision(value => value + 1)
          }}>Today</button>
          <button type="button" className="rounded-lg border bg-white px-3 py-2" onClick={() => { setLoading(true); setRevision(value => value + 1) }}>Refresh</button>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-white">
        <div className="flex items-center justify-between border-b p-4">
          <button type="button" onClick={() => move(-1)} className="rounded-lg border px-4 py-2" aria-label="Previous month">‹</button>
          <h3 className="text-lg font-bold">{monthTitle}</h3>
          <button type="button" onClick={() => move(1)} className="rounded-lg border px-4 py-2" aria-label="Next month">›</button>
        </div>
        {error && <p role="alert" className="p-4 text-error">{error}</p>}
        {loading && <p className="p-4">Loading calendar...</p>}
        <div className="grid grid-cols-7 text-center text-xs font-semibold sm:text-sm">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="border-b bg-surface-container-low py-3">{day}</div>)}
          {days.map((day, index) => {
            const key = day ? `${month.slice(0, 8)}${String(day).padStart(2, '0')}` : ''
            const items = byDay.get(key) ?? []
            return <div key={index} className="min-h-16 border-b border-r sm:min-h-24">
              {day && <button type="button" onClick={() => setSelectedDay(key)}
                aria-label={`${key}: ${items.length} bookings`}
                aria-pressed={selectedDay === key}
                className={`flex h-full w-full flex-col items-start gap-1 p-2 text-left hover:bg-surface-container-low ${selectedDay === key ? 'bg-blue-50 ring-2 ring-inset ring-admin-primary' : ''}`}>
                <span className={`text-sm font-semibold ${key === today ? 'rounded-full bg-admin-primary px-2 text-white' : ''}`}>{day}</span>
                {items.length > 0 && <span className="rounded bg-admin-primary px-1.5 py-0.5 text-xs font-bold text-white">{items.length} booking{items.length !== 1 ? 's' : ''}</span>}
                <span className="hidden text-xs text-on-surface-variant sm:block">{items.filter(item => bookingStatus(item.status) === 'PENDING').length || ''}{items.some(item => bookingStatus(item.status) === 'PENDING') ? ' pending' : ''}</span>
              </button>}
            </div>
          })}
        </div>
      </div>
      <div className="rounded-xl border border-outline-variant bg-white p-4 sm:p-6">
        <h3 className="mb-4 text-lg font-bold">{selectedDay} · {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}</h3>
        {!loading && dayBookings.length === 0 && <p className="text-on-surface-variant">No matching transfers on this day.</p>}
        <div className="space-y-3">
          {dayBookings.map(booking => {
            const status = bookingStatus(booking.status)
            return <Link key={booking.id} to={`/admin/bookings/${booking.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-outline-variant p-4 hover:bg-surface-container-low">
              <div className="min-w-0"><p className="font-bold">{booking.transferDateTime?.slice(11, 16)} · #{booking.id} · {booking.customerName}</p>
                <p className="text-sm text-on-surface-variant">{booking.pickUpLocation} → {booking.dropOffLocation} · {booking.passengerCount} passengers</p></div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[status] ?? 'bg-slate-100'}`}>{status}</span>
            </Link>
          })}
        </div>
      </div>
    </section>
  )
}
