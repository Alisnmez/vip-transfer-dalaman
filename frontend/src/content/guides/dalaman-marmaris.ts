export const dalamanMarmarisGuide = {
  path: '/guides/dalaman-airport-to-marmaris',
  destination: 'Marmaris',
  destinationSlug: 'marmaris',
  title: 'Dalaman Airport to Marmaris: Bus, Taxi or Private Transfer?',
  description: 'Compare the practical ways to travel from Dalaman Airport to Marmaris, what to check before you fly, and how to choose the right option for your group.',
  intro: 'Landing at Dalaman Airport and heading to Marmaris? The right onward journey depends on your arrival time, accommodation address, group size and how much luggage you have. This guide compares the main options and points you to official sources for current public transport information.',
  reviewed: '21 November 2026',
  sections: [
    {
      heading: 'Quick answer',
      paragraphs: [
        'A public shuttle is worth checking if its departure and drop-off point fit your flight and accommodation. A taxi may suit travellers who want to leave on arrival, while a pre-arranged private transfer can make the door-to-door plan clearer for families, groups or late arrivals.',
        'There is no single best option for every traveller. Check the latest shuttle timetable and fare, then compare the full cost and final drop-off point for your own trip.',
      ],
    },
    {
      heading: 'Compare your options',
      options: [
        { name: 'HAVAŞ or MUTTAŞ shuttle', bestFor: 'Travellers whose flight and accommodation fit the published schedule and route.',
          check: 'Current departure time, fare, luggage rules and whether the stop works for your hotel.' },
        { name: 'Airport taxi', bestFor: 'Travellers who want to arrange transport at the airport without comparing shuttle schedules.',
          check: 'The fare basis, payment method, destination address and whether the vehicle fits your group and bags.' },
        { name: 'Pre-arranged private transfer', bestFor: 'Families, groups, people with several bags, or travellers who prefer a confirmed pickup plan.',
          check: 'The final quoted price, pickup instructions, vehicle capacity, child-seat needs and cancellation terms.' },
        { name: 'Rental car', bestFor: 'Travellers planning to drive beyond Marmaris during their stay.',
          check: 'Insurance excess, fuel policy, parking, deposit and the total rental cost.' },
      ],
    },
    {
      heading: 'What public transport is available?',
      paragraphs: [
        'Dalaman Airport lists both HAVAŞ and MUTTAŞ shuttle services between the airport and Marmaris city centre. HAVAŞ says its airport shuttles leave from the airport parking area; it also notes that designated drop-offs on the main route may be possible when the driver is told in advance.',
        'These services do not automatically mean a drop-off at your hotel door. Before travelling, check the operator’s live timetable, fare, route and stop details. The airport itself directs passengers to the operators for the latest information.',
      ],
    },
    {
      heading: 'How to choose for your flight and hotel',
      bullets: [
        'Match the shuttle departure to your landing time, allowing time to leave the terminal and collect checked luggage.',
        'Find your accommodation on a map and compare its distance from the bus terminal or the published shuttle stops.',
        'For a late arrival or a flight disruption, check what alternative transport will be available before you travel.',
        'Compare the total cost for everyone in your party, including any onward ride from a shuttle stop.',
        'If booking a transfer, give the operator your flight number, hotel name, passenger count and luggage details, and ask for clear pickup instructions.',
      ],
    },
    {
      heading: 'A simple arrival checklist',
      bullets: [
        'Save your accommodation’s full address and a contact number offline.',
        'Check the official shuttle timetable and fare again close to your travel date.',
        'Confirm whether the shuttle goes to a stop you can use; do not assume it drops at every hotel.',
        'For a private pickup, keep the booking confirmation and meeting-point instructions available after landing.',
      ],
    },
    {
      heading: 'Frequently asked questions',
      faqs: [
        { question: 'Is there a bus from Dalaman Airport to Marmaris?', answer: 'Yes. The airport lists HAVAŞ and MUTTAŞ shuttle services between Dalaman Airport and Marmaris city centre. Check each operator’s current timetable and route before you travel.' },
        { question: 'Does the airport shuttle take me to my hotel?', answer: 'Not necessarily. The published service is to the city centre and designated route points. Check the stop nearest to your accommodation and plan any onward journey.' },
        { question: 'Should I book a transfer before I fly?', answer: 'Pre-booking can help you know the pickup plan and quoted cost in advance. Compare the confirmed vehicle, included services and cancellation terms with your needs.' },
        { question: 'Where can I check current shuttle times and fares?', answer: 'Use the official HAVAŞ and MUTTAŞ pages linked below. Timetables and fares can change, so verify them close to your travel date.' },
      ],
    },
  ],
  sources: [
    { label: 'Dalaman Airport: buses and public transport', url: 'https://www.dalamanairport.aero/en/passengers/public-transport/' },
    { label: 'DHMİ Dalaman Airport: transport information', url: 'https://www.dhmi.gov.tr/Sayfalar/Havalimani/Dalaman/Ulasim.aspx' },
    { label: 'HAVAŞ: routes, timetables and fares', url: 'https://www.havas.net/otobus-hizmetleri' },
    { label: 'MUTTAŞ: airport services', url: 'https://www.muttas.com.tr/sayfa/havalimani-seferleri' },
  ],
} as const
