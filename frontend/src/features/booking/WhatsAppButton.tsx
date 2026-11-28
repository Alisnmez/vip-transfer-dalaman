import { useLanguage } from '../../shared/localization/language'
import { useLocation } from 'react-router-dom'
import { trackAnalyticsEvent } from '../analytics/analytics'

const number = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '37063416424').trim()
import { whatsappCopy, whatsappLink, showFloatingWhatsApp } from './whatsapp'

export function WhatsAppButton({ inline = false }: { inline?: boolean }) {
  const { pathname } = useLocation()
  const { language } = useLanguage()
  const copy = whatsappCopy[language]
  const href = whatsappLink(number, pathname, language)
  if (!href || (!inline && !showFloatingWhatsApp(pathname))) return null
  return (
    <a href={href}
      target="_blank" rel="noopener noreferrer"
      aria-label={copy.label}
      onClick={() => trackAnalyticsEvent('whatsapp_click')}
      className={inline ? 'inline-flex w-fit items-center gap-3 rounded-xl bg-[#12804a] px-4 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4' : 'fixed right-4 bottom-[calc(3rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4'}>
      {!inline && <span className="hidden rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-md md:block">{copy.help}</span>}
      <span className={inline ? 'flex h-7 w-7 items-center justify-center' : 'flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg'}>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M12.04 2a9.94 9.94 0 0 0-8.6 14.92L2 22l5.24-1.38A10 10 0 1 0 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 1 1 6.96 3.84Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.4-.12-.56.13-.17.25-.64.8-.79.96-.14.17-.29.19-.54.07-.25-.13-1.05-.39-2-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.17-.48-.29Z"/></svg>
      </span>
      {inline && <span>{copy.chat}</span>}
    </a>
  )
}
