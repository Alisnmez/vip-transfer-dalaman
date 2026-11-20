// Booking timestamps from Spring LocalDateTime are local Turkey wall-clock times.
// Do not pass them to new Date(): the browser timezone would shift the display.
const turkeyClock = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Istanbul',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hourCycle: 'h23',
})

export function turkeyNowLocal(): string {
  return turkeyClock.format(new Date()).replace(' ', 'T')
}

export function formatTransferDateTime(value: string): string {
  return value ? value.replace('T', ' ').slice(0, 16) : 'Not provided'
}

export function bookingStatus(value?: string | null): string {
  return value || 'PENDING'
}

const receivedTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Istanbul', dateStyle: 'medium', timeStyle: 'short',
})

export function formatBookingReceivedAt(value?: string | null): string {
  if (!value) return 'Not recorded'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Not recorded' : receivedTime.format(date)
}
