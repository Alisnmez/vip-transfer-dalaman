import { Link, useParams } from 'react-router-dom'
import { transferPrices } from '../../features/booking/pricing'
import { PublicNavbar } from './PublicNavbar'

const destinations = [
  { slug: 'marmaris', name: 'Marmaris', match: 'Marmaris(Any Hotel)', intro: 'Marmaris is a coastal resort town with hotels, a marina and a lively waterfront. Choose your vehicle before requesting an airport pickup.' },
  { slug: 'fethiye', name: 'Fethiye', match: 'Fethiye City Center(Any Hotel)', intro: 'Fethiye offers a harbour, town centre and access to the surrounding coast. Include your hotel or exact address in the booking request.' },
  { slug: 'oludeniz', name: 'Oludeniz', match: 'Oludeniz', intro: 'Oludeniz is known for its lagoon and beach area. Share your accommodation details so the transfer team can review your pickup or drop-off.' },
  { slug: 'gocek', name: 'Gocek', match: 'Gocek', intro: 'Gocek is a marina destination on the Gulf of Fethiye. Provide your marina or hotel name when requesting a private transfer.' },
  { slug: 'icmeler', name: 'Icmeler', match: 'Icmeler(Any Hotel)', intro: 'Icmeler is a resort area near Marmaris. Select your vehicle and confirm your hotel details in the reservation form.' },
] as const

export function RouteDetailPage() {
  const { slug } = useParams()
  const route = destinations.find((item) => item.slug === slug)
  const available = route ? transferPrices.some((price) => price.destination.toLowerCase().includes(route.match.toLowerCase())) : false

  if (!route || !available) {
    return <><title>Route not available | DalamanWay</title><meta name="robots" content="noindex,nofollow" /><PublicNavbar /><main className="mx-auto max-w-4xl px-6 pb-20 pt-36"><h1 className="text-3xl font-bold">Route not available</h1><Link className="mt-6 inline-block underline" to="/routes">See available routes</Link></main></>
  }

  const title = `Dalaman Airport to ${route.name} Private Transfer | DalamanWay`
  const description = `Plan a private Dalaman Airport to ${route.name} transfer. Compare available vehicles and request a one-way or return journey.`

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-5 pb-20 pt-36 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-on-surface-variant"><Link className="underline" to="/routes">Routes</Link> / {route.name}</nav>
        <h1 className="max-w-3xl text-4xl font-bold text-admin-primary sm:text-5xl">Dalaman Airport to {route.name} private transfer</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">{route.intro}</p>
        <section className="mt-12 rounded-2xl border border-outline-variant bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-admin-primary">Plan your journey</h2>
          <p className="mt-3 leading-relaxed">Compare the available vehicle options and current listed fares on our routes page. You can request a one-way or return transfer; the team will review your request before confirmation.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="rounded-lg bg-admin-primary px-6 py-3 font-semibold text-white" to="/booking">Request a transfer</Link>
            <Link className="rounded-lg border border-outline-variant px-6 py-3 font-semibold text-admin-primary" to="/routes">Compare routes and prices</Link>
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-admin-primary">Information to prepare</h2>
          <p className="mt-3 leading-relaxed">Have your arrival date and time, flight number if applicable, passenger and luggage counts, and your destination hotel or address ready. For return journeys, include your return pickup date and time.</p>
        </section>
      </main>
    </>
  )
}
