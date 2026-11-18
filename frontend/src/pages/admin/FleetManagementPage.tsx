import { Link } from 'react-router-dom'

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

export function FleetManagementPage() {
  return (
    <section className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-title-lg text-title-lg text-on-surface">Vehicles</h1>
          <p className="mt-1 text-on-surface-variant">
            Vehicle categories displayed to customers on the homepage.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-4 py-2 font-bold text-admin-primary hover:bg-surface-container-low"
          to="/"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          View customer website
        </Link>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        These are the three vehicle categories shown on the public homepage.
        Availability and individual vehicle assignments are not tracked here yet.
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((vehicle) => (
          <article className="glass-card min-w-0 overflow-hidden rounded-xl" key={vehicle.name}>
            <img
              alt={vehicle.name}
              className="h-52 w-full object-cover"
              loading="lazy"
              src={vehicle.image}
            />
            <div className="space-y-4 p-5">
              <h2 className="font-title-md text-title-md text-on-surface">{vehicle.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">person</span>
                  {vehicle.passengers} passengers
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">luggage</span>
                  {vehicle.luggage} bags
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">{vehicle.feature}</p>
              <ul className="space-y-2 text-sm text-on-surface-variant">
                {vehicle.amenities.map((amenity) => (
                  <li className="flex items-center gap-2" key={amenity}>
                    <span className="material-symbols-outlined text-base text-secondary">
                      check_circle
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
