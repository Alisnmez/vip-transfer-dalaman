import { useMemo, useState } from 'react'
import { useTransferPrices, updateTransferPrice } from '../../features/booking/useTransferPrices'
import type { TransferPrice } from '../../features/booking/useTransferPrices'
import { useAsyncAction } from '../../hooks/useAsyncAction'
import { BookingApiError } from '../../features/booking/api/errors'

import { transferVehicles } from '../../features/booking/pricing'

const vehicleNames = new Map<string, string>(transferVehicles.map((vehicle) => [vehicle.id, vehicle.name]))
const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replaceAll('ı', 'i')
const pageSize = 25

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(value)
}

export function RoutePricePage() {
  const { prices, loading, error, refresh, replacePrice } = useTransferPrices()
  const { processing, run } = useAsyncAction()
  const [editing, setEditing] = useState<TransferPrice | null>(null)
  const [oneWay, setOneWay] = useState('')
  const [roundTrip, setRoundTrip] = useState('')
  const [notice, setNotice] = useState('')
  const [saveError, setSaveError] = useState('')
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [destination, setDestination] = useState('')
  const destinations = useMemo(() => [...new Set(prices.map(item => item.destination))], [prices])
  const indexedPrices = useMemo(() => prices.map(item => ({ item, searchText: normalize(`${item.destination} ${vehicleNames.get(item.vehicleId) ?? item.vehicleId}`) })), [prices])

  const filteredPrices = useMemo(() => {
    const query = normalize(search.trim())
    return indexedPrices.filter(({ item, searchText }) => {
      return (
        (!destination || item.destination === destination) &&
        (!vehicleId || item.vehicleId === vehicleId) &&
        (!query || searchText.includes(query))
      )
    }).map(({ item }) => item)
  }, [search, vehicleId, destination, indexedPrices])
  const totalPages = Math.ceil(filteredPrices.length / pageSize)
  const visiblePrices = filteredPrices.slice(page * pageSize, (page + 1) * pageSize)

  function editPrice(item: TransferPrice) {
    setEditing(item); setOneWay(item.oneWay.toFixed(2)); setRoundTrip(item.roundTrip.toFixed(2)); setSaveError(''); setNotice('')
  }

  function savePrice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editing) return
    if (![oneWay, roundTrip].every(value => /^\d{1,9}(\.\d{1,2})?$/.test(value) && Number(value) > 0)) {
      setSaveError('Enter positive GBP prices with no more than two decimal places.'); return
    }
    void run(async () => {
      setSaveError('')
      try {
        const updated = await updateTransferPrice({ ...editing, oneWay: Number(oneWay), roundTrip: Number(roundTrip) })
        replacePrice(updated); setEditing(null); setNotice(`Prices saved for ${updated.destination} · ${vehicleNames.get(updated.vehicleId)}. New bookings use the updated prices.`)
      } catch (error) {
        if (error instanceof BookingApiError && error.status === 409) {
          setEditing(null); refresh(); setSaveError('This price was changed by another admin. The list is being refreshed; reopen the row before editing again.')
        } else setSaveError('Unable to confirm that prices were saved. Refresh the list before retrying.')
      }
    })
  }

  return (
    <section className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">Pricing management</p>
          <h1 className="font-title-lg text-title-lg text-on-surface">Route Prices</h1>
          <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
            Review published transfer prices from Dalaman Airport to each destination. The same prices apply in the opposite direction.
          </p>
        </div>
        <span className="rounded-full border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-admin-primary">
          GBP · Per vehicle
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-on-surface-variant">Destinations</p>
          <p className="mt-2 text-3xl font-bold text-admin-primary">{destinations.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-on-surface-variant">Vehicle types</p>
          <p className="mt-2 text-3xl font-bold text-admin-primary">{transferVehicles.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-on-surface-variant">Matching prices</p>
          <p className="mt-2 text-3xl font-bold text-admin-primary">{filteredPrices.length}</p>
        </div>
      </div>

      <div className="glass-card space-y-5 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="block space-y-2 text-sm font-semibold text-on-surface">
            Search route or vehicle
            <input
              className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-base font-normal text-on-surface"
              onChange={(event) => { setSearch(event.target.value); setPage(0) }}
              placeholder="Search destinations..."
              type="search"
              value={search}
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-on-surface">
            Destination
            <select aria-label="Destination" className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-base font-normal" onChange={(event) => { setDestination(event.target.value); setPage(0) }} value={destination}>
              <option value="">All destinations</option>
              {destinations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block space-y-2 text-sm font-semibold text-on-surface">
            Vehicle
            <select aria-label="Vehicle" className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-base font-normal" onChange={(event) => { setVehicleId(event.target.value); setPage(0) }} value={vehicleId}>
              <option value="">All vehicles</option>
              {transferVehicles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-3"><button type="button" disabled={processing || loading} onClick={() => { setSearch(''); setDestination(''); setVehicleId(''); setPage(0) }} className="rounded-lg border px-4 py-2">Clear filters</button><button type="button" disabled={processing || loading} onClick={() => { setEditing(null); setNotice(''); setSaveError(''); setPage(0); refresh() }} className="rounded-lg border px-4 py-2">Refresh prices</button></div>
        {loading && <p role="status">Loading current prices...</p>}
        {error && <p role="alert">{error}</p>}
        {saveError && <p role="alert">{saveError}</p>}
        {notice && <p role="status" className="text-green-800">{notice}</p>}
        {editing && <form onSubmit={savePrice} aria-label="Edit route prices" className="space-y-4 rounded-lg border p-4">
          <h2 className="font-bold">Edit {editing.destination} · {vehicleNames.get(editing.vehicleId)}</h2>
          <div className="flex flex-wrap gap-4">
            <label>One-way price (GBP)<input autoFocus required type="number" min="0.01" max="999999999.99" step="0.01" value={oneWay} disabled={processing} onChange={event => setOneWay(event.target.value)} className="block rounded-lg border p-3" /></label>
            <label>Round-trip price (GBP)<input required type="number" min="0.01" max="999999999.99" step="0.01" value={roundTrip} disabled={processing} onChange={event => setRoundTrip(event.target.value)} className="block rounded-lg border p-3" /></label>
          </div>
          <p className="text-sm">Changes apply to new bookings in both directions. Existing booking fares stay unchanged.</p>
          <button type="submit" disabled={processing || loading} className="rounded-lg bg-admin-primary px-4 py-2 text-white disabled:opacity-50">{processing ? 'Saving...' : 'Save prices'}</button>
          <button type="button" disabled={processing} onClick={() => setEditing(null)} className="ml-3 rounded-lg border px-4 py-2">Cancel editing</button>
        </form>}

        <div className="w-full overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead className="bg-admin-primary text-white">
              <tr>
                <th className="px-4 py-4 font-semibold" scope="col">Destination</th>
                <th className="px-4 py-4 font-semibold" scope="col">Vehicle</th>
                <th className="px-4 py-4 text-right font-semibold" scope="col">One way</th>
                <th className="px-4 py-4 text-right font-semibold" scope="col">Round trip</th>
                <th className="px-4 py-4 font-semibold" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visiblePrices.map((item) => (
                <tr className="border-t border-outline-variant hover:bg-surface-container-low" key={`${item.destination}-${item.vehicleId}`}>
                  <td className="px-4 py-4 font-medium text-on-surface">{item.destination}</td>
                  <td className="px-4 py-4 text-on-surface-variant">{vehicleNames.get(item.vehicleId) ?? item.vehicleId}</td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-on-surface">{formatPrice(item.oneWay)}</td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-on-surface">{formatPrice(item.roundTrip)}</td>
                  <td className="px-4 py-4"><button type="button" disabled={processing || loading} onClick={() => editPrice(item)} aria-label={`Edit ${item.destination} ${vehicleNames.get(item.vehicleId)}`} className="rounded-lg border px-4 py-2">Edit</button></td>
                </tr>
              ))}
              {filteredPrices.length === 0 && (
                <tr><td className="px-4 py-10 text-center text-on-surface-variant" colSpan={5}>{loading ? 'Loading prices...' : error ? 'Prices are unavailable.' : 'No prices match your filters.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && <nav aria-label="Price pages" className="flex items-center justify-center gap-4"><button type="button" disabled={page === 0 || processing} onClick={() => setPage(value => value - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page + 1} of {totalPages}</span><button type="button" disabled={page + 1 >= totalPages || processing} onClick={() => setPage(value => value + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></nav>}
      </div>
    </section>
  )
}
