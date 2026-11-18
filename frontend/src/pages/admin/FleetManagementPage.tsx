import { fleetCatalogue } from '../../features/vehicle-type/fleetCatalogue'
import { Link } from 'react-router-dom'

export function FleetManagementPage() {
  return (
    <section className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-title-lg text-title-lg text-on-surface">Vehicles</h1>
          <p className="mt-1 text-on-surface-variant">
            Vehicle categories displayed on the public Vehicles page. Equipment and availability require confirmation.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-white px-4 py-2 font-bold text-admin-primary hover:bg-surface-container-low"
          to="/vehicles"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          View customer website
        </Link>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        These are the six vehicle categories shown on the public Vehicles page.
        Availability and individual vehicle assignments are not tracked here yet.
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {fleetCatalogue.map((vehicle) => (
          <article className="glass-card min-w-0 overflow-hidden rounded-xl" key={vehicle.name}>
            <div aria-hidden="true" className="h-52 w-full bg-surface-container-low" />
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
