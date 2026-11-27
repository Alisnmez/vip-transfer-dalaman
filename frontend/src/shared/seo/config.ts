import { matchLocalizedRoute } from '../localization/route-locales'
import { travelGuides } from '../../content/guides'

/**
 * Single source of truth for public-page SEO.
 * Do not hardcode brand names or domains inside individual pages.
 */
export const seoConfig = {
  brandName: import.meta.env.VITE_SITE_NAME?.trim() || 'Dalaman Airport Transfers',
  siteUrl: (import.meta.env.VITE_PUBLIC_SITE_URL?.trim() || '').replace(/\/$/, ''),
  defaultLocale: 'en_GB',
  defaultDescription:
    'Book private transfers from Dalaman Airport to Marmaris, Fethiye, Oludeniz and more. Compare vehicle options and prices in GBP.',
}

export type SeoPage = {
  title: string
  description: string
  indexable?: boolean
}

export const seoPages: Record<string, SeoPage> = {
  '/': {
    title: 'Dalaman Airport Transfers | Private Airport Taxi & Transfers',
    description: 'Book private Dalaman Airport transfers to Marmaris, Fethiye, Oludeniz and more. Explore vehicles, routes and transparent GBP prices.',
  },
  '/routes': {
    title: 'Dalaman Airport Transfer Routes & Prices',
    description: 'Compare Dalaman Airport transfer prices by destination, vehicle and journey type. Explore private transfers across the Turkish Riviera.',
  },
  '/vehicles': {
    title: 'Private Airport Transfer Vehicles in Dalaman',
    description: 'Explore vehicles for your private Dalaman Airport transfer and choose the option that suits your group and luggage.',
  },
  '/services': {
    title: 'Dalaman Airport Private Transfer Services',
    description: 'Explore private airport transfer services from Dalaman Airport to popular holiday destinations in southwest Turkey.',
  },
  '/contact': {
    title: 'Contact | Dalaman Airport Transfers',
    description: 'Contact our team about private airport transfers from Dalaman Airport, booking details and travel questions.',
  },
  '/faq': {
    title: 'Dalaman Airport Transfer FAQs | DalamanWay',
    description: 'Find answers about Dalaman airport transfer requests, return journeys, flight details, child seats and booking changes.',
  },
  '/reviews': {
    title: 'Customer Reviews | DalamanWay',
    description: 'Learn about customer feedback and how to share your Dalaman airport transfer experience with DalamanWay.',
  },
  '/guides': {
    title: 'Travel Guides for the Turquoise Coast | DalamanWay',
    description: 'Explore original ideas for Marmaris, Fethiye, Kayaköy, Ölüdeniz and Dalyan, then plan a private airport pickup.',
  },
  ...Object.fromEntries(travelGuides.map(guide => [guide.path, {
    title: `${guide.title} | DalamanWay`,
    description: guide.description,
  }])),
  '/booking': { title: 'Book a Dalaman Airport Transfer', description: 'Choose your route, vehicle and travel details to request a private Dalaman Airport transfer.' },
  '/booking/lookup': { title: 'Manage My Booking', description: 'Request a change or cancellation with your booking reference and email address.' },
  '/booking-policy': { title: 'Booking and Cancellation Policy', description: 'Read the conditions for changing or cancelling your Dalaman Airport transfer.' },
}

export function getSeoPage(pathname: string): SeoPage {
  const localized = matchLocalizedRoute(pathname)?.copy
  if (localized) return { title: `${localized.heading} | DalamanWay`, description: localized.intro }
  const normalized = pathname.replace(/\/$/, '') || '/'
  const destinations: Record<string, string> = {
    marmaris: 'Marmaris', fethiye: 'Fethiye', oludeniz: 'Oludeniz', gocek: 'Gocek', icmeler: 'Icmeler', dalyan: 'Dalyan', sarigerme: 'Sarigerme',
  }
  const slug = normalized.match(/^\/routes\/([a-z]+)$/)?.[1]
  if (slug && destinations[slug]) {
    const name = destinations[slug]
    return {
      title: `Dalaman Airport to ${name} Private Transfer | DalamanWay`,
      description: `Plan a private Dalaman Airport to ${name} transfer. Compare available vehicles and request a one-way or return journey.`,
    }
  }
  return seoPages[normalized] || {
    title: 'Dalaman Airport Transfer Booking',
    description: seoConfig.defaultDescription,
    indexable: false,
  }
}

export function getCanonicalUrl(pathname: string): string | null {
  if (!seoConfig.siteUrl || !/^https:\/\/[^/]+$/i.test(seoConfig.siteUrl) || /onrender\.com|localhost|127\.0\.0\.1/i.test(seoConfig.siteUrl)) return null
  const normalized = pathname.replace(/\/$/, '') || '/'
  return `${seoConfig.siteUrl}${normalized === '/' ? '/' : normalized}`
}
