import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../../shared/localization/language'

const sources = import.meta.glob<string>('../../assets/guest-photos/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
})
const photos = Object.entries(sources).sort(([first], [second]) => first.localeCompare(second))

const translations = {
  en: { heading: 'Guests on Board', more: 'View guest gallery', alt: 'Passengers seated inside a private transfer vehicle' },
  de: { heading: 'Gäste an Bord', more: 'Fotogalerie ansehen', alt: 'Fahrgäste im Innenraum eines privaten Transferfahrzeugs' },
  ru: { heading: 'Гости в салоне', more: 'Смотреть фотогалерею', alt: 'Пассажиры в салоне автомобиля для индивидуального трансфера' },
}

export function GuestPhotos({ gallery = false }: { gallery?: boolean }) {
  const { language } = useLanguage()
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
            <Link to="/reviews#guest-photos" className="font-semibold underline underline-offset-4">{copy.more}</Link>
          )}
        </div>
        <ul className={gallery
          ? 'grid grid-cols-2 gap-4 md:grid-cols-3'
          : 'grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-fr md:overflow-visible'}
          tabIndex={gallery ? undefined : 0}
          aria-labelledby={headingId}
        >
          {(gallery ? photos : photos.slice(0, 3)).map(([path, src]) => (
            <li key={path} className="min-w-0 snap-start">
              <img src={src} alt={copy.alt} loading="lazy" decoding="async"
                className="aspect-[4/5] w-full rounded-xl bg-primary/5 object-cover object-[center_58%]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
