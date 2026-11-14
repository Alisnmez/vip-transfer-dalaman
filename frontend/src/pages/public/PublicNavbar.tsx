import { Link, NavLink } from 'react-router-dom'

import { publicNavItems } from './publicNavigation'

export function PublicNavbar() {
  return (
    <header className="fixed left-0 top-0 z-50 h-20 w-full bg-white border-b border-outline-variant shadow-sm">
      <div className="relative mx-auto flex h-full max-w-container-max items-center justify-between px-gutter">
        <Link
          className="text-2xl font-bold text-admin-primary"
          to="/"
        >
          VIP Transfer Dalaman
        </Link>

        <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {publicNavItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `relative text-base font-semibold transition-colors after:absolute after:left-0 after:top-[calc(100%+8px)] after:h-0.5 after:w-full after:rounded-full after:transition-opacity ${
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

        <div className="flex items-center gap-4">
          <button className="hidden md:block px-5 py-2 text-admin-primary text-base font-semibold hover:bg-slate-100 rounded-lg transition-colors">
            Login
          </button>
          <Link
            className="px-5 py-2 bg-admin-primary text-on-primary text-base font-semibold rounded-lg hover:opacity-90 transition-opacity"
            to="/booking"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  )
}
