export const dalamanFethiyeGuide = {
  path: '/guides/dalaman-airport-to-fethiye',
  destination: 'Fethiye',
  destinationSlug: 'fethiye',
  title: 'Dalaman Airport to Fethiye: Shuttle Stops and Your Final Journey',
  description: 'Find the official Dalaman Airport to Fethiye shuttle details, route stops and what to plan for your hotel or beach area.',
  intro: 'Travelling from Dalaman Airport to Fethiye? The airport’s official transport page lists HAVAŞ and MUTTAŞ shuttles for Fethiye. The useful detail is where each service goes: a shuttle can get you to Fethiye or a published stop, but your hotel may still need a final local journey.',
  reviewed: '21 November 2026',
  sections: [
    {
      heading: 'Quick answer',
      paragraphs: [
        'Check HAVAŞ and MUTTAŞ for the travel date shown on your ticket. MUTTAŞ publishes the Fethiye Otogar–Dalaman Airport route as line 48-25; its airport-side departures are linked to aircraft landing times rather than a simple fixed timetable.',
        'If you are staying in Fethiye town, confirm how far your accommodation is from the stop you plan to use. For Çalış or Ölüdeniz, the MUTTAŞ airport route page lists Fethiye Otogar as its final stop, so plan and verify the onward leg before you travel.',
      ],
    },
    {
      heading: 'What the official shuttle pages say',
      options: [
        { name: 'MUTTAŞ line 48-25', bestFor: 'Travellers checking the Fethiye bus station route and named stops.',
          check: 'The live route page for your date: airport departures depend on flight arrivals; the listed route and stop details can change.' },
        { name: 'HAVAŞ', bestFor: 'Travellers comparing the airport shuttle to Fethiye city centre.',
          check: 'The current departure, fare and stop. HAVAŞ and the airport direct passengers to the operator’s live information.' },
        { name: 'Pre-arranged private transfer', bestFor: 'Travellers who want a pickup plan to match their exact accommodation address.',
          check: 'The confirmed price, pickup instructions, vehicle capacity, child-seat needs and cancellation terms.' },
        { name: 'Airport taxi or rental car', bestFor: 'Travellers deciding at the airport or planning to drive beyond Fethiye.',
          check: 'For a taxi, confirm the destination and fare basis; for a rental car, compare the complete rental terms and parking plan.' },
      ],
    },
    {
      heading: 'MUTTAŞ route 48-25: airport to Fethiye',
      paragraphs: [
        'MUTTAŞ lists route 48-25 as Fethiye Otogar–Dalaman Airport and shows a route distance of 55 km. On its route page, airport departures are described as varying according to aircraft landing times. The same page says reservations and advance ticket sales are not offered on airport vehicles, and that credit cards are accepted.',
        'The published airport-departure stop list includes Göcek Petrol Ofisi, Göcek BP, Yanıklar, Acarlar, Çiftlik junction, Günlükbaşı and Fethiye Otogar. The page shows a different stop sequence for the opposite direction. Check the current list and ask the operator or driver which stop is appropriate for your exact address.',
      ],
    },
    {
      heading: 'Plan the last leg to your accommodation',
      bullets: [
        'Fethiye town: compare your accommodation address with Fethiye Otogar and the operator’s current designated stops.',
        'Göcek: MUTTAŞ’s route page lists Göcek BP and Göcek Petrol Ofisi stops; check the current stop and which direction serves your journey.',
        'Çalış or Ölüdeniz: the MUTTAŞ airport route page lists Fethiye Otogar as its final stop, not these resort areas. Confirm an onward local service or arrange a direct ride to your address.',
        'Travelling with children or several suitcases: include the extra transfer between the shuttle stop and your accommodation when comparing options.',
      ],
    },
    {
      heading: 'Before you fly',
      bullets: [
        'Check the operator’s timetable and route again for your arrival date; flight changes, traffic and operating conditions can affect schedules.',
        'Save the exact accommodation address and the shuttle stop you intend to use.',
        'For a private pickup, keep the confirmation and meeting-point instructions available after landing.',
        'Do not rely on an old fare screenshot: use the operator’s current fare information before travel.',
      ],
    },
    {
      heading: 'Frequently asked questions',
      faqs: [
        { question: 'Is there a shuttle from Dalaman Airport to Fethiye?', answer: 'Yes. The airport lists HAVAŞ and MUTTAŞ services to Fethiye. Check the operators’ current route and travel-date information before departure.' },
        { question: 'Does the MUTTAŞ bus go to Ölüdeniz or Çalış?', answer: 'The MUTTAŞ airport route page lists Fethiye Otogar as its final stop. It does not list Ölüdeniz or Çalış as final destinations, so confirm an onward journey for your exact address.' },
        { question: 'Does the airport shuttle leave at a fixed time?', answer: 'MUTTAŞ says airport-side departures on line 48-25 vary according to aircraft landing times. Check the live route page for your arrival date.' },
        { question: 'Can I reserve a MUTTAŞ airport bus seat in advance?', answer: 'The current MUTTAŞ route page says airport vehicles do not offer reservations or advance ticket sales. Check the operator’s page before travelling in case its policy changes.' },
      ],
    },
  ],
  sources: [
    { label: 'MUTTAŞ route 48-25: Fethiye Otogar–Dalaman Airport', url: 'https://ulasim.muttas.com.tr/hat/48-25-fethiye-otogar-dalaman-havalimani-439' },
    { label: 'Dalaman Airport: buses and public transport', url: 'https://www.dalamanairport.aero/en/passengers/public-transport/' },
    { label: 'HAVAŞ: routes, timetables and fares', url: 'https://www.havas.net/otobus-hizmetleri' },
    { label: 'MUTTAŞ: airport services', url: 'https://www.muttas.com.tr/sayfa/havalimani-seferleri' },
  ],
} as const
