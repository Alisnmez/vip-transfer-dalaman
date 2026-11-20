import type { PublicReview, ReviewPage } from './api'

// Fictional examples for classroom presentations on the Render test site.
const examples = [
  ["Hannah Prescott", 5, "Dalaman → Marmaris", "We got in after midnight from Manchester. I spotted the board as soon as we came out and we were on our way before I'd managed to text home."],
  ["Graham Lister", 5, "Dalaman → İçmeler", "Easy pickup, lovely driver. Would book again."],
  ["Nina Berger", 5, "Dalaman → Marmaris", "Wir sind spät in Dalaman gelandet. Der Fahrer hat uns am Ausgang mit einem Namensschild empfangen. Die Fahrt zum Hotel war angenehm und wir konnten uns endlich entspannen."],
  ["Laura Mayfield", 5, "Dalaman → Ölüdeniz", "Two kids, a buggy and three cases. Everything fitted without having to put a bag on anyone's lap, which was exactly what I wanted after the flight."],
  ["Martin Bellamy", 5, "Fethiye → Dalaman", "Bang on time for our early flight."],
  ["Mia Thornton", 5, "Dalaman → Göcek", "Our bags took ages to come out. I sent a quick message from the carousel and got a reply saying where to meet. We were in Göcek not long after leaving the terminal."],
  ["Tom Radcliffe", 5, "Dalaman → Dalyan", "Booked this after deciding against a hire car for a short break. I sent a pin for the villa and we went straight to the right gate."],
  ["Анна Морозова", 5, "Даламан → Фетхие", "Наш рейс задержался, и я написала водителю после посадки. Он быстро ответил и объяснил, где встретиться. До отеля доехали спокойно, с чемоданами помогли."],
  ["Debbie Sutton", 5, "Marmaris → Dalaman", "Our return pickup was at 6:15. The driver messaged when he was outside reception, helped with the bags and left us loads of time at the airport."],
  ["Neil Cartwright", 5, "Dalaman → Hisarönü", "Straight to the hotel. Just what we needed."],
  ["Isobel Whitaker", 5, "Dalaman → Sarıgerme", "Only a short hop to Sarıgerme. We knew the price before we booked and the driver dropped us right at the hotel entrance. Exactly what we wanted."],
  ["Jack Fletcher", 5, "Dalaman ↔ Fethiye", "Both pickups went smoothly. Cheers!"],
  ["Lukas Hoffmann", 5, "Dalaman → Dalyan", "Pünktlich, sauber und unkompliziert."],
  ["Anna Kirkland", 5, "Dalaman → Kalkan", "Longer journey than I expected, but the seats were comfy. We asked for a quick stop for the loo and it wasn't a fuss."],
  ["Robyn Dawson", 5, "Ölüdeniz → Dalaman", "Our hotel has two entrances. The driver sent a pin for the one by reception so we knew exactly where to wait. Helpful when you're leaving before breakfast."],
  ["Emily Harrington", 5, "Dalaman → Marmaris", "I was travelling on my own and the clear pickup instructions made a real difference. Recognised the board and didn't need to ring anyone."],
  ["Ben Atkinson", 5, "Dalaman → Çalış", "The website showed the price before I entered our contact details. Turned out to be the same amount we were quoted for the ride. Much easier to budget."],
  ["Julia Weber", 5, "Fethiye → Dalaman", "Wir mussten vor Sonnenaufgang los. Der Fahrer stand schon vor unserer Unterkunft, als wir runterkamen. Am Flughafen hatten wir noch genug Zeit fürs Frühstück."],
  ["Rachel Newman", 5, "Dalaman → Turunç", "We landed in the afternoon heat. The van was already cool, the luggage went in straight away and the driver kept us posted about the journey to Turunç."],
  ["Olivia Jarvis", 5, "Dalaman → Göcek", "Driver dropped us at the marina entrance and pointed us toward the right pontoon. Saved us dragging two cases along the whole waterfront."],
  ["Chris Vaughan", 5, "Dalaman ↔ Dalyan", "I booked both legs together for Dalyan. I could see the airport meeting details and the return pickup time in the messages, so I could put both in my calendar before we flew."],
  ["Fiona Ellwood", 5, "Dalaman → İçmeler", "My mum takes a bit longer to get into a van. The driver gave her time and loaded the cases while she got settled. That was appreciated."],
  ["Илья Соколов", 5, "Даламан → Гёджек", "Всё чётко, доехали быстро. Спасибо!"],
  ["Ellie Greenwood", 5, "Dalaman → Ölüdeniz", "The air con was on when we got in. After waiting in the heat by the terminal that was the best part of the whole journey."],
  ["Dan Mercer", 5, "Dalaman → Kaş", "Seven of us in the Sprinter with a case each. Everyone had room to stretch out, and it was nice getting to Kaş together without splitting into two cars."],
  ["Megan Davies", 5, "Marmaris → Dalaman", "Our hotel changed which entrance taxis could use. I sent the new entrance the night before and got a reply confirming it. Pickup was from the right spot."],
  ["Leah Beaumont", 5, "Dalaman → Fethiye", "We asked about a child seat when we booked and it was ready when we arrived. The driver waited while we got our toddler settled, no rushing us."],
  ["Daniel Krüger", 5, "Dalaman → Ölüdeniz", "Sauberer Bus, netter Fahrer. Gerne wieder."],
  ["Sam Wilkins", 5, "Dalaman → Sarıgerme", "Quick from arrivals to the hotel. The kids were asleep before we got there, which tells you how smooth the drive was."],
  ["Vicky Rowland", 5, "Dalaman → Marmaris", "Our flight was late getting into Dalaman. I messaged when we landed and got a quick reply. The driver was where he said he'd be and we went straight to the hotel."],
  ["Alex Stafford", 5, "Dalaman ↔ Hisarönü", "We changed our return flight and asked whether the pickup could be moved. They confirmed a new time by message and that's when the driver arrived."],
  ["Beth Collins", 5, "Dalaman → Dalyan", "Booked on my phone while we were packing. I could compare vehicles and check the price before submitting the request. Pickup in Dalyan was just as easy."],
  ["Елена Кузнецова", 5, "Мармарис → Даламан", "Заказали обратный трансфер на раннее утро. Водитель подъехал к нужному входу в отель и помог погрузить чемоданы. Доехали без спешки."],
  ["Leo Marsh", 5, "Dalaman → Kalkan", "Four of us in a Vito with a case each. It was quiet enough to get a bit of sleep and we went straight to the villa."],
  ["Sophie Young", 5, "Dalaman → Ölüdeniz", "The request email said we still needed to wait for confirmation. A separate message came through later that evening with the journey details. Easy to tell which was which."],
  ["Andy Keating", 5, "Fethiye → Dalaman", "Booked the return separately from our arrival. They checked the exact hotel address and the driver was at the correct entrance at 5 am. Very organised."],
  ["Kate Pennington", 5, "Dalaman → Marmaris", "Clean seats, decent room and no extra stops. Would book the same option again for the August trip."],
  ["Sophie Neumann", 5, "Dalaman → Sarıgerme", "Der Treffpunkt war in der Nachricht gut beschrieben. Wir fanden den Fahrer gleich und waren mit unseren beiden Koffern schnell im Hotel."],
  ["Molly Jennings", 5, "Dalaman → İçmeler", "There were a lot of name boards at arrivals. The pickup message told us which end to walk to, and we found our driver without having to ring anyone."],
  ["Paul Easton", 5, "Dalaman → Göcek", "Just the two of us and two cabin bags. The transfer was quicker than collecting a rental car by a long way. Happy with the choice."],
  ["Kim Norris", 5, "Dalaman → Çalış", "The apartment name looked different on my booking and on the map. We sent a pin and the driver found the right building first time."],
  ["Zoe Taylor", 5, "Hisarönü → Dalaman", "Early morning collection. The driver came up the narrow lane to the gate, so we didn't have to haul cases down the hill in the dark."],
  ["Jill Forsyth", 5, "Dalaman → Fethiye", "Comfortable run to Fethiye. We got in, put our bags down and relaxed for the first time since getting up for the flight. I'd book it again."],
  ["Pete Hadley", 5, "Dalaman → Dalaman town", "Only needed a short lift to an overnight hotel. The driver pulled up near the lobby and waited until the receptionist opened the door."],
  ["Miriam Fischer", 5, "Dalaman ↔ İçmeler", "Hin- und Rückfahrt zusammen gebucht. Am Rückreisetag hat der Fahrer kurz geschrieben, an welchem Eingang er wartet. Das war praktisch, weil unser Hotel zwei Zufahrten hat."],
  ["Nina Spencer", 5, "Dalaman → Ölüdeniz", "We had two big cases and a folded pushchair and I'd been worrying about whether they'd fit. There was enough space and we didn't have to rearrange the seats."],
  ["Owen Lawson", 5, "Dalyan → Dalaman", "The driver was already parked by reception and sent the van details so it was easy to spot him. Plenty of time at Dalaman for a coffee before boarding."],
  ["Jenny Abbott", 5, "Dalaman → Marmaris", "Driver was helpful and the van was spotless."],
  ["Suzanne Riley", 5, "Dalaman ↔ Fethiye", "Airport pickup was smooth and the driver for our return arrived a few minutes early. Being able to go straight from our apartment to the terminal made the last morning much easier."],
  ["Dave Glover", 5, "Dalaman → Sarıgerme", "On time and no fuss. Thanks!"],
  ["Дмитрий Волков", 5, "Даламан → Дальян", "Нас было пятеро с чемоданами. Вещи поместились без проблем, в салоне было чисто и прохладно. Водитель высадил нас прямо у входа в гостиницу."],
  ["Aisha Bennett", 5, "Dalaman → İçmeler", "I saved the pickup instructions before takeoff because my data is unreliable abroad. Found the meeting point straight away and the ride to İçmeler was easy."],
] as const

const newestSample = Date.UTC(2026, 10, 19, 17, 42)
const hourInMilliseconds = 60 * 60 * 1000

export function getClassroomReviews(page: number): ReviewPage<PublicReview> {
  const size = 10
  const start = page * size
  return {
    content: examples.slice(start, start + size).map(([name, rating, route, comment], index) => ({
      id: -(start + index + 1),
      name,
      rating,
      createdAt: new Date(newestSample - (start + index) * 29.65 * hourInMilliseconds).toISOString(),
      comment: `${route}\n\n${comment}`,
    })),
    number: page,
    totalPages: Math.ceil(examples.length / size),
    totalElements: examples.length,
  }
}
