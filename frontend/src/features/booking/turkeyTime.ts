/** Parse a wall-clock transfer time in Turkey (UTC+03:00), regardless of browser timezone. */
export function parseTurkeyDateTime(date: string, time: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return null
  }
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const calendar = new Date(Date.UTC(year, month - 1, day))
  if (calendar.getUTCFullYear() !== year ||
      calendar.getUTCMonth() + 1 !== month ||
      calendar.getUTCDate() !== day) {
    return null
  }
  return Date.UTC(year, month - 1, day, hour - 3, minute)
}

/** YYYY-MM-DD in Turkey, not in the visitor's local timezone. */
export function turkeyToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? ''
  return [part('year'), part('month'), part('day')].join('-')
}
