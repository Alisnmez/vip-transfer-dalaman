import { WhatsAppButton } from '../features/booking/WhatsAppButton'
import { Outlet } from 'react-router-dom'
import { usePageSeo } from '../shared/seo/usePageSeo'

export function PublicLayout() {
  usePageSeo()
  return <><Outlet /><WhatsAppButton /></>
}
