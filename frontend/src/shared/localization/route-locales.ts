export const routeLanguages = ['en', 'de', 'ru'] as const
type RouteLanguage = typeof routeLanguages[number]

export const localizedRouteCopy = {
  marmaris: {
    destination: 'Marmaris(Any Hotel)',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Marmaris', intro: 'Marmaris ist ein Badeort mit Hotels, Jachthafen und belebter Uferpromenade. Geben Sie bei der Anfrage Ihre genaue Zieladresse an.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Мармарис', intro: 'Мармарис — курорт с отелями, яхтенной гаванью и оживлённой набережной. Укажите точный адрес при оформлении заявки.' },
  },
  fethiye: {
    destination: 'Fethiye City Center(Any Hotel)',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Fethiye', intro: 'Planen Sie die Fahrt vom Flughafen zu Ihrer Unterkunft in Fethiye. Für ein Hotel im Stadtzentrum ist das Ziel bereits vorausgewählt. Liegt Ihr Hotel außerhalb des Zentrums, wählen Sie im Formular das passende Ziel.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Фетхие', intro: 'Для поездки в центр Фетхие этот пункт назначения уже выбран в форме. Если ваш отель находится за пределами центра, выберите район отеля при оформлении заявки.' },
  },
  oludeniz: {
    destination: 'Oludeniz(Any Hotel)',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Ölüdeniz', intro: 'Für die Fahrt nach Ölüdeniz können Sie eine einfache Fahrt oder eine Rückfahrt zum Flughafen anfragen. Halten Sie den Namen Ihrer Unterkunft und die Flugnummer für die Buchung bereit.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Олюдениз', intro: 'Для поездки в Олюдениз можно заказать трансфер в одну сторону или сразу указать обратную поездку в аэропорт. При оформлении заявки укажите название отеля и номер рейса.' },
  },
  icmeler: {
    destination: 'Icmeler(Any Hotel)',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach İçmeler', intro: 'Für ein Hotel in İçmeler können Sie die Hinfahrt ab Dalaman und die Rückfahrt ab Hotel zusammen anfragen. Liegt der Abholeingang an einer Seitenstraße, geben Sie ihn im Buchungsformular an.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Ичмелер', intro: 'Для поездки в отель в Ичмелере можно сразу заказать и обратный трансфер. Если вход для посадки находится на боковой улице, уточните его в заявке.' },
  },
  dalyan: {
    destination: 'Dalyan',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Dalyan', intro: 'Für Ihre Fahrt nach Dalyan ist der Zielort im Formular vorausgewählt. Bei einer Pension oder einem Ferienhaus am Fluss hilft der Name der Unterkunft zusammen mit der Straßenadresse.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Дальян', intro: 'Дальян уже выбран в форме как пункт назначения. Если вы едете в гостевой дом или на виллу у реки, добавьте название жилья и адрес для подъезда.' },
  },
  sarigerme: {
    destination: 'Sarigerme',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Sarıgerme', intro: 'Reisen Sie zu einem Strandhotel in Sarıgerme oder zu einer Unterkunft im Ort? Geben Sie das konkrete Fahrtziel an. Für die Rückfahrt lässt sich die Abholzeit gesondert eintragen.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Сарыгерме', intro: 'Укажите, куда вас отвезти в Сарыгерме: к въезду в пляжный отель или по адресу в посёлке. Для обратного трансфера можно отдельно указать время подачи машины.' },
  },
  gocek: {
    destination: 'Gocek',
    de: { heading: 'Privater Transfer vom Flughafen Dalaman nach Göcek', intro: 'Göcek liegt am Golf von Fethiye und ist für seine Jachthäfen bekannt. Geben Sie bei der Anfrage den Jachthafen oder das Hotel an.' },
    ru: { heading: 'Индивидуальный трансфер из аэропорта Даламан в Гёджек', intro: 'Гёджек расположен в заливе Фетхие и известен яхтенными гаванями. Укажите название гавани или отеля в заявке.' },
  },
} as const

export const routeLanguageLabels = {
  en: { name: 'English', fleet: 'Which vehicle fits your group?', vehicle: 'Vehicle', passengers: 'Max. passengers', luggage: 'Max. bags', fare: 'Compare current fares in GBP per vehicle', arrival: 'Where should we drop you off?', booking: 'Request a transfer' },
  de: { name: 'Deutsch', fleet: 'Welches Fahrzeug passt zu Ihrer Gruppe?', vehicle: 'Fahrzeug', passengers: 'Max. Fahrgäste', luggage: 'Max. Gepäckstücke', fare: 'Aktuelle Preise in GBP pro Fahrzeug vergleichen', arrival: 'Wo sollen wir Sie absetzen?', booking: 'Transfer anfragen' },
  ru: { name: 'Русский', fleet: 'Какой автомобиль подойдёт вашей группе?', vehicle: 'Автомобиль', passengers: 'Макс. пассажиров', luggage: 'Макс. мест багажа', fare: 'Сравнить актуальные цены в фунтах за автомобиль', arrival: 'Где вас высадить?', booking: 'Заказать трансфер' },
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
