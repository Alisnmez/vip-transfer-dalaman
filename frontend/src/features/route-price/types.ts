export type RoutePrice = {
  id: string
  fromLocation: string
  toLocation: string
  price: number
  currency: 'EUR' | 'TRY' | 'USD'
}
