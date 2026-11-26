import { fleetCatalogue } from '../../features/vehicle-type/fleetCatalogue'
import imageVariants from '../../features/vehicle-type/imageVariants.json'
import { useState } from 'react'
import { useLanguage } from '../../shared/localization/language'

const variants: Record<string, { src: string; width: number }[]> = imageVariants
function responsiveSources(src: string, width: number | undefined) {
  const candidates = variants[src]
  if (!width || !candidates?.length) return undefined
  return [...candidates.map(item => `${item.src} ${item.width}w`), `${src} ${width}w`].join(', ')
}

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

export function VehiclePhoto({ vehicleId, name, className = 'h-56', showToggle = true, exteriorOnly = false }: { vehicleId: string; name: string; className?: string; showToggle?: boolean; exteriorOnly?: boolean }) {
  const { language } = useLanguage()
  const copy = photoCopy[language]
  const [showInterior, setShowInterior] = useState(false)
  const [previewInterior, setPreviewInterior] = useState(false)
  const [interiorRequested, setInteriorRequested] = useState(false)
  const [exteriorFailed, setExteriorFailed] = useState(false)
  const [interiorFailed, setInteriorFailed] = useState(false)
  const vehicle = fleetCatalogue.find(item => item.bookingVehicleId === vehicleId)
  const exterior = vehicle?.exteriorPhoto
  const interior = exteriorOnly ? undefined : vehicle?.interiorPhoto
  const interiorVisible = Boolean(interior && !interiorFailed && (showInterior || previewInterior))
  return (
    <div className={`relative w-full overflow-hidden bg-slate-100 ${className}`}
      onPointerEnter={event => { if (interior && event.pointerType === 'mouse') { setInteriorRequested(true); setPreviewInterior(true) } }}
      onPointerLeave={() => setPreviewInterior(false)}>
      {exterior && !exteriorFailed ? (
        <img src={exterior} srcSet={responsiveSources(exterior, vehicle?.exteriorWidth)} sizes="auto, (max-width: 767px) 100vw, 50vw" width={vehicle?.exteriorWidth} height={vehicle?.exteriorHeight} alt={copy.exteriorAlt(name)} aria-hidden={interiorVisible} loading="lazy" decoding="async"
          onError={() => setExteriorFailed(true)} className="h-full w-full object-cover" />
      ) : <div className="flex h-full items-center justify-center text-sm text-slate-500">{name}</div>}
      {interior && !interiorFailed && interiorRequested && <img src={interior} srcSet={responsiveSources(interior, vehicle?.interiorWidth)} sizes="auto, (max-width: 767px) 100vw, 50vw" width={vehicle?.interiorWidth} height={vehicle?.interiorHeight} alt={copy.interiorAlt(name)} aria-hidden={!interiorVisible} loading="lazy" decoding="async"
        onError={() => setInteriorFailed(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${interiorVisible ? 'opacity-100' : 'opacity-0'}`} />}
      {interior && !interiorFailed && showToggle && <button type="button" aria-label={showInterior ? copy.showExterior(name) : copy.showInterior(name)}
        aria-pressed={showInterior} onClick={() => { setInteriorRequested(true); setPreviewInterior(false); setShowInterior(value => !value) }}
        className="absolute bottom-2 right-2 rounded-md bg-black/70 px-3 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        {showInterior ? copy.exterior : copy.interior}
      </button>}
    </div>
  )
}
