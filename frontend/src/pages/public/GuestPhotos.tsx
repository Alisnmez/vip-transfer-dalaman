import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../shared/localization/language'

import './GuestPhotos.css'

const sources = import.meta.glob<string>('../../assets/guest-photos/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
})
const photos = Object.entries(sources).sort(([first], [second]) => first.localeCompare(second))

const translations = {
  en: { heading: 'Guests on Board', pause: 'Pause guest photos', resume: 'Resume guest photos', more: 'View guest gallery', alt: 'Passengers seated inside a private transfer vehicle' },
  de: { heading: 'Gäste an Bord', pause: 'Fotoband anhalten', resume: 'Fotoband fortsetzen', more: 'Fotogalerie ansehen', alt: 'Fahrgäste im Innenraum eines privaten Transferfahrzeugs' },
  ru: { heading: 'Гости в салоне', pause: 'Остановить прокрутку фото', resume: 'Продолжить прокрутку фото', more: 'Смотреть фотогалерею', alt: 'Пассажиры в салоне автомобиля для индивидуального трансфера' },
}

export function GuestPhotos({ gallery = false }: { gallery?: boolean }) {
  const { language } = useLanguage()
  const [paused, setPaused] = useState(false)
  const { hash } = useLocation()
  const copy = translations[language]
  const headingId = gallery ? 'guest-photo-gallery-heading' : 'guest-photos-heading'

  useEffect(() => {
    if (gallery && photos.length && hash === '#guest-photos') {
      document.getElementById('guest-photos')?.scrollIntoView()
    }
  }, [gallery, hash])

  if (!photos.length) return null

  return (
    <section
      id={gallery ? 'guest-photos' : undefined}
      aria-labelledby={headingId}
      className={gallery ? 'mt-12 scroll-mt-28' : 'bg-background py-stack-lg'}
    >
      <div className={gallery ? undefined : 'mx-auto max-w-container-max px-gutter'}>
        <div className="mb-stack-md flex flex-wrap items-center justify-between gap-3">
          <h2 id={headingId} className="font-headline-lg text-headline-lg text-on-surface">{copy.heading}</h2>
          {!gallery && (
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/reviews#guest-photos" className="font-semibold underline underline-offset-4">{copy.more}</Link>
              {photos.length > 1 && (
                <button type="button" className="guest-photo-pause rounded-lg border border-outline px-3 py-2" onClick={() => setPaused(value => !value)}>
                  {paused ? copy.resume : copy.pause}
                </button>
              )}
            </div>
          )}
        </div>
        <div
          className={gallery ? undefined : 'guest-photo-viewport'}
          data-motion={!gallery && photos.length > 1 && !paused}
          role={gallery ? undefined : 'group'}
          aria-labelledby={gallery ? undefined : headingId}
          tabIndex={gallery ? undefined : 0}
        >
          <div className={gallery ? undefined : 'guest-photo-track'}>
            {(gallery || photos.length === 1 ? [false] : [false, true]).map(duplicate => (
              <ul key={String(duplicate)} aria-hidden={duplicate || undefined}
                className={gallery ? 'grid grid-cols-2 gap-4 md:grid-cols-3' : 'guest-photo-group'}
              >
                {photos.map(([path, src]) => (
                  <li key={path} className="min-w-0">
                    <img src={src} alt={duplicate ? '' : copy.alt} loading="lazy" decoding="async"
                      className="aspect-[4/5] w-full rounded-xl bg-primary/5 object-cover object-[center_58%]" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
