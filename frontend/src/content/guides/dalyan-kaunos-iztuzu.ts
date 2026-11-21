export const dalyanKaunosGuide = {
  path: '/guides/dalyan-kaunos-iztuzu',
  destination: 'Dalyan',
  destinationSlug: 'dalyan',
  transferDestination: 'Dalyan',
  category: 'River landscape & ancient history',
  cardDescription: 'Read the river landscape through Kaunos, its rock tombs and the protected İztuzu coast.',
  title: 'Dalyan, Kaunos and İztuzu: A Day of River Views and Ancient History',
  description: 'Plan a Dalyan day around the river, Kaunos archaeological site, rock tombs and the protected coast at İztuzu.',
  intro: 'Dalyan is best understood as a landscape, not a single attraction: a river, a former harbour city, rock-cut tombs and a protected beach sit within the same wider story. This guide helps you choose a thoughtful order for the day without trying to turn every stop into a rushed checklist.',
  reviewed: '21 November 2026',
  sections: [
    {
      heading: 'Begin with the view of the rock tombs',
      paragraphs: [
        'The Kaunos rock tombs are carved into the cliffs and can be seen from Dalyan. The Turkish Museums site dates them to the fourth century BCE and notes that they were used again in the Roman period. Seeing them from the riverbank gives useful context before you explore the archaeological site itself.',
        'For close-up access to the ancient city, check the official site information and the current way to reach it. Do not assume that the river crossing, site access or opening arrangements are unchanged from an older guide.',
      ],
    },
    {
      heading: 'Explore Kaunos as a whole site',
      paragraphs: [
        'Kaunos was once a commercially important port. Over time, sediment changed the coastline and the city lost its harbour role. The remains include city walls, a theatre, and traces of a basilica, bath and temple; the archaeological site rewards visitors who look at the wider layout rather than only the tombs.',
        'The site includes elevated terrain. Wear comfortable shoes, carry water and check current visitor guidance before you go.',
      ],
    },
    {
      heading: 'Leave room for the coast',
      paragraphs: [
        'İztuzu is a protected coastal area and an important habitat for loggerhead sea turtles. Treat it as a nature visit: follow local protection notices, respect any seasonal restrictions and do not disturb wildlife or nesting areas.',
        'You do not have to fit every possible stop into the same day. A slower river-and-ruins visit may be more rewarding than adding the beach if the group is tired or conditions are hot.',
      ],
    },
    {
      heading: 'Frequently asked questions',
      faqs: [
        { question: 'Can I see the Kaunos rock tombs from Dalyan?', answer: 'The Turkish Museums site notes that the rock tombs can be seen from Dalyan. For access to the archaeological site itself, check current official visitor information.' },
        { question: 'What is the story behind Kaunos?', answer: 'It was once an important port city; the shoreline later changed as sediment accumulated. The site includes remains from several periods.' },
        { question: 'Is İztuzu just a regular beach stop?', answer: 'It is also a protected area associated with loggerhead sea turtles. Follow current local conservation rules and seasonal notices during a visit.' },
      ],
    },
  ],
  sources: [
    { label: 'Turkish Museums: Kaunos Archaeological Site', url: 'https://muze.gov.tr/muze-detay?DistId=KAU&SectionId=KAU02' },
    { label: 'GoTürkiye: İztuzu Beach and Kaunos', url: 'https://goturkiye.com/routes/2-day-caretta-caretta-hatching-season-route' },
    { label: 'GoTürkiye: The Caretta caretta season', url: 'https://goturkiye.com/branding/press-releases/the-caretta-caretta-season-begins-in-the-turkish-riviera' },
  ],
} as const
