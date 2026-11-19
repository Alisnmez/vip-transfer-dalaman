import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { bookingVehicles } from '../../features/booking/bookingVehicles'
import { PublicNavbar } from './PublicNavbar'
import { useTransferPrices } from '../../features/booking/useTransferPrices'

const featuredDestinations = [
  { name: 'Marmaris', slug: 'marmaris' },
  { name: 'Fethiye', slug: 'fethiye' },
  { name: 'Oludeniz', slug: 'oludeniz' },
  { name: 'Gocek', slug: 'gocek' },
  { name: 'Icmeler', slug: 'icmeler' },
]
function priceLabel(price: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 2 }).format(price)
}

export function RoutesPage() {
  const { prices: transferPrices, loading, error, refresh } = useTransferPrices()
  const featuredRoutes = useMemo(() => {
    const minimums = new Map<string, number>()
    for (const price of transferPrices.filter(row => bookingVehicles.some(vehicle => vehicle.id === row.vehicleId))) minimums.set(price.destination, Math.min(minimums.get(price.destination) ?? Infinity, price.oneWay))
    return featuredDestinations.map(({ name, slug }) => {
      const match = [...minimums].find(([destination]) => destination.toLowerCase().includes(name.toLowerCase()))
      return match ? { destination: match[0], from: match[1], slug } : null
    }).filter((route): route is NonNullable<typeof route> => route !== null)
  }, [transferPrices])

  const [search, setSearch] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>(bookingVehicles[0].id)
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way')

  const routes = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('en')
    return transferPrices
      .filter((route) => route.vehicleId === selectedVehicle && route.destination.toLocaleLowerCase('en').includes(query))
      .sort((a, b) => a.destination.localeCompare(b.destination))
  }, [search, selectedVehicle, transferPrices])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main>
        {loading && <span className="sr-only" role="status">Updating route prices</span>}
        {error && <div role="alert" className="pt-24 px-4">{error} <button type="button" onClick={refresh}>Refresh prices</button></div>}
        <section className="relative overflow-hidden bg-admin-primary px-4 pb-16 pt-32 text-white sm:px-8 sm:pb-20 sm:pt-40">
          <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-52 right-12 h-96 w-96 rounded-full border border-white/10" />
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-secondary">PRIVATE AIRPORT TRANSFERS</p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your journey from Dalaman starts here.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Explore private transfers between Dalaman Airport and the Turkish Riviera. Compare transparent, per-vehicle prices and plan your arrival or return journey.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-lg bg-secondary px-7 py-3 text-base font-bold text-admin-primary transition-opacity hover:opacity-90" to="/booking">
                Book your transfer <span translate="no" aria-hidden="true" className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
              </Link>
              <a className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/40 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10" href="#all-routes">
                Explore routes
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="popular-routes-heading">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">EXPLORE THE COAST</p>
              <h2 className="text-2xl font-bold tracking-tight text-admin-primary sm:text-3xl" id="popular-routes-heading">Popular destinations</h2>
              <p className="mt-2 text-sm text-on-surface-variant">Starting one-way prices per vehicle.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRoutes.map((route, index) => (
              <article className="group flex min-h-48 flex-col justify-between rounded-2xl border border-outline-variant bg-white p-6 shadow-sm transition-shadow hover:shadow-lg" key={route.destination}>
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-admin-primary/5 text-admin-primary">
                    <span translate="no" aria-hidden="true" className="material-symbols-outlined">{index % 2 === 0 ? 'location_on' : 'explore'}</span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">Private transfer</span>
                </div>
                <div className="mt-8 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-admin-primary">{route.destination}</h3>
                    <p className="mt-1 text-xs text-on-surface-variant">Dalaman Airport · From {priceLabel(route.from)}</p>
                  </div>
                  <Link className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-admin-primary transition-colors hover:bg-surface-container-low" to={`/routes/${route.slug}`} aria-label={`Compare prices for ${route.destination}`}>
                    <span translate="no" aria-hidden="true" className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low px-4 py-14 sm:px-8 sm:py-20" id="all-routes" aria-labelledby="all-routes-heading">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-secondary">PLAN YOUR TRANSFER</p>
              <h2 className="text-2xl font-bold tracking-tight text-admin-primary sm:text-3xl" id="all-routes-heading">Find your route & price</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant">Choose a vehicle and journey type to compare prices from the same list used by our booking form.</p>
            </div>
            <div className="rounded-2xl border border-outline-variant bg-white p-4 shadow-sm sm:p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm font-semibold text-admin-primary">
                  <span className="block">Destination</span>
                  <input className="min-h-12 w-full min-w-0 rounded-lg border border-outline-variant bg-white px-4 text-base font-normal text-on-surface outline-offset-2" onChange={(event) => setSearch(event.target.value)} placeholder="Search destinations" type="search" value={search} />
                </label>
                <label className="space-y-2 text-sm font-semibold text-admin-primary">
                  <span className="block">Vehicle</span>
                  <select aria-label="Vehicle" className="min-h-12 w-full min-w-0 rounded-lg border border-outline-variant bg-white px-4 text-base font-normal text-on-surface" onChange={(event) => setSelectedVehicle(event.target.value)} value={selectedVehicle}>
                    {bookingVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}
                  </select>
                </label>
                <label className="space-y-2 text-sm font-semibold text-admin-primary">
                  <span className="block">Journey type</span>
                  <select aria-label="Journey type" className="min-h-12 w-full min-w-0 rounded-lg border border-outline-variant bg-white px-4 text-base font-normal text-on-surface" onChange={(event) => setTripType(event.target.value as 'one-way' | 'round-trip')} value={tripType}>
                    <option value="one-way">One way</option>
                    <option value="round-trip">Round trip</option>
                  </select>
                </label>
              </div>
              <p aria-live="polite" className="mt-5 text-sm text-on-surface-variant">{routes.length} destinations found · Prices in GBP, per vehicle</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {routes.map((route) => (
                  <article className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-background p-4 sm:p-5" key={route.destination}>
                    <div>
                      <p className="text-xs text-on-surface-variant">Dalaman Airport ↔</p>
                      <h3 className="mt-1 font-semibold text-admin-primary">{route.destination}</h3>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-outline-variant pt-4">
                      <div>
                        <p className="text-xs text-on-surface-variant">{tripType === 'one-way' ? 'One way' : 'Round trip'}</p>
                        <p className="text-xl font-bold tabular-nums text-admin-primary">{priceLabel(tripType === 'one-way' ? route.oneWay : route.roundTrip)}</p>
                      </div>
                      <Link className="inline-flex min-h-11 items-center rounded-lg bg-admin-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90" to="/booking">Book now</Link>
                    </div>
                  </article>
                ))}
              </div>
              {routes.length === 0 && <p className="py-12 text-center text-on-surface-variant">No matching destinations. Try a different search.</p>}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-8 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">TRAVEL IN COMFORT</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-admin-primary sm:text-3xl">Ready for a smooth arrival?</h2>
          <p className="mx-auto mt-4 max-w-xl text-on-surface-variant">Select your travel details and find the right private transfer for your journey.</p>
          <Link className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-admin-primary px-8 py-3 font-bold text-white transition-opacity hover:opacity-90" to="/booking">Start your booking</Link>
        </section>
      </main>
    </div>
  )
}
