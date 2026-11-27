import { useEffect, useState } from 'react'
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
    return () => {
      active = false
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [load, revision])
  return { data, error, reload: () => setRevision((n) => n + 1) }
}

const loadAttention = () => dispatchQueue('view=all')
const loadToday = () => dispatchQueue('view=today')

export function DispatchNotices() {
  const { data, error } = useDispatchData(dispatchCounts)
  return (
    <Link
      to="/admin/bookings?view=unread"
      className={action}
      aria-label="Unread transfer notices"
    >
      Notices · {error ? '?' : (data?.unread ?? '…')}
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
                <strong>
                  {priorities[row.priority]} · {row.customer_name}
                </strong>
                <p>
                  {row.local_pickup.slice(0, 16)} · {row.origin} →{' '}
                  {row.destination} · {row.driver || 'Driver required'}
                </p>
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
  const { data, error } = useDispatchData(dispatchCounts)
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
            className="rounded-xl border bg-white p-4 font-semibold"
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
      <nav aria-label="Transfer queues" className="flex flex-wrap gap-2">
        {Object.entries(views).map(([k, v]) => (
          <button
            key={k}
            aria-pressed={(params.get('view') || 'all') === k}
            className={
              action + ' aria-pressed:bg-admin-primary aria-pressed:text-white'
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
            ['route', 'Destination'],
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
                  state={{ dispatchQuery: query }}
                  className="block rounded-xl border bg-white p-4"
                  to={`/admin/bookings/${row.id}`}
                >
                  <strong>
                    {priorities[row.priority]} · #{row.id} · {row.customer_name}
                  </strong>
                  <p>
                    {row.local_pickup.slice(0, 16)} · {row.origin} →{' '}
                    {row.destination}
                  </p>
                  {row.last_request && <p>Customer request awaiting review</p>}
                  <p>
                    {row.leg === 'return' ? 'Return' : 'Outbound'} ·{' '}
                    {row.driver || (row.priority === 5 ? 'No driver recorded' : 'Driver required')} · {row.stage}
                  </p>
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

export function DispatchDetails({ id }: { id: number }) {
  const [loader] = useState(() => () => dispatchDetails(id))
  const { data, error, reload } = useDispatchData(loader)
  const [loadHistory] = useState(() => () => dispatchHistory(id))
  const history = useDispatchData(loadHistory)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <section className="mb-5 space-y-3">
      <h2 className="text-xl font-bold">Driver assignment</h2>
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
