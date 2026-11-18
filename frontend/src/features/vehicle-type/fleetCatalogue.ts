// Vehicle specifications adapted from https://aeroviavip.com/en/filo (2026-11-18).
// Descriptions are our own. Equipment and actual vehicle assignment need confirmation.
// This display catalogue does not change the nine existing booking price categories.
export const fleetCatalogue = [
  {
    name: 'VIP Vito',
    passengers: '1–5',
    luggage: 5,
    feature: 'Mercedes-Benz Vito with a standard VIP interior for families and small groups.',
    amenities: ['Comfortable VIP seating', 'Open cabin without a driver partition', 'Air conditioning', 'Wi-Fi and bottled water, subject to confirmation'],
  },
  {
    name: 'Ultra VIP Vito',
    passengers: '1–4',
    luggage: 4,
    feature: 'Mercedes-Benz Vito with a Maybach-style interior and additional privacy.',
    amenities: ['Premium seating and ambient lighting', 'Driver partition', 'TV, refrigerator and multimedia, subject to confirmation', 'Wi-Fi and refreshments, subject to confirmation'],
  },
  {
    name: 'Sprinter',
    passengers: '5–16',
    luggage: 16,
    feature: 'Mercedes-Benz Sprinter minibus with generous space for family and group journeys.',
    amenities: ['Standard VIP interior and comfortable seats', 'Open cabin without a driver partition', 'Air conditioning', 'For more than 8 bags, contact us before booking'],
  },
  {
    name: 'Ultra Sprinter',
    passengers: '7–9',
    luggage: 12,
    feature: 'Mercedes-Benz Sprinter with an upgraded VIP interior for a smaller group travelling in extra comfort.',
    amenities: ['Premium seating and driver partition', 'Dual screens and PlayStation, subject to confirmation', 'Wi-Fi and refreshments, subject to confirmation', 'For more than 8 bags, contact us before booking'],
  },
] as const
