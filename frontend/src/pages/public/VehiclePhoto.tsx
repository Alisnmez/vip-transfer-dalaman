import { useState } from 'react'
import { useLanguage } from '../../shared/localization/language'

const photoCopy = {
  en: {
    interior: 'Interior',
    exterior: 'Exterior',
    showInterior: (name: string) => `Show ${name} interior`,
    showExterior: (name: string) => `Show ${name} exterior`,
    interiorAlt: (name: string) => `${name} interior (illustrative vehicle)`,
    exteriorAlt: (name: string) => `${name} exterior (illustrative vehicle)`,
  },
  de: {
    interior: 'Innenraum',
    exterior: 'Außenansicht',
    showInterior: (name: string) => `Innenraum von ${name} anzeigen`,
    showExterior: (name: string) => `Außenansicht von ${name} anzeigen`,
    interiorAlt: (name: string) => `${name} – Innenraum (Beispielfahrzeug)`,
    exteriorAlt: (name: string) => `${name} – Außenansicht (Beispielfahrzeug)`,
  },
  ru: {
    interior: 'Салон',
    exterior: 'Внешний вид',
    showInterior: (name: string) => `Показать салон ${name}`,
    showExterior: (name: string) => `Показать внешний вид ${name}`,
    interiorAlt: (name: string) => `${name} — салон (пример автомобиля)`,
    exteriorAlt: (name: string) => `${name} — внешний вид (пример автомобиля)`,
  },
}

const exteriorPhotos: Record<string, { src: string; objectPosition?: string }> = {
  'vip-minivan': { src: '/images/vehicles/vip-vito-exterior.webp', objectPosition: 'center 65%' },
  maybach: { src: '/images/vehicles/ultra-vip-vito-exterior.webp', objectPosition: 'center 75%' },
  'minibus-long': { src: '/images/vehicles/sprinter-exterior.webp', objectPosition: 'center 75%' },
  'vip-minibus': { src: 'https://images.openai.com/static-rsc-4/WXj0fuvQAfOtVK8odHp02IsYdtwd3m2fAqJHWxU8Gi3LkAN87N_0c9ujfSIA8UjN7Ul47vIywsQ0dY1kPYHc4NEilgxnj1eWbphX5N23eUf20SErIAhPW_VHKWno2qduwwIjXBzV7UnQIdTgdRcEeWpxzIh-FdpdUe_foEzpHjE?purpose=inline' },
}
const interiorPhotos: Record<string, string | undefined> = {
  // VIP Tours İstanbul cabin photo for staging review.
  'vip-minivan': 'https://cdn.viptoursistanbul.com/images/vehicles/06dfb4d9-4c22-4ac6-bd9a-f6ff325264c0.jpeg',
  maybach: 'https://images.openai.com/static-rsc-4/dgnQ8mUxYj0E690E_lgfRUhVi9f-Eq49wZSkASjf-i1m09Tix4UCrvwCoPX1ZaVV1pgSV9O1ikB73O78oOtoh2AQTWRdifQqr_M7v1XnioLDBUiVjUtza5FTSTIc9bMTp6WJ10ZGjc4mwnHI9YIEcIxT7ulehJbR11pIKuijiM8?purpose=inline',
  'minibus-long': 'https://images.openai.com/static-rsc-4/P8zBkyzCa7LiMCCGoUN0H83sVEA7Rh4vu8skHeGA5-e9_q3Sk3nVGoQjOsNjzMBMyR5poBxmf2ICiXOcZ_Fz3MroRpu0voSYYgq6j1UpJqKOGxuQAgeZWEIQy6xMGdkpgLMJ4atQiyhfypJS6CjBe9iwp-JuWLZoWfxti6eVW0s?purpose=inline',
  'vip-minibus': 'https://images.openai.com/static-rsc-4/BXMV8Z-26W5EFttaDizoMzDjMyHFHezu0hvoBfSUTKQdaSr1DeK7vTia_VgabJP1ujPdatL0GSGOnezHD5V837NiuBEZqFvNC1xP6QbzUd1p9CkE4e3mNh0GDXLRGf_vwcX78WfS0oCmJOBOnBp_2l-7JZ_k2meGmqGh47_eFSc?purpose=inline',
}

export function VehiclePhoto({ vehicleId, name, className = 'h-56', showToggle = true }: { vehicleId: string; name: string; className?: string; showToggle?: boolean }) {
  const { language } = useLanguage()
  const copy = photoCopy[language]
  const [showInterior, setShowInterior] = useState(false)
  const [previewInterior, setPreviewInterior] = useState(false)
  const [exteriorFailed, setExteriorFailed] = useState(false)
  const [interiorFailed, setInteriorFailed] = useState(false)
  const exterior = exteriorPhotos[vehicleId]
  const interior = interiorPhotos[vehicleId]
  const interiorVisible = Boolean(interior && !interiorFailed && (showInterior || previewInterior))
  return (
    <div className={`relative w-full overflow-hidden bg-slate-100 ${className}`}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setPreviewInterior(true) }}
      onPointerLeave={() => setPreviewInterior(false)}>
      {exterior && !exteriorFailed ? (
        <img src={exterior.src} alt={copy.exteriorAlt(name)} aria-hidden={interiorVisible} loading="lazy" decoding="async"
          style={{ objectPosition: exterior.objectPosition }}
          onError={() => setExteriorFailed(true)} className="h-full w-full object-cover" />
      ) : <div className="flex h-full items-center justify-center text-sm text-slate-500">{name}</div>}
      {interior && !interiorFailed && <img src={interior} alt={copy.interiorAlt(name)} aria-hidden={!interiorVisible} loading="lazy" decoding="async"
        onError={() => setInteriorFailed(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${interiorVisible ? 'opacity-100' : 'opacity-0'}`} />}
      {interior && !interiorFailed && showToggle && <button type="button" aria-label={showInterior ? copy.showExterior(name) : copy.showInterior(name)}
        aria-pressed={showInterior} onClick={() => { setPreviewInterior(false); setShowInterior(value => !value) }}
        className="absolute bottom-2 right-2 rounded-md bg-black/70 px-3 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        {showInterior ? copy.exterior : copy.interior}
      </button>}
    </div>
  )
}
