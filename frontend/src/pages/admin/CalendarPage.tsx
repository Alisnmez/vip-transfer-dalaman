import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCalendarBookings } from '../../features/booking/api'
import { ProcessingButton } from '../../components/ProcessingButton'
import { adminBookingStatusLabel, bookingStatus } from '../../features/booking/formatters'
import { turkeyToday } from '../../features/booking/turkeyTime'
import type { Booking } from '../../features/booking/types'

type View = 'Month' | 'Week' | 'Day'
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const pad = (value: number) => String(value).padStart(2, '0')
const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const parseDay = (day: string) => new Date(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8, 10)))
const addDays = (day: string, offset: number) => { const date = parseDay(day); date.setDate(date.getDate() + offset); return dateKey(date) }
const monthOf = (day: string) => day.slice(0, 7)
const mondayOf = (day: string) => addDays(day, -((parseDay(day).getDay() + 6) % 7))
const statusColors: Record<string, string> = {
  PENDING: 'border-l-amber-500 bg-amber-50 text-amber-900',
  CONFIRMED: 'border-l-emerald-600 bg-emerald-50 text-emerald-900',
  COMPLETED: 'border-l-slate-400 bg-slate-50 text-slate-700',
  CANCELLED: 'border-l-rose-500 bg-rose-50 text-rose-900',
}

export function CalendarPage() {
  const today = turkeyToday()
  const [selectedView, setSelectedView] = useState<View>('Week')
  const [selectedDay, setSelectedDay] = useState(today)
  const [anchor, setAnchor] = useState(today)
  const [agendaOpen, setAgendaOpen] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadedKey, setLoadedKey] = useState('')
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const start = selectedView === 'Month'
    ? `${monthOf(anchor)}-01`
    : selectedView === 'Week' ? mondayOf(anchor) : anchor
  const visibleDays = selectedView === 'Month'
    ? (() => {
      const first = mondayOf(start)
      const daysInMonth = new Date(Number(anchor.slice(0, 4)), Number(anchor.slice(5, 7)), 0).getDate()
      const last = addDays(start, daysInMonth - 1)
      const dayCount = Math.round((Date.UTC(Number(last.slice(0, 4)), Number(last.slice(5, 7)) - 1, Number(last.slice(8, 10))) - Date.UTC(Number(first.slice(0, 4)), Number(first.slice(5, 7)) - 1, Number(first.slice(8, 10)))) / 86400000) + 1
      return Array.from({ length: Math.ceil(dayCount / 7) * 7 }, (_, i) => addDays(first, i))
    })()
    : Array.from({ length: selectedView === 'Week' ? 7 : 1 }, (_, i) => addDays(start, i))

  // A week can span two months. Load both months so edge dates are not silently missing.
  const months = [...new Set(visibleDays.map(monthOf))]
  const monthsKey = months.join(',')
  useEffect(() => {
    let active = true
    Promise.all(monthsKey.split(',').map(month => getCalendarBookings(month)))
      .then(results => {
        if (!active) return
        setBookings(results.flat())
        setLoadedKey(`${monthsKey}:${refreshKey}`)
        setError('')
      })
      .catch(err => {
        if (!active) return
        setBookings([])
        setLoadedKey(`${monthsKey}:${refreshKey}`)
        setError(err instanceof Error ? err.message : 'Could not load transfers')
      })
    return () => { active = false }
  }, [monthsKey, refreshKey])

  const loading = loadedKey !== `${monthsKey}:${refreshKey}`
  const filtered = (loading ? [] : bookings).filter(booking => filter === 'ALL' ||
    (filter === 'ACTIVE' ? ['PENDING', 'CONFIRMED'].includes(bookingStatus(booking.status)) : bookingStatus(booking.status) === filter))
  const byDay = new Map<string, Booking[]>()
  for (const booking of filtered) {
    const day = booking.transferDateTime?.slice(0, 10)
    if (day) byDay.set(day, [...(byDay.get(day) ?? []), booking])
  }
  for (const entries of byDay.values()) entries.sort((a, b) => a.transferDateTime.localeCompare(b.transferDateTime))
  const selectedBookings = byDay.get(selectedDay) ?? []
  const visibleDaySet = new Set(visibleDays)
  const visibleCount = filtered.filter(booking => visibleDaySet.has(booking.transferDateTime?.slice(0, 10))).length

  function navigate(direction: number) {
    const current = parseDay(anchor)
    if (selectedView === 'Month') current.setMonth(current.getMonth() + direction, 1)
    else current.setDate(current.getDate() + direction * (selectedView === 'Week' ? 7 : 1))
    const next = dateKey(current)
    setAnchor(next)
    setSelectedDay(next)
  }
  function selectDay(day: string) {
    setSelectedDay(day)
    setAgendaOpen(true)
  }

  const periodTitle = selectedView === 'Month'
    ? new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(parseDay(start))
    : selectedView === 'Week'
      ? `${start} — ${addDays(start, 6)}`
      : anchor

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-on-surface">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg bg-surface-container-low p-1">
            {(['Month', 'Week', 'Day'] as const).map(view => (
              <button key={view} type="button" aria-pressed={selectedView === view}
                onClick={() => { setSelectedView(view); setAgendaOpen(false) }}
                className={`rounded px-4 py-2 text-sm font-semibold ${selectedView === view ? 'border bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>{view}</button>
            ))}
          </div>
          <button type="button" onClick={() => navigate(-1)} aria-label="Previous period" className="rounded-lg border px-3 py-2">‹</button>
          <h2 className="min-w-40 text-center font-bold text-primary">{periodTitle}</h2>
          <button type="button" onClick={() => navigate(1)} aria-label="Next period" className="rounded-lg border px-3 py-2">›</button>
          <button type="button" onClick={() => { setAnchor(today); setSelectedDay(today) }} className="rounded-lg border px-3 py-2 text-sm">Today</button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select aria-label="Booking status" value={filter} onChange={event => setFilter(event.target.value)} className="rounded-lg border bg-white px-3 py-2 text-sm">
            <option value="ALL">All statuses</option><option value="ACTIVE">Active transfers</option>
            <option value="PENDING">New Request</option><option value="CONFIRMED">Driver Assigned</option>
            <option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
          </select>
          <ProcessingButton type="button" processing={loading} processingLabel="Refreshing..." onClick={() => setRefreshKey(value => value + 1)} className="rounded-lg border px-3 py-2 text-sm">Refresh</ProcessingButton>
          <Link to="/admin/bookings" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Booking list</Link>
        </div>
      </header>

      {error && <p role="alert" className="border-b bg-rose-50 p-4 text-error">{error}</p>}
      {loading && <p role="status" className="border-b p-3 text-sm text-on-surface-variant">Loading transfer calendar...</p>}

      <div className="min-h-0 flex-1 overflow-auto">
        <div className={`grid min-w-[1050px] ${selectedView === 'Day' ? 'grid-cols-1' : 'grid-cols-7'} border-b bg-white`}>
          {(selectedView === 'Day' ? [selectedDay] : weekdays).map((day, index) => (
            <div key={day} className="border-r p-3 text-center text-sm font-semibold text-on-surface-variant">
              {selectedView === 'Day' ? selectedDay : day}
              {selectedView === 'Week' && <span className="ml-2 text-lg text-primary">{parseDay(visibleDays[index]).getDate()}</span>}
            </div>
          ))}
        </div>
        <div className={`grid min-w-[1050px] ${selectedView === 'Day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
          {visibleDays.map(day => {
            const items = byDay.get(day) ?? []
            const isOutside = selectedView === 'Month' && monthOf(day) !== monthOf(anchor)
            return (
              <div key={day} className={`min-w-0 border-b border-r p-2 sm:p-3 ${selectedView === 'Month' ? 'min-h-40' : 'min-h-[360px]'} ${isOutside ? 'bg-slate-50/70' : 'bg-white'} ${day === today ? 'border-t-4 border-t-secondary' : ''}`}>
                <button type="button" onClick={() => selectDay(day)} className="mb-3 flex w-full items-center justify-between rounded px-1 py-1 text-left hover:bg-surface-container-low">
                  <span className={`font-bold ${day === today ? 'rounded-full bg-primary px-2 py-1 text-white' : ''}`}>{selectedView === 'Month' ? parseDay(day).getDate() : day.slice(5)}</span>
                  <span className="rounded bg-surface-container-low px-2 py-1 text-xs font-semibold">{items.length}</span>
                </button>
                <div className="space-y-2">
                  {items.map(booking => {
                    const status = bookingStatus(booking.status)
                    return <Link key={booking.id} to={`/admin/bookings/${booking.id}`}
                      className={`event-card block rounded-lg border border-l-4 p-2 shadow-sm transition-shadow hover:shadow-md ${statusColors[status] ?? 'border-l-primary bg-white'}`}>
                      <div className="mb-1 flex items-center justify-between gap-1">
                        <strong className="text-xs">{booking.transferDateTime.slice(11, 16)}</strong>
                        <span className="truncate text-[10px] font-semibold">{adminBookingStatusLabel(status)}</span>
                      </div>
                      <p className="truncate text-xs font-bold" title={booking.customerName}>{booking.customerName}</p>
                      <p className="mt-1 line-clamp-2 text-[11px] text-on-surface-variant">{booking.pickUpLocation} → {booking.dropOffLocation}</p>
                      <p className="mt-1 text-[10px] text-on-surface-variant">#{booking.id} · {booking.passengerCount} pax</p>
                    </Link>
                  })}
                  {!loading && items.length === 0 && <button type="button" onClick={() => selectDay(day)} className="w-full rounded border border-dashed p-2 text-left text-xs text-on-surface-variant hover:border-primary">View day</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t bg-white px-4 py-3 text-xs text-on-surface-variant">
        <div className="flex flex-wrap gap-4"><span>🟠 Pending</span><span>🟢 Confirmed</span><span>⚪ Completed</span><span>🔴 Cancelled</span></div>
        <span>Turkey time (UTC+3) · {visibleCount} transfers in selected period</span>
      </footer>

      {agendaOpen && <>
        <button type="button" aria-label="Close daily agenda" onClick={() => setAgendaOpen(false)} className="fixed inset-0 z-40 bg-black/30" />
        <aside role="dialog" aria-label="Daily transfer agenda" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b p-5">
            <div><h3 className="text-xl font-bold text-primary">Daily Agenda</h3><p className="text-sm text-on-surface-variant">{selectedDay} · {selectedBookings.length} transfers</p></div>
            <button type="button" aria-label="Close agenda" onClick={() => setAgendaOpen(false)} className="rounded-lg border px-3 py-2">Close</button>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-4">
            {selectedBookings.length === 0 && <p className="text-on-surface-variant">No matching transfers on this day.</p>}
            {selectedBookings.map(booking => {
              const status = bookingStatus(booking.status)
              return <Link key={booking.id} to={`/admin/bookings/${booking.id}`} className={`block rounded-lg border border-l-4 p-4 shadow-sm ${statusColors[status] ?? 'border-l-primary'}`}>
                <div className="flex justify-between gap-2"><strong>{booking.transferDateTime.slice(11, 16)} · {booking.customerName}</strong><span className="text-xs font-bold">{adminBookingStatusLabel(status)}</span></div>
                <p className="mt-2 text-sm">{booking.pickUpLocation} → {booking.dropOffLocation}</p>
                <p className="mt-2 text-xs text-on-surface-variant">Booking #{booking.id} · {booking.passengerCount} passengers · £{Number(booking.price).toFixed(2)}</p>
                <p className="mt-2 text-xs font-semibold text-primary">Open booking details</p>
              </Link>
            })}
          </div>
          <div className="border-t p-4"><Link to="/admin/bookings" className="block rounded-lg bg-primary p-3 text-center text-sm font-bold text-white">View all bookings</Link></div>
        </aside>
      </>}
    </div>
  )
}
