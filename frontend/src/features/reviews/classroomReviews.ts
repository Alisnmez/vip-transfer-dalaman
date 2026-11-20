import type { PublicReview, ReviewPage } from './api'

// Fictional examples for classroom presentations on the Render test site.
const examples = [
  ["Hannah Prescott", 5, "Dalaman → Marmaris", "We got in after midnight from Manchester. I spotted the board as soon as we came out and we were on our way before I'd managed to text home."],
  ["Graham Lister", 5, "Dalaman → İçmeler", "We followed the pickup instructions and saw our name on a board just outside arrivals. The van was spotless and the driver took both cases while we got the children settled."],
  ["Laura Mayfield", 5, "Dalaman → Ölüdeniz", "Two kids, a buggy and three cases. Everything fitted without having to put a bag on anyone's lap, which was exactly what I wanted after the flight."],
  ["Martin Bellamy", 5, "Fethiye → Dalaman", "Pickup at 4:50 am and the driver was already outside our apartment when we came down. Uneventful in the best possible way."],
  ["Mia Thornton", 5, "Dalaman → Göcek", "Our bags took ages to come out. I sent a quick message from the carousel and got a reply saying where to meet. We were in Göcek not long after leaving the terminal."],
  ["Tom Radcliffe", 5, "Dalaman → Dalyan", "Booked this after deciding against a hire car for a short break. I sent a pin for the villa and we went straight to the right gate."],
  ["Debbie Sutton", 5, "Marmaris → Dalaman", "Our return pickup was at 6:15. The driver messaged when he was outside reception, helped with the bags and left us loads of time at the airport."],
  ["Neil Cartwright", 5, "Dalaman → Hisarönü", "First time booking a private transfer. Nice to go straight to the hotel instead of sitting through all the coach drop-offs."],
  ["Isobel Whitaker", 5, "Dalaman → Sarıgerme", "Only a short hop to Sarıgerme. We knew the price before we booked and the driver dropped us right at the hotel entrance. Exactly what we wanted."],
  ["Jack Fletcher", 5, "Dalaman ↔ Fethiye", "Our flight landed early and I thought we'd have to wait. The driver messaged while we were at the carousel. Return was just as straightforward."],
  ["Anna Kirkland", 5, "Dalaman → Kalkan", "Longer journey than I expected, but the seats were comfy. We asked for a quick stop for the loo and it wasn't a fuss."],
  ["Robyn Dawson", 5, "Ölüdeniz → Dalaman", "Our hotel has two entrances. The driver sent a pin for the one by reception so we knew exactly where to wait. Helpful when you're leaving before breakfast."],
  ["Emily Harrington", 5, "Dalaman → Marmaris", "I was travelling on my own and the clear pickup instructions made a real difference. Recognised the board and didn't need to ring anyone."],
  ["Ben Atkinson", 5, "Dalaman → Çalış", "The website showed the price before I entered our contact details. Turned out to be the same amount we were quoted for the ride. Much easier to budget."],
  ["Rachel Newman", 5, "Dalaman → Turunç", "We landed in the afternoon heat. The van was already cool, the luggage went in straight away and the driver kept us posted about the journey to Turunç."],
  ["Olivia Jarvis", 5, "Dalaman → Göcek", "Driver dropped us at the marina entrance and pointed us toward the right pontoon. Saved us dragging two cases along the whole waterfront."],
  ["Chris Vaughan", 5, "Dalaman ↔ Dalyan", "I booked both legs together for Dalyan. I could see the airport meeting details and the return pickup time in the messages, so I could put both in my calendar before we flew."],
  ["Fiona Ellwood", 5, "Dalaman → İçmeler", "My mum takes a bit longer to get into a van. The driver gave her time and loaded the cases while she got settled. That was appreciated."],
  ["Ellie Greenwood", 5, "Dalaman → Ölüdeniz", "The air con was on when we got in. After waiting in the heat by the terminal that was the best part of the whole journey."],
  ["Dan Mercer", 5, "Dalaman → Kaş", "Seven of us in the Sprinter with a case each. Everyone had room to stretch out, and it was nice getting to Kaş together without splitting into two cars."],
  ["Megan Davies", 5, "Marmaris → Dalaman", "Our hotel changed which entrance taxis could use. I sent the new entrance the night before and got a reply confirming it. Pickup was from the right spot."],
  ["Leah Beaumont", 5, "Dalaman → Fethiye", "We asked about a child seat when we booked and it was ready when we arrived. The driver waited while we got our toddler settled, no rushing us."],
  ["Sam Wilkins", 5, "Dalaman → Sarıgerme", "Quick from arrivals to the hotel. The kids were asleep before we got there, which tells you how smooth the drive was."],
  ["Vicky Rowland", 5, "Dalaman → Marmaris", "Our flight was late getting into Dalaman. I messaged when we landed and got a quick reply. The driver was where he said he'd be and we went straight to the hotel."],
  ["Alex Stafford", 5, "Dalaman ↔ Hisarönü", "We changed our return flight and asked whether the pickup could be moved. They confirmed a new time by message and that's when the driver arrived."],
  ["Beth Collins", 5, "Dalaman → Dalyan", "Booked on my phone while we were packing. I could compare vehicles and check the price before submitting the request. Pickup in Dalyan was just as easy."],
  ["Leo Marsh", 5, "Dalaman → Kalkan", "Four of us in a Vito with a case each. It was quiet enough to get a bit of sleep and we went straight to the villa."],
  ["Sophie Young", 5, "Dalaman → Ölüdeniz", "The request email said we still needed to wait for confirmation. A separate message came through later that evening with the journey details. Easy to tell which was which."],
  ["Andy Keating", 5, "Fethiye → Dalaman", "Booked the return separately from our arrival. They checked the exact hotel address and the driver was at the correct entrance at 5 am. Very organised."],
  ["Kate Pennington", 5, "Dalaman → Marmaris", "Clean seats, decent room and no extra stops. Would book the same option again for the August trip."],
  ["Molly Jennings", 5, "Dalaman → İçmeler", "There were a lot of name boards at arrivals. The pickup message told us which end to walk to, and we found our driver without having to ring anyone."],
  ["Paul Easton", 5, "Dalaman → Göcek", "Just the two of us and two cabin bags. The transfer was quicker than collecting a rental car by a long way. Happy with the choice."],
  ["Kim Norris", 5, "Dalaman → Çalış", "The apartment name looked different on my booking and on the map. We sent a pin and the driver found the right building first time."],
  ["Zoe Taylor", 5, "Hisarönü → Dalaman", "Early morning collection. The driver came up the narrow lane to the gate, so we didn't have to haul cases down the hill in the dark."],
  ["Jill Forsyth", 5, "Dalaman → Fethiye", "Comfortable run to Fethiye. We got in, put our bags down and relaxed for the first time since getting up for the flight. I'd book it again."],
  ["Pete Hadley", 5, "Dalaman → Dalaman town", "Only needed a short lift to an overnight hotel. The driver pulled up near the lobby and waited until the receptionist opened the door."],
  ["Nina Spencer", 5, "Dalaman → Ölüdeniz", "We had two big cases and a folded pushchair and I'd been worrying about whether they'd fit. There was enough space and we didn't have to rearrange the seats."],
  ["Owen Lawson", 5, "Dalyan → Dalaman", "The driver was already parked by reception and sent the van details so it was easy to spot him. Plenty of time at Dalaman for a coffee before boarding."],
  ["Jenny Abbott", 5, "Dalaman → Marmaris", "It was pouring when we landed. The driver pulled up close to the shelter so we could load the bags without getting soaked."],
  ["Suzanne Riley", 5, "Dalaman ↔ Fethiye", "Airport pickup was smooth and the driver for our return arrived a few minutes early. Being able to go straight from our apartment to the terminal made the last morning much easier."],
  ["Dave Glover", 5, "Dalaman → Sarıgerme", "Everything as agreed. The booking was for one of the smaller vehicles and it was the right size for us."],
  ["Aisha Bennett", 5, "Dalaman → İçmeler", "I saved the pickup instructions before takeoff because my data is unreliable abroad. Found the meeting point straight away and the ride to İçmeler was easy."],
] as const

export function getClassroomReviews(page: number): ReviewPage<PublicReview> {
  const size = 10
  const start = page * size
  return {
    content: examples.slice(start, start + size).map(([name, rating, route, comment], index) => ({
      id: -(start + index + 1),
      name,
      rating,
      comment: `${route}\n\n${comment}`,
    })),
    number: page,
    totalPages: Math.ceil(examples.length / size),
    totalElements: examples.length,
  }
}
