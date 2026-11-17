import { Link } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

const pageContent = {
  vehicles: {
    eyebrow: 'Vehicles',
    title: 'Professional Transfer Vehicles',
    description:
      'Choose a vehicle category for your airport transfer request. Vehicle details will be confirmed before travel.',
    items: [
      ['Vehicle Selection', 'See the available vehicle categories and passenger limits in the booking form.'],
      ['Luggage and Baby Seats', 'Enter your luggage and baby-seat needs when requesting a transfer.'],
      ['Vehicle Confirmation', 'The operator will confirm the vehicle category and trip details.'],
    ],
  },
  services: {
    eyebrow: 'Services',
    title: 'Reliable Airport Transfer Services',
    description:
      'Request a private airport transfer and review the published route estimate before submitting.',
    items: [
      ['Airport Pickup', 'Request a pickup from Dalaman Airport and provide your flight details.'],
      ['Hotel Transfer', 'Provide your hotel or accommodation address in the booking request.'],
      ['Return Transfer', 'Schedule your return journey in advance.'],
      ['Flight Details', 'Add your flight number when submitting a booking request.'],
      ['Changes and Cancellations', 'Contact the operator with your booking reference to request a change or cancellation. Terms will be confirmed by the operator.'],
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
      ['Existing Booking', 'For changes or cancellations, contact us with your booking reference. Do not submit a duplicate request.'],
    ],
  },
}

const frequentlyAskedQuestions = [
  ['How do I book a transfer?', 'Choose your route, travel date, vehicle category and passenger details in the online booking form. Review the details before submitting your request.'],
  ['Can I book a return transfer?', 'Yes. Select Round Trip and enter your return date and time.'],
  ['What if my flight is delayed?', 'Please include your flight number if you have one and contact us if your travel details change. Pickup arrangements will be confirmed by the operator.'],
  ['Can I request a child seat?', 'Yes. Select the number of baby seats in the booking form. Availability will be confirmed with your booking.'],
  ['How can I change or cancel my booking?', 'Contact us with your booking reference. Any applicable terms will be confirmed by the operator.'],
  ['How will I know my booking is confirmed?', 'After submitting your request, keep the booking reference. The operator will confirm the booking details separately.'],
]

export function FAQPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="pt-32 pb-20 px-margin-page max-w-4xl mx-auto">
        <h1 className="font-display-lg text-display-lg text-admin-primary mb-4">Frequently Asked Questions</h1>
        <p className="text-on-surface-variant mb-8">Answers to common questions about booking a Dalaman airport transfer.</p>
        <section aria-label="Frequently asked questions" className="space-y-3">
          {frequentlyAskedQuestions.map(([question, answer]) => (
            <details key={question} className="rounded-xl border border-outline-variant bg-white p-5">
              <summary className="cursor-pointer font-semibold text-admin-primary">{question}</summary>
              <p className="mt-3 text-on-surface-variant">{answer}</p>
            </details>
          ))}
        </section>
        <Link className="mt-8 inline-flex rounded-lg bg-admin-primary px-8 py-3 font-bold text-white" to="/booking">Book Your Transfer</Link>
      </main>
    </div>
  )
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

        {content === pageContent.contact && (
          <section aria-label="Contact details" className="mt-8 rounded-xl border border-outline-variant bg-white p-6">
            <h2 className="font-title-md text-title-md text-admin-primary mb-4">Contact us</h2>
            <div className="flex flex-col gap-3">
              <a className="text-admin-primary underline underline-offset-4" href="tel:+905555555555">Phone: 0555 555 55 55</a>
              <a className="text-admin-primary underline underline-offset-4" href="mailto:ali_sonmez35@hotmail.com">Email: ali_sonmez35@hotmail.com</a>
            </div>
          </section>
        )}

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
