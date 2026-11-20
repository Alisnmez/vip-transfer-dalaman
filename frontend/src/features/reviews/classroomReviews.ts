import type { PublicReview, ReviewPage } from './api'

// Fictional examples for classroom presentations on the Render test site.
const examples = [
  ["Hannah P.", 5, "Dalaman → Marmaris", "We got in after midnight from Manchester. I spotted the board as soon as we came out and we were on our way before I'd managed to text home."],
  ["Graham L.", 4, "Dalaman → İçmeler", "The van was comfortable and the driver was lovely. Took us a few minutes to find him because we came out by the wrong doors. A photo of the meeting point would have helped."],
  ["Laura M.", 5, "Dalaman → Ölüdeniz", "Two kids, a buggy and three cases. Everything fitted without having to put a bag on anyone's lap, which was exactly what I wanted after the flight."],
  ["Martin B.", 5, "Fethiye → Dalaman", "Pickup at 4:50 am and the driver was already outside our apartment when we came down. Uneventful in the best possible way."],
  ["Mia T.", 4, "Dalaman → Göcek", "Our bags took ages. The driver replied straight away when I let him know. The ride itself was quick, though the van was warmer than I'd have liked at first."],
  ["Tom R.", 5, "Dalaman → Dalyan", "Booked this after deciding against a hire car for a short break. I sent a pin for the villa and we went straight to the right gate."],
  ["Debbie S.", 3, "Marmaris → Dalaman", "The return pickup was about 15 minutes late and I had to message to check. We made the flight with time to spare, but an update would have saved me pacing around reception."],
  ["Neil C.", 5, "Dalaman → Hisarönü", "First time booking a private transfer. Nice to go straight to the hotel instead of sitting through all the coach drop-offs."],
  ["Isobel W.", 4, "Dalaman → Sarıgerme", "Such a short drive that we didn't need anything fancy. The driver helped with our cases and the fixed price was clear when I booked."],
  ["Jack F.", 5, "Dalaman ↔ Fethiye", "Our flight landed early and I thought we'd have to wait. The driver messaged while we were at the carousel. Return was just as straightforward."],
  ["Anna K.", 5, "Dalaman → Kalkan", "Longer journey than I expected, but the seats were comfy. We asked for a quick stop for the loo and it wasn't a fuss."],
  ["Robyn D.", 4, "Ölüdeniz → Dalaman", "Found the booking email easily and it had the pickup time in it. The driver knew the hotel but was waiting on the road below reception, so we walked down with the bags."],
  ["Emily H.", 5, "Dalaman → Marmaris", "I was travelling on my own and the clear pickup instructions made a real difference. Recognised the board and didn't need to ring anyone."],
  ["Ben A.", 5, "Dalaman → Çalış", "The website showed the price before I entered our contact details. Turned out to be the same amount we were quoted for the ride. Much easier to budget."],
  ["Rachel N.", 3, "Dalaman → Turunç", "The driver was polite and the vehicle was clean. We still spent a while waiting outside before leaving, and nobody told us how long it would be. Fine once we got moving."],
  ["Olivia J.", 5, "Dalaman → Göcek", "Driver dropped us at the marina entrance and pointed us toward the right pontoon. Saved us dragging two cases along the whole waterfront."],
  ["Chris V.", 4, "Dalaman ↔ Dalyan", "Both rides went well. I would have liked the outbound and return pickup details in one place instead of looking through two messages."],
  ["Fiona E.", 5, "Dalaman → İçmeler", "My mum takes a bit longer to get into a van. The driver gave her time and loaded the cases while she got settled. That was appreciated."],
  ["Ellie G.", 5, "Dalaman → Ölüdeniz", "The air con was on when we got in. After waiting in the heat by the terminal that was the best part of the whole journey."],
  ["Dan M.", 4, "Dalaman → Kaş", "We were a group of seven. The Sprinter had plenty of room, although the rear seats felt warmer than the front on the way out of the airport."],
  ["Megan D.", 5, "Marmaris → Dalaman", "Our hotel changed which entrance taxis could use. I sent the new entrance the night before and got a reply confirming it. Pickup was from the right spot."],
  ["Leah B.", 4, "Dalaman → Fethiye", "Travelled with a toddler. I'd asked about a child seat ahead of time and it was in the van. A note about the type of seat in the email would have been handy."],
  ["Sam W.", 5, "Dalaman → Sarıgerme", "Quick from arrivals to the hotel. The kids were asleep before we got there, which tells you how smooth the drive was."],
  ["Vicky R.", 2, "Dalaman → Marmaris", "We ended up waiting nearly half an hour outside and I couldn't get a clear pickup time by message. The trip was comfortable once we left but it was a frustrating start."],
  ["Alex S.", 5, "Dalaman ↔ Hisarönü", "We changed our return flight and asked whether the pickup could be moved. They confirmed a new time by message and that's when the driver arrived."],
  ["Beth C.", 4, "Dalaman → Dalyan", "No issues with the ride or the driver. The booking page on my phone took me a moment to figure out when I wanted to change the vehicle selection."],
  ["Leo M.", 5, "Dalaman → Kalkan", "Four of us in a Vito with a case each. It was quiet enough to get a bit of sleep and we went straight to the villa."],
  ["Sophie Y.", 5, "Dalaman → Ölüdeniz", "The request email said we still needed to wait for confirmation. A separate message came through later that evening with the journey details. Easy to tell which was which."],
  ["Andy K.", 4, "Fethiye → Dalaman", "Booked the return separately from our arrival. They asked for the exact hotel address, which was sensible. I'd put the address field a bit higher up in the form."],
  ["Kate P.", 5, "Dalaman → Marmaris", "Clean seats, decent room and no extra stops. Would book the same option again for the August trip."],
  ["Molly J.", 3, "Dalaman → İçmeler", "The driver did find us eventually and apologised for the wait. We had been standing near a different row of boards. Clearer directions would have made the arrival less stressful."],
  ["Paul E.", 5, "Dalaman → Göcek", "Just the two of us and two cabin bags. The transfer was quicker than collecting a rental car by a long way. Happy with the choice."],
  ["Kim N.", 4, "Dalaman → Çalış", "The ride was spot on. I did get a little confused by the apartment's name being spelt two ways, but we checked the map pin over message and it was fine."],
  ["Zoe T.", 5, "Hisarönü → Dalaman", "Early morning collection. The driver came up the narrow lane to the gate, so we didn't have to haul cases down the hill in the dark."],
  ["Jill F.", 4, "Dalaman → Fethiye", "Comfy enough to sit in for the whole ride. I couldn't get the Wi-Fi to connect, but the driver got us to the hotel without any trouble."],
  ["Pete H.", 5, "Dalaman → Dalaman town", "Only needed a short lift to an overnight hotel. The driver pulled up near the lobby and waited until the receptionist opened the door."],
  ["Nina S.", 5, "Dalaman → Ölüdeniz", "We had two big cases and a folded pushchair and I'd been worrying about whether they'd fit. There was enough space and we didn't have to rearrange the seats."],
  ["Owen L.", 4, "Dalyan → Dalaman", "Pickup on time and a smooth drive. We asked reception to call because the vehicle wasn't the colour I was expecting, but it was our ride."],
  ["Jenny A.", 5, "Dalaman → Marmaris", "It was pouring when we landed. The driver pulled up close to the shelter so we could load the bags without getting soaked."],
  ["Suzanne R.", 3, "Dalaman ↔ Fethiye", "Airport pickup was excellent. On the return we waited in reception a bit longer than expected and only got an update after we asked. I'd leave some extra time next time."],
  ["Dave G.", 5, "Dalaman → Sarıgerme", "Everything as agreed. The booking was for one of the smaller vehicles and it was the right size for us."],
  ["Aisha B.", 4, "Dalaman → İçmeler", "Straightforward ride after a long day. I'd have liked a simple offline copy of the meeting instructions because my phone data didn't kick in until we reached the hotel."],
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
