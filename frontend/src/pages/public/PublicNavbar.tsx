import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { languages, parseLanguage, useLanguage } from '../../shared/localization/language'
import { publicNavItems } from './publicNavigation'

const navigationCopy = {
  en: { main: 'Main navigation', mobile: 'Mobile navigation', book: 'Book Now', open: 'Open menu', close: 'Close menu', language: 'Website language' },
  de: { main: 'Hauptnavigation', mobile: 'Mobile Navigation', book: 'Jetzt buchen', open: 'Menü öffnen', close: 'Menü schließen', language: 'Sprache der Website' },
  ru: { main: 'Главное меню', mobile: 'Мобильное меню', book: 'Забронировать', open: 'Открыть меню', close: 'Закрыть меню', language: 'Язык сайта' },
}

export function PublicNavbar() {
  const { language, setLanguage } = useLanguage()
  const copy = navigationCopy[language]
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 h-20 w-full border-b border-outline-variant bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-container-max items-center justify-between gap-3 px-4 sm:px-gutter">
        <Link className="min-w-0 text-lg font-bold leading-tight tracking-tight text-admin-primary sm:text-2xl" onClick={() => setMenuOpen(false)} to="/">
          <img src="/dalamanway-logo.svg" alt="DalamanWay — Private Airport Transfers" className="h-10 w-auto max-w-full object-contain sm:h-12 sm:max-w-[240px]" />
        </Link>

        <nav aria-label={copy.main} className="hidden min-w-0 items-center justify-center gap-3 2xl:gap-5 2xl:flex">
          {publicNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `relative whitespace-nowrap text-sm font-semibold transition-colors after:absolute after:left-0 after:top-[calc(100%+8px)] after:h-0.5 after:w-full after:rounded-full after:transition-opacity ${
                  isActive
                    ? 'text-admin-primary after:bg-secondary after:opacity-100'
                    : 'text-on-surface-variant hover:text-admin-primary after:bg-secondary after:opacity-0'
                }`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.translations[language]}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link className="hidden shrink-0 rounded-lg bg-admin-primary px-4 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 sm:inline-flex" to="/booking">
            {copy.book}
          </Link>
          <select
            aria-label={copy.language}
            className="h-11 max-w-28 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-admin-primary"
            value={language}
            onChange={event => setLanguage(parseLanguage(event.target.value))}
          >
            {Object.entries(languages).map(([code, name]) => <option key={code} value={code} lang={code}>{name}</option>)}
          </select>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? copy.close : copy.open}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-admin-primary hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary 2xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span translate="no" aria-hidden="true" className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label={copy.mobile} className="absolute left-0 right-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-5 pt-3 shadow-xl 2xl:hidden" id="mobile-navigation">
          <div className="mx-auto flex max-w-container-max flex-col gap-1">
            {publicNavItems.map((item) => (
              <NavLink
                className={({ isActive }) => `rounded-lg px-4 py-3 text-base font-semibold ${isActive ? 'bg-slate-100 text-admin-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                end={item.to === '/'}
                key={item.to}
                onClick={() => setMenuOpen(false)}
                to={item.to}
              >
                {item.translations[language]}
              </NavLink>
            ))}
            <Link className="mt-3 rounded-lg bg-admin-primary px-5 py-3 text-center font-semibold text-white" onClick={() => setMenuOpen(false)} to="/booking">
              {copy.book}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
