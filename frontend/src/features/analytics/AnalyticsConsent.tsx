import { useState } from 'react'
import { useLanguage } from '../../shared/localization/language'
import { analyticsConsent, setAnalyticsConsent } from './analytics'

const consentCopy = {
  en: {
    preference: 'Analytics preference', title: 'Optional website analytics',
    description: 'May we use Google Analytics to understand visits and booking steps? This is optional. We do not send names, contact details or booking references.',
    acceptAnalytics: 'Accept analytics', reject: 'Reject', privacy: 'Cookie settings',
    change: 'Change analytics preference', accepted: 'Analytics: accepted. You can change your choice.',
    declined: 'Analytics: not accepted. You can change your choice.', accept: 'Accept',
  },
  de: {
    preference: 'Analyse-Einstellungen', title: 'Optionale Website-Analyse',
    description: 'Dürfen wir Google Analytics verwenden, um Besuche und Buchungsschritte besser zu verstehen? Dies ist freiwillig. Wir übermitteln keine Namen, Kontaktdaten oder Buchungsnummern.',
    acceptAnalytics: 'Analyse zulassen', reject: 'Ablehnen', privacy: 'Datenschutzeinstellungen',
    change: 'Analyse-Einstellungen ändern', accepted: 'Analyse zugelassen. Sie können Ihre Auswahl ändern.',
    declined: 'Analyse nicht zugelassen. Sie können Ihre Auswahl ändern.', accept: 'Zulassen',
  },
  ru: {
    preference: 'Настройки аналитики', title: 'Необязательная аналитика сайта',
    description: 'Можно ли использовать Google Analytics, чтобы изучать посещения и этапы бронирования? Это необязательно. Мы не передаём имена, контактные данные и номера бронирований.',
    acceptAnalytics: 'Разрешить аналитику', reject: 'Отклонить', privacy: 'Настройки конфиденциальности',
    change: 'Изменить настройки аналитики', accepted: 'Аналитика разрешена. Вы можете изменить выбор.',
    declined: 'Аналитика не разрешена. Вы можете изменить выбор.', accept: 'Разрешить',
  },
}

export function AnalyticsConsent() {
  const { language } = useLanguage()
  const copy = consentCopy[language]
  const [choice, setChoice] = useState(() => {
    try { return localStorage.getItem('vip-analytics-consent') } catch { return 'denied' }
  })
  const [open, setOpen] = useState(false)
  function choose(allowed: boolean) {
    setAnalyticsConsent(allowed)
    setChoice(allowed ? 'granted' : 'denied')
    setOpen(false)
  }
  return (
    <>
      {choice !== 'granted' && choice !== 'denied' && (
        <aside aria-label={copy.preference} className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border border-slate-300 bg-white p-5 shadow-xl">
          <p className="font-semibold text-slate-900">{copy.title}</p>
          <p className="mt-2 text-sm text-slate-700">{copy.description}</p>
          <div className="mt-4 flex gap-3">
            <button type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={() => choose(true)}>{copy.acceptAnalytics}</button>
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900" onClick={() => choose(false)}>{copy.reject}</button>
          </div>
        </aside>
      )}
      <div className="border-t border-slate-200 bg-white px-4 py-4 text-center">
      <button type="button" className="text-sm text-slate-700 underline underline-offset-4 focus-visible:outline focus-visible:outline-2" aria-expanded={open} onClick={() => setOpen(!open)}>{copy.privacy}</button>
      </div>
      {open && <aside aria-label={copy.change} className="fixed bottom-12 right-3 z-50 max-w-xs rounded-lg border border-slate-300 bg-white p-4 shadow-lg">
        <p className="mb-3 text-sm">{analyticsConsent() ? copy.accepted : copy.declined}</p>
        <div className="flex gap-2">
          <button type="button" className="rounded bg-slate-900 px-3 py-2 text-xs text-white" onClick={() => choose(true)}>{copy.accept}</button>
          <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => choose(false)}>{copy.reject}</button>
        </div>
      </aside>}
    </>
  )
}
