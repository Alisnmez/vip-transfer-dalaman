import { useState } from 'react'
import type { FormEvent } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { clearAdminCredentials, setAdminCredentials } from '../features/booking/adminCredentials'
import { checkAdminAccess } from '../features/booking/api'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'calendar_month' },
]

export function AdminLayout() {
  const location = useLocation()
  const [authenticated, setAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [checking, setChecking] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')
    setChecking(true)
    setAdminCredentials(username, password)
    try {
      await checkAdminAccess()
      setAuthenticated(true)
      setPassword('')
    } catch {
      clearAdminCredentials()
      setLoginError('Login failed. Check your admin credentials and API connection.')
    } finally {
      setChecking(false)
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-surface flex items-center justify-center p-6">
        <form onSubmit={(event) => { void handleLogin(event) }} className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 border border-outline-variant shadow-lg">
          <h1 className="text-2xl font-bold text-admin-primary">Admin sign in</h1>
          <p className="text-sm text-on-surface-variant">Sign in to view private booking requests. Credentials are not saved in browser storage.</p>
          <label className="block text-sm font-semibold">Username
            <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-lg border p-3" />
          </label>
          <label className="block text-sm font-semibold">Password
            <input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border p-3" />
          </label>
          {loginError && <p role="alert" className="text-error text-sm">{loginError}</p>}
          <button disabled={checking} type="submit" className="w-full rounded-lg bg-admin-primary p-3 font-semibold text-white disabled:opacity-50">{checking ? 'Checking...' : 'Sign in'}</button>
        </form>
      </main>
    )
  }

  const usesCustomPageChrome = ['/admin/bookings', '/admin/calendar'].includes(
    location.pathname,
  )

  return (
    <div className="min-h-screen min-w-0 bg-admin-background text-admin-on-surface">
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-admin-primary px-4 text-white md:hidden">
        <span className="font-bold">VIP Transfer Admin</span>
        <button type="button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-white/40 px-3 py-2 text-sm font-semibold">{menuOpen ? "Close" : "Menu"}</button>
      </div>
      {menuOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMenuOpen(false)} /> }
      <aside id="admin-navigation" className={`${menuOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-admin-primary px-4 py-6 shadow-md transition-transform md:translate-x-0` }>
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
              onClick={() => setMenuOpen(false)}
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
          <button type="button" className="w-full rounded-lg border border-primary-container/50 px-4 py-2 text-on-primary-container" onClick={() => { clearAdminCredentials(); setAuthenticated(false); setPassword('') }}>Sign out</button>
        </div>
      </aside>

      <main
        className={
          usesCustomPageChrome
            ? 'min-w-0 md:ml-64 flex min-h-[calc(100dvh-4rem)] flex-col md:h-screen md:min-h-0 md:overflow-hidden'
            : 'min-w-0 md:ml-64 min-h-[calc(100dvh-4rem)] md:min-h-screen flex flex-col'
        }
      >
        {!usesCustomPageChrome && (
          <header className="h-16 w-full sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4 flex-1">
            <span className="font-title-lg text-title-lg text-admin-primary">
              Operations Hub
            </span>

          </div>


          </header>
        )}

        <Outlet />

        {!usesCustomPageChrome && (
          <footer className="mt-auto w-full py-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center px-4 sm:px-8">
          <div className="text-label-sm text-on-surface-variant">
            © {new Date().getFullYear()} VIP Transfer. Internal administration.
          </div>


          </footer>
        )}
      </main>
    </div>
  )
}
