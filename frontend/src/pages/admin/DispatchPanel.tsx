import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  dispatchQueue,
  dispatchDetails,
  dispatchHistory,
  dispatchCounts,
  updateDispatch,
  type DispatchRow,
} from '../../features/booking/api'
import { bookingVehicles } from '../../features/booking/bookingVehicles'
import { turkeyToday } from '../../features/booking/turkeyTime'

const views = {
  all: 'Smart priority',
  critical: 'Critical attention',
  urgent: 'Urgent',
  unread: 'Unread notices',
  new: 'New requests',
  unassigned: 'Driver required',
  today: 'Today’s transfers',
  next24: 'Next 24 hours',
  active: 'Active transfers',
}
const priorities = [
  'Critical',
  'Urgent',
  'Needs review',
  'Plan driver',
  'Scheduled',
  'Archived',
]
const field =
  'block min-h-11 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-base'
const action =
  'inline-flex min-h-11 items-center justify-center rounded-lg border bg-white px-4 py-2 font-semibold text-admin-primary'


const tones: Record<string, string> = {
  critical: 'border-red-200 bg-red-50 text-red-800',
  urgent: 'border-orange-200 bg-orange-50 text-orange-800',
  unread: 'border-violet-200 bg-violet-50 text-violet-800',
  new: 'border-blue-200 bg-blue-50 text-blue-800',
  unassigned: 'border-amber-200 bg-amber-50 text-amber-800',
  today: 'border-teal-200 bg-teal-50 text-teal-800',
  next24: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  active: 'border-purple-200 bg-purple-50 text-purple-800',
  confirmed: 'border-green-200 bg-green-50 text-green-800',
  archived: 'border-slate-200 bg-slate-100 text-slate-700',
}
function StatusTag({ label, tone }: { label: string; tone: string }) {
  return <span className={'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ' + (tones[tone] || tones.archived)}>{label}</span>
}
function TransferSummary({ row }: { row: DispatchRow }) {
  const status = row.status === 'PENDING' ? 'New request' : row.status === 'CONFIRMED' ? 'Confirmed' : row.status === 'COMPLETED' ? 'Completed' : 'Cancelled'
  const statusTone = row.status === 'PENDING' ? 'new' : row.status === 'CONFIRMED' ? 'confirmed' : row.status === 'CANCELLED' ? 'critical' : 'archived'
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong className="text-base text-admin-primary">{row.customer_name}</strong>
        <span className="text-xs text-slate-500">#{row.id} · {row.leg === 'return' ? 'Return' : 'Outbound'}</span>
      </div>
      <p className="font-semibold tabular-nums text-slate-800">{row.local_pickup.slice(0, 16).replace('T', ' · ')}</p>
      <p className="text-sm text-slate-600">{row.origin} → {row.destination}</p>
      <div className="flex flex-wrap gap-1.5">
        <StatusTag label={status} tone={statusTone} />
        {row.priority < 5 && <StatusTag label={row.stage === 'Unassigned' ? 'Driver required' : row.stage === 'In progress' ? 'In progress' : 'Driver assigned'} tone={row.stage === 'Unassigned' ? 'unassigned' : row.stage === 'In progress' ? 'active' : 'confirmed'} />}
        {row.priority <= 2 && <StatusTag label={priorities[row.priority]} tone={['critical', 'urgent', 'unread'][row.priority]} />}
        {row.last_request && <StatusTag label="Customer request" tone="unread" />}
      </div>
      {row.driver && <p className="text-xs text-slate-600">Driver: {row.driver}</p>}
    </div>
  )
}

// Share concurrent counter requests across the dashboard and both navigation layouts.
let countRequest: ReturnType<typeof dispatchCounts> | undefined
function sharedDispatchCounts() {
  if (!countRequest) {
    countRequest = dispatchCounts().finally(() => { countRequest = undefined })
  }
  return countRequest
}

function useDispatchData<T>(load: () => Promise<T>) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    let busy = false
    async function refresh() {
      if (busy || document.hidden) return
      busy = true
      try {
        const value = await load()
        if (active) {
          setData(value)
          setError('')
        }
      } catch (err) {
        if (active)
          setError(
            err instanceof Error
              ? err.message
              : 'Could not load dispatch information.',
          )
      } finally {
        busy = false
      }
    }
    void refresh()
    const timer = window.setInterval(refresh, 30000)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('dispatch-updated', refresh)
    return () => {
      active = false
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('dispatch-updated', refresh)
    }
  }, [load, revision])
  return { data, error, reload: () => setRevision((n) => n + 1) }
}

const loadAttention = () => dispatchQueue('view=all')
const loadToday = () => dispatchQueue('view=today')

export function DispatchNotices() {
  const { data, error } = useDispatchData(sharedDispatchCounts)
  const count = data?.unread ?? 0
  return (
    <Link
      to="/admin/bookings?view=unread"
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      aria-label={error ? 'Unread transfer notices, count unavailable' : 'Unread transfer notices: ' + count}
      title="Notifications"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </svg>
      {count > 0 && <span aria-hidden="true" className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-admin-primary">{count > 99 ? '99+' : count}</span>}
      {error && <span aria-hidden="true" className="absolute right-0 top-0 rounded-full bg-amber-300 px-1 text-xs font-bold text-slate-900">!</span>}
    </Link>
  )
}

export function DashboardWork() {
  const attention = useDispatchData(loadAttention)
  const today = useDispatchData(loadToday)
  return (
    <>
      {[
        [attention, 'Requires attention', 'all'],
        [today, 'Today’s schedule', 'today'],
      ].map((group) => {
        const [result, title, view] = group as [
          typeof attention,
          string,
          string,
        ]
        const rows = (result.data?.rows || [])
          .filter((row) => view === 'today' || row.priority <= 3)
          .slice(0, 8)
        return (
          <section key={view} className="rounded-xl border bg-white p-4">
            <h2 className="text-xl font-bold">{title}</h2>
            {result.error && <p role="alert">{result.error}</p>}
            {result.data && !rows.length && <p>No transfers in this list.</p>}
            {rows.map((row) => (
              <Link
                key={row.id + row.leg}
                className="block min-h-11 border-b py-3"
                to={`/admin/bookings/${row.id}`}
              >
                <TransferSummary row={row} />
              </Link>
            ))}
            <Link className={action} to={`/admin/bookings?view=${view}`}>
              View transfers
            </Link>
          </section>
        )
      })}
    </>
  )
}

export function DispatchCards() {
  const { data, error } = useDispatchData(sharedDispatchCounts)
  return (
    <section
      aria-label="Transfer operations"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      {error && <p role="alert">{error}</p>}
      {Object.entries(views)
        .filter(([key]) => key !== 'all')
        .map(([key, label]) => (
          <Link
            key={key}
            className={'rounded-xl border p-4 font-semibold transition-shadow hover:shadow-md ' + tones[key]}
            to={`/admin/bookings?view=${key}`}
          >
            {label}
            <strong className="block text-2xl">{data?.[key] ?? '…'}</strong>
          </Link>
        ))}
    </section>
  )
}

export function DispatchQueue() {
  const [params, setParams] = useSearchParams()
  const query = params.toString()
  return (
    <QueueResults key={query} query={query} apply={(next) => setParams(next)} />
  )
}

function QueueResults({
  query,
  apply,
}: {
  query: string
  apply: (params: URLSearchParams) => void
}) {
  const [loader] = useState(() => () => dispatchQueue(query))
  const { data, error } = useDispatchData(loader)
  const params = new URLSearchParams(query)
  const page = Number(params.get('page') || 0)
  function paginate(page: number) {
    params.set('page', String(page))
    apply(params)
  }
  const [open, setOpen] = useState(false)
  function select(
    name: string,
    label: string,
    options: Record<string, string>,
  ) {
    return (
      <label>
        {label}
        <select
          aria-label={label}
          name={name}
          defaultValue={params.get(name) || ''}
          className={field}
        >
          <option value="">Any</option>
          {Object.entries(options).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
    )
  }
  return (
    <section className="min-w-0 space-y-4 overflow-y-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold">Booking operations</h1>
      <div className="flex flex-wrap gap-2">
        <button
          className={action}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          Filters
        </button>
        <Link className={action} to="/admin/bookings?sort=newest">
          Search booking records
        </Link>
        <Link className={action} to="/admin/management-requests">
          Customer requests
        </Link>
      </div>
      <nav aria-label="Transfer queues" className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap">
        {Object.entries(views).map(([k, v]) => (
          <button
            key={k}
            aria-pressed={(params.get('view') || 'all') === k}
            className={
              action + ' shrink-0 whitespace-nowrap ' + (tones[k] || '') + ' aria-pressed:ring-2 aria-pressed:ring-admin-primary'
            }
            onClick={() => {
              params.set('view', k)
              params.delete('page')
              apply(params)
            }}
          >
            {v}
          </button>
        ))}
      </nav>
      {open && (
        <form
          className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault()
            const next = new URLSearchParams({
              view: params.get('view') || 'all',
            })
            for (const [k, v] of new FormData(e.currentTarget))
              if (typeof v === 'string' && v.trim()) next.set(k, v.trim())
            apply(next)
            setOpen(false)
          }}
        >
          {select('status', 'Booking status', {
            PENDING: 'New',
            CONFIRMED: 'Confirmed',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled',
          })}
          {select('assignment', 'Assignment', {
            assigned: 'Assigned',
            unassigned: 'Unassigned',
          })}
          {select('reviewed', 'Review', {
            unread: 'Unread',
            reviewed: 'Reviewed',
          })}
          {select('direction', 'Direction', {
            arrival: 'Arrival',
            departure: 'Departure',
          })}
          {select('trip', 'Journey', {
            'one-way': 'One way',
            'round-trip': 'Round trip',
          })}
          {select(
            'vehicle',
            'Vehicle',
            Object.fromEntries(bookingVehicles.map((v) => [v.id, v.name])),
          )}
          {select('need', 'Special needs', {
            seat: 'Child seat',
            request: 'Special request',
          })}
          {select('requestType', 'Customer request', {
            CHANGE: 'Change',
            CANCEL: 'Cancellation',
          })}
          {select('horizon', 'Pickup window', {
            '24': 'Next 24 hours',
            '48': 'Next 48 hours',
            '168': 'Next 7 days',
          })}
          {select('received', 'Received', {
            today: 'Today',
            day: 'Last 24 hours',
            week: 'Last 7 days',
          })}
          {[
            ['driver', 'Driver name'],
            ['route', 'Route or destination'],
            ['from', 'Pickup from'],
            ['to', 'Pickup through'],
          ].map(([k, label]) => (
            <label key={k}>
              {label}
              <input
                name={k}
                defaultValue={params.get(k) || ''}
                className={field}
                type={k === 'from' || k === 'to' ? 'date' : 'text'}
              />
            </label>
          ))}
          <button type="submit" className={action}>
            Show results
          </button>
          <Link to="/admin/bookings?view=all" className={action}>
            Reset
          </Link>
        </form>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {['Today', 'Tomorrow', 'Next 7 days'].map((label, i) => (
          <button
            key={label}
            className={action}
            onClick={() => {
              const now = Date.now(),
                day = 86400000
              params.set(
                'from',
                turkeyToday(new Date(now + (i === 1 ? day : 0))),
              )
              params.set('to', turkeyToday(new Date(now + [0, 1, 6][i] * day)))
              params.delete('page')
              apply(params)
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      {data ? (
        <>
          <p>{data.total} transfer legs</p>
          <ul className="space-y-2">
            {data.rows.map((row) => (
              <li key={row.id + row.leg}>
                <Link
                  state={{ dispatchQuery: query, readNoticeLeg: params.get('view') === 'unread' ? row.leg : undefined }}
                  className={'block rounded-xl border border-l-4 bg-white p-4 hover:shadow-sm ' + (['border-l-red-500', 'border-l-orange-500', 'border-l-violet-500', 'border-l-amber-500', 'border-l-green-500', 'border-l-slate-300'][row.priority] || '')}
                  to={`/admin/bookings/${row.id}`}
                >
                  <TransferSummary row={row} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <button
              className={action}
              disabled={page < 1}
              onClick={() => paginate(page - 1)}
            >
              Previous
            </button>
            <button
              className={action}
              disabled={(page + 1) * 25 >= data.total}
              onClick={() => paginate(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        !error && <p>Loading transfers…</p>
      )}
    </section>
  )
}

export function DispatchDetails({ id, readNoticeLeg }: { id: number; readNoticeLeg?: string }) {
  const [loader] = useState(() => () => dispatchDetails(id))
  const { data, error, reload } = useDispatchData(loader)
  const [loadHistory] = useState(() => () => dispatchHistory(id))
  const history = useDispatchData(loadHistory)
  const readAttempt = useRef(false)
  useEffect(() => {
    const row = data?.find(item => item.leg === readNoticeLeg)
    if (!row || readAttempt.current) return
    readAttempt.current = true
    void updateDispatch(row, { reviewOnly: true, verifyCustomer: false }).then(() => {
      reload()
      window.dispatchEvent(new Event('dispatch-updated'))
    }).catch(() => { setNotice('Could not mark notice as read. Please use Mark notice as read.') })
  }, [data, readNoticeLeg, reload])
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <section className="mb-5 space-y-3">
      <h2 className="text-xl font-bold">Driver assignment</h2>
      <p className="text-sm text-slate-600">Choose a status and save. Driver details are optional.</p>
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      {data?.map((row) => (
        <form
          key={row.leg + row.revision}
          className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault()
            if (busy) return
            const form = new FormData(e.currentTarget)
            const command = (
              e.nativeEvent as SubmitEvent
            ).submitter?.getAttribute('value')
            const reviewOnly = command === 'review'
            const verifyCustomer = command === 'verify'
            setBusy(true)
            try {
              const result = await updateDispatch(row, {
                ...Object.fromEntries(form),
                availableAfter: form.get('availableAfter') || null,
                capacity: form.get('capacity')
                  ? Number(form.get('capacity'))
                  : null,
                reviewOnly,
                verifyCustomer,
              })
              setNotice(
                result.warning ||
                  (verifyCustomer
                    ? 'Customer information verified.'
                    : reviewOnly
                      ? 'Marked as reviewed.'
                      : 'Driver assignment saved.'),
              )
              reload()
              history.reload()
              window.dispatchEvent(new Event('dispatch-updated'))
            } catch (err) {
              setNotice(err instanceof Error ? err.message : 'Update failed.')
              reload()
            } finally {
              setBusy(false)
            }
          }}
        >
          <strong className="sm:col-span-2">
            {row.leg === 'return' ? 'Return' : 'Outbound'} ·{' '}
            {row.local_pickup.slice(0, 16)} · {row.stage}
          </strong>
          {[
            ['driver', 'Driver name'],
            ['phone', 'Driver phone'],
            ['plate', 'Vehicle plate'],
            ['capacity', 'Vehicle seats'],
          ].map(([k, label]) => (
            <label key={k}>
              {label}
              <input
                name={k}
                type={
                  k === 'capacity' ? 'number' : k === 'phone' ? 'tel' : 'text'
                }
                defaultValue={String(row[k as keyof DispatchRow] ?? '')}
                className={field}
              />
            </label>
          ))}
          <label>Driver available after (Turkey)
            <input name="availableAfter" type="datetime-local" className={field} defaultValue={row.available_local?.slice(0,16).replace(' ','T') || ''} />
            <small>Leave empty to reserve one hour from pickup.</small>
          </label>
          <label>
            Driver status
            <select name="stage" className={field} defaultValue={row.stage}>
              {[
                'Unassigned',
                'Assigned',
                'Notified',
                'In progress',
                'Finished',
              ].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <button
            className={action}
            disabled={busy || ['COMPLETED', 'CANCELLED'].includes(row.status)}
          >
            Save assignment
          </button>
          <p className="text-sm">
            {row.verified_at
              ? 'Customer information verified'
              : 'Customer information awaits verification'}{' '}
            · {row.assigned_at ? 'Driver assigned' : 'No driver assigned'}
          </p>
          {!row.verified_at && (
            <button
              className={action}
              disabled={busy}
              value="verify"
              formNoValidate
            >
              Verify customer information
            </button>
          )}
          {(!row.reviewed_at ||
            (row.reviewed_priority !== null &&
              row.priority < row.reviewed_priority) ||
            (row.last_request &&
              new Date(row.last_request) > new Date(row.reviewed_at))) && (
            <button
              className={action}
              disabled={busy}
              value="review"
              formNoValidate
            >
              Mark notice as read
            </button>
          )}
        </form>
      ))}
      <h3 className="font-bold">Activity history</h3>
      {history.error && <p role="alert">{history.error}</p>}
      <ol>
        {history.data?.map((event, i) => (
          <li key={i}>
            {new Date(event.occurred_at).toLocaleString('en-GB', {
              timeZone: 'Europe/Istanbul',
            })}{' '}
            · {event.leg} · {event.description}
          </li>
        ))}
      </ol>
    </section>
  )
}
