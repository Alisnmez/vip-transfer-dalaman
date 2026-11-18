import { useCallback, useEffect, useState } from 'react'
import { request } from './api'

export type TransferPrice = { destination: string; vehicleId: string; oneWay: number; roundTrip: number; version: number }
const url = `${import.meta.env.VITE_API_BASE_URL || ''}/route-prices`

export function updateTransferPrice(price: TransferPrice) {
  return request<TransferPrice>(url, { method: 'PUT', body: JSON.stringify(price) }, true)
}

/** Fetch once per page visit or explicit refresh; searches stay entirely local. */
export function useTransferPrices() {
  const [prices, setPrices] = useState<TransferPrice[]>([])
  const [revision, setRevision] = useState(0)
  const [loadedRevision, setLoadedRevision] = useState(-1)
  const [error, setError] = useState('')
  const refresh = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => {
    let active = true
    request<TransferPrice[]>(url).then(data => {
      if (active) { setPrices(data); setError('') }
    }).catch(() => {
      if (active) { setPrices([]); setError('Unable to load current prices. Please refresh and try again.') }
    }).finally(() => { if (active) setLoadedRevision(revision) })
    return () => { active = false }
  }, [revision])
  const loading = loadedRevision !== revision
  function findPrice(destination: string, vehicleId: string, tripType: 'one-way' | 'round-trip') {
    if (loading || error) return null
    const entry = prices.find(item => item.destination === destination && item.vehicleId === vehicleId)
    return entry ? (tripType === 'round-trip' ? entry.roundTrip : entry.oneWay) : null
  }
  function replacePrice(updated: TransferPrice) {
    setPrices(current => current.map(item => item.destination === updated.destination && item.vehicleId === updated.vehicleId ? updated : item))
  }
  return { prices: loading ? [] : prices, loading, error, refresh, findPrice, replacePrice }
}
