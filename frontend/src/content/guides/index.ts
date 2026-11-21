import { dalamanFethiyeGuide } from './dalaman-fethiye.ts'
import { dalamanMarmarisGuide } from './dalaman-marmaris.ts'
import { dalyanKaunosGuide } from './dalyan-kaunos-iztuzu.ts'
import { kayakoyOludenizGuide } from './kayakoy-oludeniz.ts'

export const travelGuides = [
  dalamanMarmarisGuide,
  dalamanFethiyeGuide,
  kayakoyOludenizGuide,
  dalyanKaunosGuide,
] as const
