import { useState } from 'react'
import { analyticsConsent, setAnalyticsConsent } from './analytics'

export function AnalyticsConsent() {
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
        <aside aria-label="Analytics preference" className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border border-slate-300 bg-white p-5 shadow-xl">
          <p className="font-semibold text-slate-900">Optional website analytics</p>
          <p className="mt-2 text-sm text-slate-700">May we use Google Analytics to understand visits and booking steps? This is optional. We do not send names, contact details or booking references.</p>
          <div className="mt-4 flex gap-3">
            <button type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-white" onClick={() => choose(true)}>Accept analytics</button>
            <button type="button" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-900" onClick={() => choose(false)}>Reject</button>
          </div>
        </aside>
      )}
      <button type="button" className="fixed bottom-2 right-2 z-40 rounded-md bg-white/90 px-2 py-1 text-xs text-slate-700 shadow" onClick={() => setOpen(!open)}>Privacy choices</button>
      {open && <aside aria-label="Change analytics preference" className="fixed bottom-12 right-3 z-50 max-w-xs rounded-lg border border-slate-300 bg-white p-4 shadow-lg">
        <p className="mb-3 text-sm">Analytics: {analyticsConsent() ? 'accepted' : 'not accepted'}. You can change your choice.</p>
        <div className="flex gap-2">
          <button type="button" className="rounded bg-slate-900 px-3 py-2 text-xs text-white" onClick={() => choose(true)}>Accept</button>
          <button type="button" className="rounded border px-3 py-2 text-xs" onClick={() => choose(false)}>Reject</button>
        </div>
      </aside>}
    </>
  )
}
