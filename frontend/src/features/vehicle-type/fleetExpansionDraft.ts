// Draft only: not imported by booking, pricing, or public display.
 // Existing vehicle IDs retain their historical meanings.
export const fleetExpansionDraft = [
  { key: 'standard-vito', exterior: '/images/vehicles/standard-vito-exterior.webp', interior: '/images/vehicles/standard-vito-interior.webp', name: 'Standard Vito', maxPassengers: null, luggage: null },
  { key: 'vip-vito', exterior: '/images/vehicles/vip-vito-exterior.webp', interior: '/images/vehicles/vip-vito-interior.webp', name: 'VIP Vito', maxPassengers: null, luggage: null },
  { key: 'vip-maybach', exterior: '/images/vehicles/maybach-exterior.webp', interior: '/images/vehicles/maybach-interior.webp', name: 'VIP Maybach', maxPassengers: null, luggage: null },
  { key: 'standard-sprinter-9', exterior: '/images/vehicles/standard-sprinter-9-exterior.webp', interior: '/images/vehicles/standard-sprinter-9-interior.webp', name: 'Standard Sprinter 1–9', maxPassengers: 9, luggage: null },
  { key: 'standard-sprinter-15', exterior: '/images/vehicles/standard-sprinter-15-exterior.webp', interior: '/images/vehicles/standard-sprinter-15-interior.webp', name: 'Standard Sprinter 1–15', maxPassengers: 15, luggage: null },
  { key: 'vip-sprinter-9', exterior: '/images/vehicles/vip-sprinter-9-exterior.webp', interior: '/images/vehicles/vip-sprinter-9-interior.webp', name: 'VIP Sprinter 1–9', maxPassengers: 9, luggage: null },
  { key: 'vip-sprinter-15', exterior: '/images/vehicles/vip-sprinter-15-exterior.webp', interior: '/images/vehicles/vip-sprinter-15-interior.webp', name: 'VIP Sprinter 1–15', maxPassengers: 15, luggage: null },
] as const

// Research keys are not booking IDs. Null means operator confirmation required.
