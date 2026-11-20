export type SupportRequest = 'change' | 'cancel'

export const supportEmail = (import.meta.env.VITE_SUPPORT_EMAIL || 'dalamanway.booking@gmail.com').trim()

// WhatsApp is enabled only after a real business number is configured.
// Never send customers to the temporary phone placeholder.
const configuredWhatsApp = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/[^0-9]/g, '')
const whatsappNumber = configuredWhatsApp.length >= 10 && configuredWhatsApp.length <= 15 &&
  configuredWhatsApp !== '905555555555' ? configuredWhatsApp : null

export function bookingSupportLink(reference: string, request: SupportRequest): string {
  const safeReference = reference.trim().replace(/^#/, '')
  const action = request === 'cancel' ? 'request cancellation of' : 'request a change to'
  const message = `Hello, I would like to ${action} booking #${safeReference}. Please advise me on the next steps. I understand this message does not automatically change or cancel my booking.`
  if (whatsappNumber) {
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }
  return `mailto:${supportEmail}?subject=${encodeURIComponent(`Booking #${safeReference} support`)}&body=${encodeURIComponent(message)}`
}

export function whatsappSupportEnabled(): boolean {
  return whatsappNumber !== null
}
