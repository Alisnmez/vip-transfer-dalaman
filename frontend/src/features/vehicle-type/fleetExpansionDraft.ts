// Draft only: not imported by booking, pricing, or public display.
 // Existing vehicle IDs retain their historical meanings.
export const fleetExpansionDraft = [
  { key: 'standard-vito', name: 'Standard Vito', maxPassengers: null, luggage: null },
  { key: 'vip-vito', name: 'VIP Vito', maxPassengers: null, luggage: null },
  { key: 'vip-maybach', name: 'VIP Maybach', maxPassengers: null, luggage: null },
  { key: 'standard-sprinter-9', name: 'Standard Sprinter 1–9', maxPassengers: 9, luggage: null },
  { key: 'standard-sprinter-15', name: 'Standard Sprinter 1–15', maxPassengers: 15, luggage: null },
  { key: 'vip-sprinter-9', name: 'VIP Sprinter 1–9', maxPassengers: 9, luggage: null },
  { key: 'vip-sprinter-15', name: 'VIP Sprinter 1–15', maxPassengers: 15, luggage: null },
] as const

// Research keys are not booking IDs. Null means operator confirmation required.
