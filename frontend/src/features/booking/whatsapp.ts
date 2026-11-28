const destinations: Record<string, string> = { marmaris: 'Marmaris', fethiye: 'Fethiye', oludeniz: 'Ölüdeniz', gocek: 'Göcek', icmeler: 'İçmeler', dalyan: 'Dalyan', sarigerme: 'Sarigerme' }

const whatsappCopy = {
  en: { help: 'Need help? Chat with us', chat: 'Chat on WhatsApp', label: 'Chat with DalamanWay on WhatsApp (opens in a new tab)', route: "Hello DalamanWay! I'd like information about transfers to ", vehicles: "Hello DalamanWay! I'd like to know more about your VIP vehicles.", general: 'Hello DalamanWay! I would like some assistance.' },
  de: { help: 'Brauchen Sie Hilfe?', chat: 'Chat auf WhatsApp', label: 'DalamanWay auf WhatsApp kontaktieren (öffnet einen neuen Tab)', route: 'Hallo DalamanWay! Ich möchte Informationen zu Transfers nach ', vehicles: 'Hallo DalamanWay! Ich möchte mehr über Ihre VIP-Fahrzeuge erfahren.', general: 'Hallo DalamanWay! Ich benötige Unterstützung.' },
  ru: { help: 'Нужна помощь?', chat: 'Написать в WhatsApp', label: 'Связаться с DalamanWay в WhatsApp (откроется новая вкладка)', route: 'Здравствуйте, DalamanWay! Хотелось бы узнать о трансферах в ', vehicles: 'Здравствуйте, DalamanWay! Хотелось бы узнать больше о ваших VIP-автомобилях.', general: 'Здравствуйте, DalamanWay! Мне нужна помощь.' },
}

export { whatsappCopy }

export function whatsappLink(number: string, pathname: string, language: keyof typeof whatsappCopy): string | null {
  if (!/^[1-9][0-9]{7,14}$/.test(number)) return null
  const copy = whatsappCopy[language]
  const slug = /\/routes\/([a-z]+)\/?$/.exec(pathname)?.[1]
  const destination = slug ? destinations[slug] : undefined
  const message = destination ? copy.route + destination + '.' : pathname === '/vehicles' ? copy.vehicles : copy.general
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(message)
}

export function showFloatingWhatsApp(pathname: string): boolean {
  return !/^\/booking(?:\/|$)/.test(pathname)
}
