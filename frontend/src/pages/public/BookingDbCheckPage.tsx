import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * Temporary staging-only diagnostic. No credentials or passenger details are persisted.
 * Existing /bookings/{id} admin authorization is enforced by the backend.
 */
export function BookingDbCheckPage() {
  const [id, setId] = useState('')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)
  const isStaging = window.location.hostname === 'vip-transfer-dalaman-test.onrender.com' ||
    window.location.hostname === 'localhost'

  async function check() {
    if (busy || !/^\\d+$/.test(id) || !password || !username) return
    setBusy(true)
    setResult('Checking database through the authenticated API...')
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${encodeURIComponent(id)}`, {
        headers: { Authorization: `Basic ${btoa(username + ':' + password)}` },
        cache: 'no-store',
      })
      if (response.status === 401 || response.status === 403) {
        setResult('Authentication failed. No booking information was shown.')
      } else if (response.status === 404) {
        setResult('No booking found for this reference.')
      } else if (!response.ok) {
        setResult(`API returned HTTP ${response.status}; database verification is inconclusive.`)
      } else {
        const data: unknown = await response.json()
        const booking = data as { id?: unknown; status?: unknown }
        if (String(booking.id) === id) {
          setResult(`PASS: Booking #${id} was read back from the database. Status: ${String(booking.status ?? 'unknown')}.`)
        } else {
          setResult('FAIL: API returned a different booking reference.')
        }
      }
    } catch {
      setResult('Network or CORS error. Database verification is inconclusive.')
    } finally {
      setPassword('')
      setBusy(false)
    }
  }

  if (!isStaging) return <main className="mx-auto max-w-xl p-10">Diagnostic unavailable outside staging.</main>
  return (
    <main className="mx-auto max-w-xl space-y-5 px-5 py-20 text-on-surface">
      <h1 className="text-2xl font-bold">Staging booking database check</h1>
      <p>First create a test booking using the normal booking flow, then enter its reference here. This page reads through the existing admin-protected API. It never displays passenger details or stores credentials.</p>
      <Link className="underline" to="/booking">Create a test booking</Link>
      <form className="space-y-4" onSubmit={event => { event.preventDefault(); void check() }}>
        <label className="block">Booking reference
          <input className="mt-1 block w-full rounded border p-3" value={id} onChange={event => setId(event.target.value)} inputMode="numeric" required />
        </label>
        <label className="block">Admin username
          <input className="mt-1 block w-full rounded border p-3" value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" required />
        </label>
        <label className="block">Admin password (not saved)
          <input className="mt-1 block w-full rounded border p-3" type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="off" required />
        </label>
        <button className="rounded bg-admin-primary px-5 py-3 font-semibold text-white disabled:opacity-50" type="submit" disabled={busy || !/^\\d+$/.test(id) || !password}>{busy ? 'Checking...' : 'Verify database record'}</button>
      </form>
      {result && <p role="status" className="rounded border p-4">{result}</p>}
      <p className="text-sm">Temporary diagnostic for staging only. Remove before public launch.</p>
    </main>
  )
}
