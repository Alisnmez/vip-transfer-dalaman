import { supportEmail } from '../../features/booking/support'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

const vehicles = [
  {
    name: 'Mercedes Vito Executive',
    passengers: 7,
    luggage: 6,
    feature: 'Climate control',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv2p8bkO-_AX12JvvsBkxiP_AI8kMYN3CNIcP5D6gR8G8WRTG-PtIQzzdmoLxpMkqX5r6xQ9ARsYFZfMPXgBaUkybXXnwcybZR79Tw5cYctdR4VhGnJ4kKLFwHZ26hzfT2ChEO3b-XI2P_w9awItJ4oIvncn34UqtwH-0LRn7uXaoZEksFZ-zYpPluxOvKclxhYQgBJaDsa0xwCRTrTllrTdrHxxCGEOCijYUacTqc3NJ7NFdlmT4WXVfrBArPpoG6pD3g8_jKiXA',
    amenities: ['Complimentary Refreshments', 'High Speed Wi-Fi', 'Professional Chauffeur'],
  },
  {
    name: 'Corporate Minivan Pro',
    passengers: 9,
    luggage: 10,
    feature: 'On-board media',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsVW7MPfi8TokzykrBOlOa83IL9dMqnkU_VjOTz2LiBhSAX4yWbZNtlmHeYo1IMKiwXsFr6H9SpO5bUZF1KqOGy1dvfOAzduwRcuLneG2QcxGf0fS9K6_iK2X1EWC7M5r-cVlsQ9HYnhQ7vLf6J3XcU0yQOQJ0ZVgZ2One-wMrAE78j96s-F44Oqdg7hP8wwIHM1aLW5toOnex9fH1s11NhKa7X4efDsUaZZzSE22hVqE7F0hCINy-YvMU5Pxg_BWMvPlft6gL27g',
    amenities: ['Premium Leather Seating', 'On-board Workstation', 'Privacy Partition'],
  },
  {
    name: 'Executive Sedan',
    passengers: 3,
    luggage: 3,
    feature: 'Comfort seating',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQNRpwgcupfrZXHII2tiBKFGPwsQaMEy4bDaGTyuSW5oJ2tvlAzWy9g7HFZn9snTInkHZnAPeEXcXiP2UdLMJjGlFOx9AQb77RkqsgwcDq98lwiSSujxth2UMRrL39J1BQLICgrDulP_9wNUdnS3NlZ3WJNjNGVkdrpL03boQESWXy69IX9EOdWOTPO1SioIrrOsqov560Mj8b0z6h0kkD5Cs3Nb__0z8r1WOeZvJV4vNLYJDFcRyp6p3kb9t1Jn0BTUpPKbf0ck0',
    amenities: ['Discreet Service', 'Perfect for Solo Travelers', 'Modern Fleet Models'],
  },
]

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
    title: 'Contact DalamanWay',
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
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-margin-page pb-20 pt-32">
        <header className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-wide text-secondary">Our Vehicles</p>
          <h1 className="mb-4 font-display-lg text-display-lg text-admin-primary">Professional Transfer Vehicles</h1>
          <p className="text-lg text-on-surface-variant">
            Explore our vehicle categories and choose the right option for your transfer.
            Vehicle availability and final details are confirmed with your booking.
          </p>
        </header>
        <section aria-label="Vehicle categories" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <article className="overflow-hidden rounded-xl border border-outline-variant bg-white shadow-sm" key={vehicle.name}>
              <img alt={vehicle.name} className="h-56 w-full object-cover" loading="lazy" src={vehicle.image} />
              <div className="space-y-4 p-6">
                <h2 className="text-xl font-bold text-admin-primary">{vehicle.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">person</span>{vehicle.passengers} passengers</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">luggage</span>{vehicle.luggage} bags</span>
                </div>
                <p className="text-sm text-on-surface-variant">{vehicle.feature}</p>
                <ul className="space-y-2 text-sm text-on-surface-variant">
                  {vehicle.amenities.map((amenity) => (
                    <li className="flex items-center gap-2" key={amenity}>
                      <span className="material-symbols-outlined text-base text-secondary">check_circle</span>
                      {amenity}
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className="block rounded-lg bg-admin-primary px-5 py-3 text-center font-bold text-white hover:opacity-90">
                  Book This Vehicle Category
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
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
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content') ?? null
    const meta = description ?? document.createElement('meta')
    if (!description) {
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    document.title = `${content.title} | DalamanWay`
    meta.setAttribute('content', content.description)
    return () => {
      document.title = previousTitle
      if (previousDescription === null) {
        if (!description) meta.remove()
        else meta.removeAttribute('content')
      } else {
        meta.setAttribute('content', previousDescription)
      }
    }
  }, [content.title, content.description])

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
              <a className="text-admin-primary underline underline-offset-4" href={`mailto:${supportEmail}`}>Email: {supportEmail}</a>
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
