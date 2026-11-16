import { Link } from 'react-router-dom'

import { PublicNavbar } from './PublicNavbar'

export function HomePage() {
  return (
    <>
      <PublicNavbar />

      <header className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary" />
        <div className="relative z-10 max-w-container-max mx-auto px-gutter text-center">
          <h1 className="font-display-lg text-display-lg text-white mb-stack-md max-w-4xl mx-auto">
            Professional Airport Transfers from Dalaman
          </h1>
          <p className="font-body-lg text-body-lg text-white/80 mb-stack-lg max-w-2xl mx-auto">
            Experience reliable, high-performance chauffeur services across the
            Turquoise Coast.
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
            <div className="flex items-center gap-stack-md group">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-outline group-hover:border-secondary transition-all">
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
                <h3 className="font-title-md text-on-surface">Fixed Prices</h3>
                <p className="font-body-md text-on-surface-variant">
                  Transparent pricing with no hidden fees.
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
          <div className="flex justify-between items-end mb-stack-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Our Vehicles
              </h2>
              <p className="text-on-surface-variant mt-2">
                Explore vehicle options for your transfer.
              </p>
            </div>
            <Link className="text-secondary font-bold flex items-center gap-2 group" to="/vehicles">
              View All Vehicles
              <span translate="no" className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
            <div className="professional-card accent-border-left p-6 rounded-xl group transition-all hover:shadow-lg">
              <div className="h-48 mb-6 overflow-hidden rounded-lg">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="Black Mercedes Vito VIP"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv2p8bkO-_AX12JvvsBkxiP_AI8kMYN3CNIcP5D6gR8G8WRTG-PtIQzzdmoLxpMkqX5r6xQ9ARsYFZfMPXgBaUkybXXnwcybZR79Tw5cYctdR4VhGnJ4kKLFwHZ26hzfT2ChEO3b-XI2P_w9awItJ4oIvncn34UqtwH-0LRn7uXaoZEksFZ-zYpPluxOvKclxhYQgBJaDsa0xwCRTrTllrTdrHxxCGEOCijYUacTqc3NJ7NFdlmT4WXVfrBArPpoG6pD3g8_jKiXA"
                />
              </div>
              <h3 className="font-title-md text-on-surface mb-2">
                Mercedes Vito Executive
              </h3>
              <div className="flex gap-4 mb-4 text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">person</span> 5
                </div>
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">luggage</span> 6
                </div>
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">ac_unit</span> Climate
                </div>
              </div>
              <ul className="text-label-sm text-on-surface-variant space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Complimentary Refreshments
                </li>
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  High Speed Wi-Fi
                </li>
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Professional Chauffeur
                </li>
              </ul>
              <Link to="/booking" className="block text-center w-full py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all">
                Book This Transfer
              </Link>
            </div>

            <div className="professional-card accent-border-left p-6 rounded-xl group transition-all hover:shadow-lg">
              <div className="h-48 mb-6 overflow-hidden rounded-lg">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="VIP Minivan Pro"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsVW7MPfi8TokzykrBOlOa83IL9dMqnkU_VjOTz2LiBhSAX4yWbZNtlmHeYo1IMKiwXsFr6H9SpO5bUZF1KqOGy1dvfOAzduwRcuLneG2QcxGf0fS9K6_iK2X1EWC7M5r-cVlsQ9HYnhQ7vLf6J3XcU0yQOQJ0ZVgZ2One-wMrAE78j96s-F44Oqdg7hP8wwIHM1aLW5toOnex9fH1s11NhKa7X4efDsUaZZzSE22hVqE7F0hCINy-YvMU5Pxg_BWMvPlft6gL27g"
                />
              </div>
              <h3 className="font-title-md text-on-surface mb-2">
                Corporate Minivan Pro
              </h3>
              <div className="flex gap-4 mb-4 text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">person</span> 5
                </div>
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">luggage</span> 6
                </div>
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">tv</span> Media
                </div>
              </div>
              <ul className="text-label-sm text-on-surface-variant space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Premium Leather Seating
                </li>
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  On-board Workstation
                </li>
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Privacy Partition
                </li>
              </ul>
              <Link to="/booking" className="block text-center w-full py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all">
                Book This Transfer
              </Link>
            </div>

            <div className="professional-card accent-border-left p-6 rounded-xl group transition-all hover:shadow-lg">
              <div className="h-48 mb-6 overflow-hidden rounded-lg">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  data-alt="Luxury Executive Sedan"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQNRpwgcupfrZXHII2tiBKFGPwsQaMEy4bDaGTyuSW5oJ2tvlAzWy9g7HFZn9snTInkHZnAPeEXcXiP2UdLMJjGlFOx9AQb77RkqsgwcDq98lwiSSujxth2UMRrL39J1BQLICgrDulP_9wNUdnS3NlZ3WJNjNGVkdrpL03boQESWXy69IX9EOdWOTPO1SioIrrOsqov560Mj8b0z6h0kkD5Cs3Nb__0z8r1WOeZvJV4vNLYJDFcRyp6p3kb9t1Jn0BTUpPKbf0ck0"
                />
              </div>
              <h3 className="font-title-md text-on-surface mb-2">
                Executive Sedan
              </h3>
              <div className="flex gap-4 mb-4 text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">person</span> 3
                </div>
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">luggage</span> 3
                </div>
                <div className="flex items-center gap-1">
                  <span translate="no" className="material-symbols-outlined text-sm">chair</span> Comfort
                </div>
              </div>
              <ul className="text-label-sm text-on-surface-variant space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Discreet Service
                </li>
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Perfect for Solo Travelers
                </li>
                <li className="flex items-center gap-2">
                  <span translate="no" className="material-symbols-outlined text-secondary text-xs">
                    check_circle
                  </span>
                  Modern Fleet Models
                </li>
              </ul>
              <Link to="/booking" className="block text-center w-full py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all">
                Book This Transfer
              </Link>
            </div>
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
                  FREQUENT SERVICE
                </span>
                <h3 className="font-display-lg text-3xl text-white mb-2">
                  Dalaman to Fethiye
                </h3>
                <p className="text-white/80 mb-4">
                  Daily private transfers to Fethiye Business Districts and Marina.
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
              Book Online Now
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
              VIP Transfer Dalaman
            </div>
            <div className="flex flex-wrap gap-stack-lg">
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/services">Services</Link>
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/vehicles">Vehicles</Link>
              <Link className="text-white/60 hover:text-white transition-colors font-body-md" to="/contact">Contact Us</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pb-stack-md">
            <a className="text-white/80 hover:text-white underline underline-offset-4" href="tel:+905555555555">0555 555 55 55</a>
            <a className="text-white/80 hover:text-white underline underline-offset-4" href="mailto:ali_sonmez35@hotmail.com">ali_sonmez35@hotmail.com</a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-stack-md">
            <p className="text-white/40 font-body-md">
              © {new Date().getFullYear()} VIP Transfer Dalaman. All rights reserved.
            </p>

          </div>
        </div>
      </footer>
    </>
  )
}
