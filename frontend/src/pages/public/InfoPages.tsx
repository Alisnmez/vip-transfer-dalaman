import { Link } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

const pageContent = {
  vehicles: {
    eyebrow: 'Vehicles',
    title: 'Professional Transfer Vehicles',
    description:
      'Clean, air-conditioned vehicles selected for airport transfers, families, and private groups.',
    items: [
      ['Business Sedan', 'Comfortable option for up to 3 passengers.'],
      ['VIP Minivan', 'Most popular choice for families and small groups.'],
      ['Premium Van', 'Extra room for luggage and longer coastal routes.'],
      ['First Class Sedan', 'Quiet executive option for private travel.'],
    ],
  },
  services: {
    eyebrow: 'Services',
    title: 'Reliable Airport Transfer Services',
    description:
      'Straightforward private transfer services with clear communication and fixed route pricing.',
    items: [
      ['Airport Pickup', 'Meet your driver at Dalaman Airport arrivals.'],
      ['Hotel Transfer', 'Door-to-door pickup and drop-off for hotels and villas.'],
      ['Return Transfer', 'Schedule your return journey in advance.'],
      ['Flight Details', 'Add your flight number when submitting a booking request.'],
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Contact VIP Transfer Dalaman',
    description:
      'Share your route, travel date, passenger count, and flight number through the booking request form.',
    items: [
      ['Service Area', 'Dalaman, Fethiye, Gocek, Marmaris, Oludeniz'],
      ['Booking Requests', 'Use the online booking form to submit your transfer details.'],
    ],
  },
}

export function VehiclesPage() {
  return <InfoPage content={pageContent.vehicles} />
}

export function ServicesPage() {
  return <InfoPage content={pageContent.services} />
}

export function ContactPage() {
  return <InfoPage content={pageContent.contact} />
}

function InfoPage({
  content,
}: {
  content: {
    description: string
    eyebrow: string
    items: string[][]
    title: string
  }
}) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="pt-32 pb-20 px-margin-page max-w-7xl mx-auto">
        <section className="max-w-3xl mb-12">
          <p className="font-label-sm text-label-sm uppercase text-secondary mb-4">
            {content.eyebrow}
          </p>
          <h1 className="font-display-lg text-display-lg text-admin-primary mb-4">
            {content.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {content.description}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter-grid">
          {content.items.map(([title, description]) => (
            <article
              className="bg-white border border-outline-variant rounded-xl p-6 card-soft-shadow"
              key={title}
            >
              <h2 className="font-title-md text-title-md text-admin-primary mb-2">
                {title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {description}
              </p>
            </article>
          ))}
        </section>

        <div className="mt-12 flex flex-col sm:flex-row gap-stack-md">
          <Link
            className="inline-flex justify-center bg-admin-primary text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            to="/booking"
          >
            Book Your Transfer
          </Link>
          <Link
            className="inline-flex justify-center bg-white border border-outline-variant text-admin-primary px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors"
            to="/"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  )
}
