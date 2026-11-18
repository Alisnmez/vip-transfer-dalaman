import { supportEmail } from '../../features/booking/support'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

export function HomePage() {
  useEffect(() => {
    const previousTitle = document.title
    const existingMeta = document.querySelector('meta[name="description"]')
    const previousDescription = existingMeta?.getAttribute('content') ?? null
    const meta = existingMeta ?? document.createElement('meta')
    if (!existingMeta) {
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    document.title = 'Dalaman Airport Private Transfers | DalamanWay'
    meta.setAttribute('content', 'Book private transfers from Dalaman Airport to Fethiye, Gocek, Marmaris and Oludeniz. Explore routes and arrange your airport pickup.')
    return () => {
      document.title = previousTitle
      if (!existingMeta) meta.remove()
      else if (previousDescription === null) meta.removeAttribute('content')
      else meta.setAttribute('content', previousDescription)
    }
  }, [])

  return (
    <>
      <PublicNavbar />

      <header className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
        <div className="relative z-10 w-full min-w-0 max-w-container-max mx-auto px-gutter text-center">
          <h1 className="font-display-lg text-display-lg text-white mb-stack-md max-w-4xl mx-auto">
            Professional Airport Transfers from Dalaman
          </h1>
          <p className="font-body-lg text-body-lg text-white/80 mb-stack-lg max-w-2xl mx-auto">
            Request a private airport transfer across the Turquoise Coast. Review your route and vehicle options before submitting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-stack-md">
            <Link
              className="bg-secondary text-on-secondary px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
              to="/booking"
            >
              Book Now
            </Link>
            <Link
              className="bg-white/10 border border-white/30 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/15 transition-colors"
              to="/routes"
            >
              View Routes & Prices
            </Link>
          </div>
        </div>
      </header>

      <section className="py-stack-lg bg-white border-b border-outline">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            <div className="flex min-w-0 items-center gap-stack-md group">
              <div className="w-16 h-16 shrink-0 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
                <span translate="no" className="material-symbols-outlined text-primary text-3xl">
                  support_agent
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-on-surface">Booking Assistance</h3>
                <p className="font-body-md text-on-surface-variant">
                  Send your transfer details with your booking request.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-stack-md group">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
                <span translate="no" className="material-symbols-outlined text-primary text-3xl">
                  payments
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-on-surface">Route Price Estimates</h3>
                <p className="font-body-md text-on-surface-variant">
                  Review the published route estimate before sending your request.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-stack-md group">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
                <span translate="no" className="material-symbols-outlined text-primary text-3xl">
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-on-surface">
                  Professional Drivers
                </h3>
                <p className="font-body-md text-on-surface-variant">
                  Vehicle options for private airport transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Our Vehicles
              </h2>
              <p className="text-on-surface-variant mt-2">
                Explore vehicle options for your transfer.
              </p>
            </div>
            <Link className="text-secondary font-bold flex items-center gap-2 group self-start shrink-0" to="/vehicles">
              View All Vehicles
              <span translate="no" className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            {[
              { title: 'Private Car', icon: 'local_taxi', detail: 'Choose a private car category for your transfer request.' },
              { title: 'Private Minivan', icon: 'directions_car', detail: 'Select a minivan category and enter your passenger and luggage needs.' },
              { title: 'Group Transfer', icon: 'airport_shuttle', detail: 'Check available group vehicle categories in the booking form.' },
            ].map((vehicle) => (
              <article key={vehicle.title} className="professional-card accent-border-left min-w-0 p-6 rounded-xl">
                <div className="h-32 min-w-0 mb-6 rounded-lg bg-primary/5 flex items-center justify-center overflow-hidden">
                  <span translate="no" className="material-symbols-outlined block max-w-full overflow-hidden whitespace-nowrap text-primary text-6xl">{vehicle.icon}</span>
                </div>
                <h3 className="font-title-md text-on-surface mb-2">{vehicle.title}</h3>
                <p className="text-on-surface-variant mb-6">{vehicle.detail}</p>
                <Link to="/booking" className="block text-center w-full py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all">
                  View Options &amp; Prices
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-outline" id="routes">
        <div className="max-w-container-max mx-auto px-gutter">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-stack-lg">
            Preferred Routes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-stack-md h-auto md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-alt="Fethiye Marina"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOK1KM9F2Y7leTkTeOhHhnk3VW5SYz7VSpbtXEDc0wp2tByE7Ri26sDHSSF2pw2VMvlqpkHiwYswfRKKIKXYOcZ6oZAL6djRVTXN6hX563nv9I90K-aDDZhqhug7ij3oMrV9SYc_aitmhgiZu2GLn5DxFhE7G3aZBTSwBYeRQNNaoaO1bXa1f3lb27SbvzUZZ1_aGUZVjylaMPe04cScc8j3VEKcLM43VaDaDj_P2lKPwbhgZoiZu-mzXAC_hNdZAoF0wgGzjUVlY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-lg">
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-label-sm font-bold mb-2 inline-block">
                  DALAMAN ROUTE
                </span>
                <h3 className="font-display-lg text-3xl text-white mb-2">
                  Dalaman to Fethiye
                </h3>
                <p className="text-white/80 mb-4">
                  Request a private transfer to Fethiye and review your route price.
                </p>
                <div className="text-secondary font-bold text-2xl">View prices when booking</div>
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-alt="Gocek"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOoevwDWp2dwsb3kyAbOt18NiYyZnU-otp8oMvvN0dAop3O0F7d7R1p5TZ4oVhIn__oejP4s-CbC4cfdF2YENvwyxPgoYrBe16j-mf95TaokOcp1y1ULaDK0GIGCcRvZ7Fi59650xA9EYYj44NFBhopQPjcD6J7iUOqiU6FZZQ4lwAlLB-n7CwE0YKWRbX2wfVtPyUy_SquSFJF_aEI-B-Is7qPe9Xf2PF8lYCAbdYnF6VOacrL5qNgZD9iDZ3_Y0t1j_XPaYmmog"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-md">
                <h3 className="font-headline-lg text-2xl text-white mb-1">
                  Dalaman to Gocek
                </h3>
                <div className="text-secondary font-bold">View prices when booking</div>
              </div>
            </div>

            <div className="md:col-span-1 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-alt="Marmaris"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7Q8VhPQ9vxEnZPMQlxFOH5Bq6VI3ircpXbpY8zDjl1oP6yWyHuIXDvjHdwGEGb-yqm1NG7eOgJVexdTGpecalboFhK83kZuUAkT8GP-Td1bskh-f5Bh9iyy5k_PtJNGSMpq8rdrjnr33ToG3EsT0zQbhhFzzYZuTUIgktHADpsgbw6H7T1CgcvnGrDoJr81uaylbrRxq27QLggC8yoYmnDS8iBkmtKf2t0Eod6filBbv6dFTaw2cnSM2VcaZSXAeu8Igbn3gaZdQ"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-md">
                <h3 className="font-title-md text-white mb-1">Marmaris</h3>
                <div className="text-secondary font-bold">View prices when booking</div>
              </div>
            </div>

            <div className="md:col-span-1 relative rounded-xl overflow-hidden group border border-outline">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                data-alt="Oludeniz"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_vr3fHpQP68Kr_7f-l5syaEf7PxR1Hue-_7S_uD6j-gn9C-pPTe8wKnpfBmP1hrUkLiNuZS1OHHXpUg44cRKzxadh2qEd_pz2F9UgBhFc-gVQOhJNgiTKVoz4RsKm9Cm5lFAYSSW85xACWUQKyB08bfL7182edAJ7veOc3D1UYSvQMJ7Z5xeBxaelrhLIUhc6fq-IdU4UUzeu0OHaoLXtdQip1-7jr8m7hWwOmCipDgwWtbjSbm6vJPTw73xFAactfoPYHLQnDAE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-stack-md">
                <h3 className="font-title-md text-white mb-1">Oludeniz</h3>
                <div className="text-secondary font-bold">View prices when booking</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative bg-background">
        <div className="max-w-container-max mx-auto px-gutter text-center relative z-10">
          <h2 className="font-display-lg text-display-lg text-on-surface mb-stack-md">
            Ready for a Seamless Journey?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-lg max-w-xl mx-auto">
            Send your transfer request online and review the route price before submitting.
          </p>
          <div className="flex flex-col md:flex-row gap-stack-md justify-center">
            <Link to="/booking" className="bg-primary text-white px-12 py-4 rounded-lg font-bold text-lg hover:shadow-lg transition-all">
              Request a Transfer
            </Link>
            <Link to="/contact" className="bg-white border border-outline text-on-surface px-12 py-4 rounded-lg font-bold text-lg hover:border-secondary transition-all flex items-center justify-center gap-2">
              <span translate="no" className="material-symbols-outlined text-secondary">chat</span>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-primary border-t border-primary/20 py-stack-lg">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-lg mb-stack-lg">
            <div className="font-headline-lg text-headline-lg text-white font-bold">
              DalamanWay
            </div>
            <div className="flex flex-wrap gap-stack-lg">
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/services">Services</Link>
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/vehicles">Vehicles</Link>
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/faq">FAQ</Link>
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/reviews">Customer Reviews</Link>
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/contact">Contact Us</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pb-stack-md">
            <a className="text-white/80 hover:text-white underline underline-offset-4" href="tel:+905555555555">0555 555 55 55</a>
            <a className="text-white/80 hover:text-white underline underline-offset-4" href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-stack-md">
            <p className="text-white/40 font-body-md">
              © {new Date().getFullYear()} DalamanWay. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </>
  )
}
