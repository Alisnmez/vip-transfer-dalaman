import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getCanonicalUrl, getSeoPage, seoConfig } from './config'
import { matchLocalizedRoute, routeAlternates } from '../localization/route-locales'

function setMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.content = content
}

export function usePageSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const page = getSeoPage(pathname)
    const canonical = getCanonicalUrl(pathname)
    const localized = matchLocalizedRoute(pathname)
    document.title = page.title
    setMeta('description', page.description)
    // The preview environment must never accidentally become indexed.
    setMeta('robots', canonical && page.indexable !== false ? 'index,follow' : 'noindex,nofollow')
    setMeta('og:title', page.title, 'property')
    setMeta('og:description', page.description, 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('og:locale', localized?.language === 'de' ? 'de_DE' : localized?.language === 'ru' ? 'ru_RU' : seoConfig.defaultLocale, 'property')
    setMeta('og:site_name', seoConfig.brandName, 'property')

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (canonical && page.indexable !== false) {
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
      setMeta('og:url', canonical, 'property')
    } else {
      link?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => link.remove())
    if (localized && canonical) {
      for (const { language, path } of routeAlternates(localized.slug)) {
        const alternate = document.createElement('link')
        alternate.rel = 'alternate'
        alternate.hreflang = language
        alternate.href = seoConfig.siteUrl + path
        document.head.appendChild(alternate)
      }
    }
  }, [pathname])
}
