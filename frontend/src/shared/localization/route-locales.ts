export const routeLanguages = ['en', 'de', 'ru'] as const
type RouteLanguage = typeof routeLanguages[number]

export const localizedRouteCopy = {
  marmaris: {
    destination: 'Marmaris(Any Hotel)',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Marmaris', intro: 'Marmaris ist ein Badeort mit Hotels, Jachthafen und belebter Uferpromenade. Geben Sie bei der Anfrage Ihre genaue Zieladresse an.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Мармарис', intro: 'Мармарис — курорт с отелями, яхтенной гаванью и оживлённой набережной. Укажите точный адрес при оформлении заявки.' },
  },
  gocek: {
    destination: 'Gocek',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Göcek', intro: 'Göcek liegt am Golf von Fethiye und ist für seine Jachthäfen bekannt. Geben Sie bei der Anfrage den Jachthafen oder das Hotel an.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Гёджек', intro: 'Гёджек расположен в заливе Фетхие и известен яхтенными гаванями. Укажите название гавани или отеля в заявке.' },
  },
} as const

export const routeLanguageLabels = {
  en: { name: 'English', arrival: 'Where should we drop you off?', booking: 'Request a transfer' },
  de: { name: 'Deutsch', arrival: 'Wo sollen wir Sie absetzen?', booking: 'Transfer anfragen' },
  ru: { name: 'Русский', arrival: 'Где вас высадить?', booking: 'Заказать трансфер' },
} as const

export function isLocalizedRoute(slug: string): slug is keyof typeof localizedRouteCopy {
  return Object.hasOwn(localizedRouteCopy, slug)
}

export function routeLanguagePath(slug: string, language: RouteLanguage): string {
  const prefix = language !== 'en' && isLocalizedRoute(slug) ? `/${language}` : ''
  return `${prefix}/routes/${slug}`
}

export function matchLocalizedRoute(pathname: string) {
  const match = /^(?:\/(de|ru))?\/routes\/([a-z]+)\/?$/.exec(pathname)
  if (!match || !isLocalizedRoute(match[2])) return null
  const slug = match[2]
  const language = (match[1] ?? 'en') as RouteLanguage
  return { slug, language, copy: language === 'en' ? undefined : localizedRouteCopy[slug][language] }
}

export function routeAlternates(slug: string) {
  return [...routeLanguages, 'x-default' as const].map(language => ({
    language,
    path: routeLanguagePath(slug, language === 'x-default' ? 'en' : language),
  }))
}
