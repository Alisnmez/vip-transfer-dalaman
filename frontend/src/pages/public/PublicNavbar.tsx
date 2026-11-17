import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { publicNavItems } from './publicNavigation'

export function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 z-50 h-20 w-full border-b border-outline-variant bg-white shadow-sm">
      <div className="mx-auto flex h-full max-w-container-max items-center justify-between gap-3 px-4 sm:px-gutter">
        <Link className="min-w-0 text-lg font-bold leading-tight tracking-tight text-admin-primary sm:text-2xl" onClick={() => setMenuOpen(false)} to="/">
          VIP Transfer Dalaman
        </Link>

        <nav aria-label="Main navigation" className="hidden min-w-0 items-center justify-center gap-3 2xl:gap-5 2xl:flex">
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
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <Link className="hidden shrink-0 rounded-lg bg-admin-primary px-4 py-3 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 sm:inline-flex" to="/booking">
            Book Now
          </Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-admin-primary hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-primary 2xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span translate="no" aria-hidden="true" className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile navigation" className="absolute left-0 right-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-5 pt-3 shadow-xl 2xl:hidden" id="mobile-navigation">
          <div className="mx-auto flex max-w-container-max flex-col gap-1">
            {publicNavItems.map((item) => (
              <NavLink
                className={({ isActive }) => `rounded-lg px-4 py-3 text-base font-semibold ${isActive ? 'bg-slate-100 text-admin-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                end={item.to === '/'}
                key={item.to}
                onClick={() => setMenuOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
            <Link className="mt-3 rounded-lg bg-admin-primary px-5 py-3 text-center font-semibold text-white" onClick={() => setMenuOpen(false)} to="/booking">
              Book Now
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
