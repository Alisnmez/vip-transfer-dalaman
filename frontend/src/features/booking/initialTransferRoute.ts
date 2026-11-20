import { transferPrices } from './pricing.ts'

const airport = 'Dalaman Airport'
const destinations = [...new Set(transferPrices.map(price => price.destination))]

export function initialTransferRoute(
  requestedDestination: string | null,
  draft: { pickUpLocation?: string; dropOffLocation?: string },
) {
  const query = requestedDestination?.trim().toLocaleLowerCase('en')
  const destination = query
    ? destinations.find(name => name.toLocaleLowerCase('en') === query)
      ?? destinations.find(name => name.toLocaleLowerCase('en').includes(query))
    : undefined

  return destination
    ? { pickUpLocation: airport, dropOffLocation: destination }
    : { pickUpLocation: draft.pickUpLocation || airport, dropOffLocation: draft.dropOffLocation ?? '' }
}
