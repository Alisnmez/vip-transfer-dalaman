import { fleetCatalogue } from '../../features/vehicle-type/fleetCatalogue'
import { useState } from 'react'
import { useLanguage } from '../../shared/localization/language'

const photoCopy = {
  en: {
    interior: 'Interior',
    exterior: 'Exterior',
    showInterior: (name: string) => `Show ${name} interior`,
    showExterior: (name: string) => `Show ${name} exterior`,
    interiorAlt: (name: string) => `${name} interior`,
    exteriorAlt: (name: string) => `${name} exterior`,
  },
  de: {
    interior: 'Innenraum',
    exterior: 'Außenansicht',
    showInterior: (name: string) => `Innenraum von ${name} anzeigen`,
    showExterior: (name: string) => `Außenansicht von ${name} anzeigen`,
    interiorAlt: (name: string) => `${name} – Innenraum`,
    exteriorAlt: (name: string) => `${name} – Außenansicht`,
  },
  ru: {
    interior: 'Салон',
    exterior: 'Внешний вид',
    showInterior: (name: string) => `Показать салон ${name}`,
    showExterior: (name: string) => `Показать внешний вид ${name}`,
    interiorAlt: (name: string) => `${name} — салон`,
    exteriorAlt: (name: string) => `${name} — внешний вид`,
  },
}

export function VehiclePhoto({ vehicleId, name, className = '', showToggle = true, exteriorOnly = false }: { vehicleId: string; name: string; className?: string; showToggle?: boolean; exteriorOnly?: boolean }) {
  const { language } = useLanguage()
  const copy = photoCopy[language]
  const [showInterior, setShowInterior] = useState(false)
  const [exteriorFailed, setExteriorFailed] = useState(false)
  const [interiorFailed, setInteriorFailed] = useState(false)
  const vehicle = fleetCatalogue.find(item => item.bookingVehicleId === vehicleId)
  const exterior = vehicle?.exteriorPhoto
  const interior = exteriorOnly ? undefined : vehicle?.interiorPhoto
  const interiorVisible = Boolean(interior && !interiorFailed && showInterior)
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="relative aspect-[3/2] w-full bg-slate-100">
      {exterior && !exteriorFailed ? (
        <img src={exterior} alt={copy.exteriorAlt(name)} aria-hidden={interiorVisible} loading="lazy" decoding="async"
          onError={() => setExteriorFailed(true)} className="h-full w-full object-contain" />
      ) : <div className="flex h-full items-center justify-center text-sm text-slate-500">{name}</div>}
      {interior && !interiorFailed && <img src={interior} alt={copy.interiorAlt(name)} aria-hidden={!interiorVisible} loading="lazy" decoding="async"
        onError={() => setInteriorFailed(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${interiorVisible ? 'opacity-100' : 'opacity-0'}`} />}
      </div>
      <div className="flex items-center justify-between gap-2 px-2 py-1">
        {(interiorVisible || (exterior && !exteriorFailed)) && <a href={interiorVisible ? interior : exterior} target="_blank" rel="noopener noreferrer" className="py-2 text-sm font-semibold underline">{({ en: 'View full size', de: 'In voller Größe ansehen', ru: 'Открыть в полном размере' })[language]}</a>}
      {interior && !interiorFailed && showToggle && <button type="button" aria-label={showInterior ? copy.showExterior(name) : copy.showInterior(name)}
        aria-pressed={showInterior} onClick={() => { setShowInterior(value => !value) }}
        className="rounded-md bg-black/70 px-3 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        {showInterior ? copy.exterior : copy.interior}
      </button>}
      </div>
    </div>
  )
}
