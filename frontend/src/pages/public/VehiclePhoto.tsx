import { useState } from 'react'

// Review-only references supplied by the project owner. Replace with licensed,
// locally hosted images before production. These CDN URLs may expire.
const exteriorPhotos: Record<string, string> = {
  "vip-minivan": "https://images.openai.com/static-rsc-4/-RS8FRs6GidybdzW-Zo_o4eGPwBZKeYTZ7P0uidrPSt2f1Fxm5n85jFtgZYoRKrjlTh7Zv1L1BIMHpA5nkMaAJg7lRFGeVzWH59_NcKCkdx7du1nFPC644rvaxo70t-G5ri4zw5bZ6iw-QEngpDm824Sard_L6u8hIjmCRyrd2g?purpose=inline",
  "maybach": "https://images.openai.com/static-rsc-4/DZcP4gyqeA8GMylHWO79ok3PzKseaM_s2EvCYTZRYuRCBIiIMgeNrgBBoEcCZoYJU2e-TCAFkDYfkBoW8s1_trPyWkTpAZLcoini0lHfl7FkoEXz-v4fUrWAqUxW5jX42EljQsVBK_ilSh5WfFF3LY4qZnhiJOWYm1NQPaQPqeE?purpose=inline",
  "minibus-long": "https://images.openai.com/static-rsc-4/vaVb-vKHfvA-D1tt2Bc5_iW2t4nEdHmMXHFMbvY84tDnov02aNTpVS0SM96o510y442kw-M-Zn24YpkmgkOmkLV_DAa5ujt8p0680R1hkhFff9zUDTlOsUHHlj85Zu15HzKSHx8g3S7oaC2G-bbZY-A1AD66_2JmsPYz7U_g4KE?purpose=inline",
  "vip-minibus": "https://images.openai.com/static-rsc-4/WXj0fuvQAfOtVK8odHp02IsYdtwd3m2fAqJHWxU8Gi3LkAN87N_0c9ujfSIA8UjN7Ul47vIywsQ0dY1kPYHc4NEilgxnj1eWbphX5N23eUf20SErIAhPW_VHKWno2qduwwIjXBzV7UnQIdTgdRcEeWpxzIh-FdpdUe_foEzpHjE?purpose=inline"
}
const interiorPhotos: Record<string, string | undefined> = {
  // VIP Tours İstanbul cabin photo for staging review.
  'vip-minivan': 'https://cdn.viptoursistanbul.com/images/vehicles/06dfb4d9-4c22-4ac6-bd9a-f6ff325264c0.jpeg',
  maybach: 'https://images.openai.com/static-rsc-4/dgnQ8mUxYj0E690E_lgfRUhVi9f-Eq49wZSkASjf-i1m09Tix4UCrvwCoPX1ZaVV1pgSV9O1ikB73O78oOtoh2AQTWRdifQqr_M7v1XnioLDBUiVjUtza5FTSTIc9bMTp6WJ10ZGjc4mwnHI9YIEcIxT7ulehJbR11pIKuijiM8?purpose=inline',
  'minibus-long': 'https://images.openai.com/static-rsc-4/P8zBkyzCa7LiMCCGoUN0H83sVEA7Rh4vu8skHeGA5-e9_q3Sk3nVGoQjOsNjzMBMyR5poBxmf2ICiXOcZ_Fz3MroRpu0voSYYgq6j1UpJqKOGxuQAgeZWEIQy6xMGdkpgLMJ4atQiyhfypJS6CjBe9iwp-JuWLZoWfxti6eVW0s?purpose=inline',
  'vip-minibus': 'https://images.openai.com/static-rsc-4/BXMV8Z-26W5EFttaDizoMzDjMyHFHezu0hvoBfSUTKQdaSr1DeK7vTia_VgabJP1ujPdatL0GSGOnezHD5V837NiuBEZqFvNC1xP6QbzUd1p9CkE4e3mNh0GDXLRGf_vwcX78WfS0oCmJOBOnBp_2l-7JZ_k2meGmqGh47_eFSc?purpose=inline',
}

export function VehiclePhoto({ vehicleId, name, className = 'h-56', showToggle = true }: { vehicleId: string; name: string; className?: string; showToggle?: boolean }) {
  const [showInterior, setShowInterior] = useState(false)
  const [previewInterior, setPreviewInterior] = useState(false)
  const [exteriorFailed, setExteriorFailed] = useState(false)
  const [interiorFailed, setInteriorFailed] = useState(false)
  const exterior = exteriorPhotos[vehicleId]
  const interior = interiorPhotos[vehicleId]
  return (
    <div className={`relative w-full overflow-hidden bg-slate-100 ${className}`}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setPreviewInterior(true) }}
      onPointerLeave={() => setPreviewInterior(false)}>
      {exterior && !exteriorFailed ? (
        <img src={exterior} alt={`${name} exterior (illustrative vehicle)`} loading="lazy" decoding="async"
          onError={() => setExteriorFailed(true)} className="h-full w-full object-cover" />
      ) : <div className="flex h-full items-center justify-center text-sm text-slate-500">{name}</div>}
      {interior && !interiorFailed && <img src={interior} alt="" aria-hidden="true" loading="lazy" decoding="async"
        onError={() => setInteriorFailed(true)}
        className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${showInterior || previewInterior ? 'opacity-100' : 'opacity-0'}`} />}
      {interior && !interiorFailed && showToggle && <button type="button" aria-label={showInterior ? `Show ${name} exterior` : `Show ${name} interior`}
        aria-pressed={showInterior} onClick={() => { setPreviewInterior(false); setShowInterior(value => !value) }}
        className="absolute bottom-2 right-2 rounded-md bg-black/70 px-3 py-2 text-xs font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
        {showInterior ? 'Exterior' : 'Interior'}
      </button>}
    </div>
  )
}
