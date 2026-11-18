import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'calendar_month' },
  { to: '/admin/calendar', label: 'Calendar', icon: 'event' },
  { to: '/admin/fleet-management', label: 'Fleet Management', icon: 'directions_car' },
  { to: '/admin/dispatch-hub', label: 'Dispatch Hub', icon: 'hub' },
  { to: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
]

export function AdminLayout() {
  const location = useLocation()
  const usesCustomPageChrome = ['/admin/bookings', '/admin/calendar'].includes(
    location.pathname,
  )

  return (
    <div className="bg-admin-background text-admin-on-surface min-h-screen">
      <aside className="w-full lg:w-64 lg:h-full lg:fixed lg:left-0 lg:top-0 bg-admin-primary flex flex-col py-3 lg:py-6 px-3 lg:px-4 shadow-md z-50">
        <div className="mb-3 lg:mb-10 px-2">
          <h1 className="text-title-lg font-title-lg text-primary-fixed">
            VIP Transfer
          </h1>
          <p className="text-label-xs text-on-primary-container opacity-70">
            Management System
          </p>
        </div>

        <nav className="flex lg:block gap-1 overflow-x-auto lg:overflow-visible lg:space-y-1 pb-1 lg:pb-0" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'shrink-0 flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors whitespace-nowrap',
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

      </aside>

      <main
        className={
          usesCustomPageChrome
            ? 'lg:ml-64 min-h-screen lg:h-screen flex flex-col lg:overflow-hidden min-w-0'
            : 'lg:ml-64 min-h-screen flex flex-col min-w-0'
        }
      >
        {!usesCustomPageChrome && (
          <header className="hidden lg:flex h-16 w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-title-lg text-title-lg text-admin-primary">
              Operations Hub
            </span>
          </div>

          </header>
        )}

        <Outlet />

      </main>
    </div>
  )
}
