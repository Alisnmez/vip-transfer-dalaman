import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'calendar_month' },
  { to: '/admin/calendar', label: 'Calendar', icon: 'event' },
  { to: '/admin/fleet-management', label: 'Fleet Management', icon: 'directions_car' },
  { to: '/admin/route-prices', label: 'Route Prices', icon: 'payments' },
  { to: '/admin/dispatch-hub', label: 'Dispatch Hub', icon: 'hub' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
]

const utilityItems = [
  { to: '/admin/bookings', label: 'Settings', icon: 'settings' },
  { to: '/admin/bookings', label: 'Support', icon: 'help' },
]

export function AdminLayout() {
  const location = useLocation()
  const usesCustomPageChrome = ['/admin/bookings', '/admin/calendar'].includes(
    location.pathname,
  )

  return (
    <div className="bg-admin-background text-admin-on-surface min-h-screen">
      <aside className="h-full w-64 fixed left-0 top-0 bg-admin-primary flex flex-col py-6 px-4 shadow-md z-50">
        <div className="mb-10 px-2">
          <h1 className="text-title-lg font-title-lg text-primary-fixed">
            VIP Transfer
          </h1>
          <p className="text-label-xs text-on-primary-container opacity-70">
            Management System
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'text-primary-fixed-dim font-bold bg-primary-container/30'
                    : 'text-on-primary-container hover:text-primary-fixed-dim hover:bg-primary-container/20',
                ].join(' ')
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-primary-container/30 pt-6 space-y-1">
          <button className="w-full bg-secondary-fixed text-on-secondary-fixed py-2 px-4 rounded-lg font-label-sm text-label-sm mb-4 hover:opacity-90 transition-opacity">
            New Booking
          </button>
          {utilityItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className="flex items-center gap-3 px-4 py-2 text-on-primary-container hover:text-primary-fixed-dim hover:bg-primary-container/20 transition-colors rounded-lg"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      <main
        className={
          usesCustomPageChrome
            ? 'ml-64 h-screen flex flex-col overflow-hidden'
            : 'ml-64 min-h-screen flex flex-col'
        }
      >
        {!usesCustomPageChrome && (
          <header className="h-16 w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-title-lg text-title-lg text-admin-primary">
              Operations Hub
            </span>
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input
                className="pl-10 pr-4 py-1.5 w-full bg-surface-container-low border-none rounded-full text-label-sm focus:ring-1 focus:ring-admin-primary"
                placeholder="Search bookings, drivers..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg font-label-sm hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-sm">add</span>
              Create Task
            </button>
            <div className="flex items-center gap-3 border-l border-outline-variant pl-6">
              <button className="text-on-surface-variant hover:text-admin-primary transition-all relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white" />
              </button>
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    data-alt="Close-up professional portrait of a male operations manager in a high-tech control room environment, soft blue atmospheric lighting, clean professional attire, modern tech dashboard aesthetic."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1xWU3NjPNvH05ggQWZasFtMYIEX6c6jSsNH-WDyep-xHLYEWFF2azfvlTMdIjwf-4cEcmmezRSyCnIujlSMOdLb5I-Op1B0yNe62s4nvCGShZbPk0xuwYb-h7hyT1fpVIugZfOoMShtmSXuhyA_FjRjJjh97g9IXYvJKNqmQvmqNYBcyqkvsLmB5izn7Gd4Af8A3gSXPNO4LwZvArZa6vClDy3aCpUTGQ2kgREpuOwOJjlqO4HjppmHDxFMIMPVvRyyw_PKiw5Dk"
                  />
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-admin-primary">
                  account_circle
                </span>
              </div>
            </div>
          </div>
          </header>
        )}

        <Outlet />

        {!usesCustomPageChrome && (
          <footer className="mt-auto w-full py-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center px-8">
          <div className="text-label-sm text-on-surface-variant">
            © 2024 VIP Transfer Systems. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              className="text-label-sm text-on-surface-variant hover:text-secondary transition-opacity"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-label-sm text-on-surface-variant hover:text-secondary transition-opacity"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-label-sm text-on-surface-variant hover:text-secondary transition-opacity"
              href="#"
            >
              Operational Guidelines
            </a>
            <a
              className="text-label-sm text-on-surface-variant hover:text-secondary transition-opacity"
              href="#"
            >
              Contact Support
            </a>
          </div>
          <div className="font-label-xs text-label-xs uppercase tracking-wider text-on-surface-variant">
            v2.4.1-Stable
          </div>
          </footer>
        )}
      </main>
    </div>
  )
}
