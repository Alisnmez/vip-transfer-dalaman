import { useMemo, useState } from 'react'

import { transferPrices, transferVehicles } from '../../features/booking/pricing'

const destinations = [...new Set(transferPrices.map((item) => item.destination))]
const vehicleNames = new Map<string, string>(transferVehicles.map((vehicle) => [vehicle.id, vehicle.name]))

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(value)
}

export function RoutePricePage() {
  const [search, setSearch] = useState('')
  const [vehicleId, setVehicleId] = useState('')
  const [destination, setDestination] = useState('')

  const filteredPrices = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en')
    return transferPrices.filter((item) => {
      const vehicleName = vehicleNames.get(item.vehicleId) ?? item.vehicleId
      return (
        (!destination || item.destination === destination) &&
        (!vehicleId || item.vehicleId === vehicleId) &&
        (!query || item.destination.toLocaleLowerCase('en').includes(query) || vehicleName.toLocaleLowerCase('en').includes(query))
      )
    })
  }, [search, vehicleId, destination])

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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search destinations..."
              type="search"
              value={search}
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-on-surface">
            Destination
            <select className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-base font-normal" onChange={(event) => setDestination(event.target.value)} value={destination}>
              <option value="">All destinations</option>
              {destinations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block space-y-2 text-sm font-semibold text-on-surface">
            Vehicle
            <select className="w-full rounded-lg border border-outline-variant bg-white px-4 py-3 text-base font-normal" onChange={(event) => setVehicleId(event.target.value)} value={vehicleId}>
              <option value="">All vehicles</option>
              {transferVehicles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
        </div>

        <p className="rounded-lg border border-outline-variant bg-surface-container-low p-3 text-sm text-on-surface-variant">
          Read-only price list. Prices are currently defined in the application's booking pricing data; editing them here would not update customer bookings. Database-backed price editing will be added separately.
        </p>

        <div className="w-full overflow-x-auto rounded-lg border border-outline-variant">
          <table className="w-full min-w-[650px] border-collapse text-left text-sm">
            <thead className="bg-admin-primary text-white">
              <tr>
                <th className="px-4 py-4 font-semibold" scope="col">Destination</th>
                <th className="px-4 py-4 font-semibold" scope="col">Vehicle</th>
                <th className="px-4 py-4 text-right font-semibold" scope="col">One way</th>
                <th className="px-4 py-4 text-right font-semibold" scope="col">Round trip</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrices.map((item) => (
                <tr className="border-t border-outline-variant hover:bg-surface-container-low" key={`${item.destination}-${item.vehicleId}`}>
                  <td className="px-4 py-4 font-medium text-on-surface">{item.destination}</td>
                  <td className="px-4 py-4 text-on-surface-variant">{vehicleNames.get(item.vehicleId) ?? item.vehicleId}</td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-on-surface">{formatPrice(item.oneWay)}</td>
                  <td className="px-4 py-4 text-right font-semibold tabular-nums text-on-surface">{formatPrice(item.roundTrip)}</td>
                </tr>
              ))}
              {filteredPrices.length === 0 && (
                <tr><td className="px-4 py-10 text-center text-on-surface-variant" colSpan={4}>No prices match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
