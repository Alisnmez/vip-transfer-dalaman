import type { PublicReview, ReviewPage } from './api'

// Fictional examples for classroom presentations on the Render test site.
const examples = [
  ["Hannah Prescott", 5, "Dalaman → Marmaris", "landed just after midnight from Manchester, saw our name board straight away. in Marmaris before I'd even got round to texting my sister"],
  ["Graham Lister", 5, "Dalaman → İçmeler", "easy pickup and a lovely driver. cheers!"],
  ["Nina Berger", 5, "Dalaman → Marmaris", "Pünktlich trotz später Landung. Am Ausgang direkt unser Schild gesehen, das war nach dem Flug echt angenehm."],
  ["Laura Mayfield", 5, "Dalaman → Ölüdeniz", "2 kids, buggy and 3 cases and nobody had to sit with a bag on their lap. That alone did it for me 😂"],
  ["Martin Bellamy", 5, "Fethiye → Dalaman", "4.50 pickup, bang on time"],
  ["Mia Thornton", 5, "Dalaman → Göcek", "Waited longer for our suitcases than for the transfer. We sent a quick message from baggage reclaim and got directions straight back. In Göcek in no time."],
  ["Tom Radcliffe", 5, "Dalaman → Dalyan", "sent the villa pin before we flew. straight to the right gate with no messing about"],
  ["Анна Морозова", 5, "Даламан → Фетхие", "рейс задержался, написала уже после посадки. водитель быстро ответил и объяснил, куда идти. до отеля доехали спокойно, спасибо"],
  ["Debbie Sutton", 5, "Marmaris → Dalaman", "Driver messaged at 6.10 to say he was outside reception for our 6.15 pickup. They hadn't opened the breakfast room yet, so we grabbed something at the airport. Loads of time."],
  ["Neil Cartwright", 5, "Dalaman → Hisarönü", "straight to the hotel, no coach stops 👍"],
  ["Isobel Whitaker", 5, "Dalaman → Sarıgerme", "Only a quick trip to Sarıgerme but worth having it booked. We knew what we were paying and got dropped right at reception."],
  ["Jack Fletcher", 5, "Dalaman ↔ Fethiye", "both pickups spot on, thanks"],
  ["Lukas Hoffmann", 5, "Dalaman → Dalyan", "Hat alles gepasst. Sauberes Auto, netter Fahrer."],
  ["Anna Kirkland", 5, "Dalaman → Kalkan", "The road to Kalkan took a bit longer than I thought. Asked if we could stop for the loo halfway and it was no bother. Very comfy seats too."],
  ["Robyn Dawson", 5, "Ölüdeniz → Dalaman", "Our hotel has 2 entrances. Driver sent a pin for the one he was at. Proper handy at that time of the morning."],
  ["Emily Harrington", 5, "Dalaman → Marmaris", "First solo trip for me. Was a bit nervous about finding the car, but picked out my name on the board as soon as I came out."],
  ["Ben Atkinson", 5, "Dalaman → Çalış", "price on the booking page was what we were quoted. easy enough on my phone too"],
  ["Julia Weber", 5, "Fethiye → Dalaman", "Abholung um 5 Uhr, Fahrer war schon da als wir unten ankamen. So früh will man einfach nur los, hat super geklappt."],
  ["Rachel Newman", 5, "Dalaman → Turunç", "lovely getting into a cool van after standing out in that heat. nice drive to Turunç"],
  ["Olivia Jarvis", 5, "Dalaman → Göcek", "Dropped us at the marina entrance and pointed out the right pontoon. Saved us a walk with the cases!"],
  ["Chris Vaughan", 5, "Dalaman ↔ Dalyan", "We booked the return at the same time. I stuck both pickup details in my calendar before we left home and didn't have to think about it again."],
  ["Fiona Ellwood", 5, "Dalaman → İçmeler", "My mum's a bit slow getting into taller cars and the driver didn't rush her at all. He had the cases in by the time she was settled."],
  ["Илья Соколов", 5, "Даламан → Гёджек", "всё чётко, доехали быстро. спасибо!"],
  ["Ellie Greenwood", 5, "Dalaman → Ölüdeniz", "Air con already on when we got in. bliss"],
  ["Dan Mercer", 5, "Dalaman → Kaş", "Seven of us and seven cases, the Sprinter took the lot. Being able to keep the group together was the main thing for us."],
  ["Megan Davies", 5, "Marmaris → Dalaman", "Hotel had shut the usual entrance for roadworks so I sent the new one the night before. Picked us up there no problem."],
  ["Leah Beaumont", 5, "Dalaman → Fethiye", "We checked about a child seat when booking. It was there when we arrived and we had time to get our little one settled."],
  ["Daniel Krüger", 5, "Dalaman → Ölüdeniz", "sauberer Bus, netter Fahrer. gern wieder"],
  ["Sam Wilkins", 5, "Dalaman → Sarıgerme", "kids fell asleep before we got to the hotel, says it all really"],
  ["Vicky Rowland", 5, "Dalaman → Marmaris", "Flight came in late. Thought we'd be ages getting away but got a reply as soon as I messaged, and he was exactly where he said."],
  ["Alex Stafford", 5, "Dalaman ↔ Hisarönü", "Moved our flight and asked if we could change the pickup. Got a new time back by message and that's when he turned up. Easy."],
  ["Beth Collins", 5, "Dalaman → Dalyan", "booked from my phone while packing. liked being able to see the different vans before i sent it off"],
  ["Елена Кузнецова", 5, "Мармарис → Даламан", "Обратный трансфер был рано утром. Водитель подъехал к нужному входу и сам помог с чемоданами. В аэропорт приехали с запасом."],
  ["Leo Marsh", 5, "Dalaman → Kalkan", "4 of us in the Vito, a case each. comfy enough to get some sleep on the way to the villa"],
  ["Sophie Young", 5, "Dalaman → Ölüdeniz", "I got a message saying they'd received the request first, then the actual pickup details later that evening. Clear enough which one was the confirmation."],
  ["Andy Keating", 5, "Fethiye → Dalaman", "Booked the return on its own. They double checked the hotel address and the driver was at the right entrance at 5am."],
  ["Kate Pennington", 5, "Dalaman → Marmaris", "clean van, nice drive. we'd use them again"],
  ["Sophie Neumann", 5, "Dalaman → Sarıgerme", "Treffpunkt gut erklärt, Fahrer gleich gefunden. Nach der Landung war das echt entspannt."],
  ["Molly Jennings", 5, "Dalaman → İçmeler", "There must've been 20 name boards outside when we arrived. The message said which end to go to and we found ours without having to ring."],
  ["Paul Easton", 5, "Dalaman → Göcek", "just us two with hand luggage. glad we didn't bother with a hire car this time"],
  ["Kim Norris", 5, "Dalaman → Çalış", "Apartment name was different on the map. sent a pin and he got the right building first go"],
  ["Zoe Taylor", 5, "Hisarönü → Dalaman", "Our place was up a narrow lane and the driver came right to the gate. Much appreciated when it's dark and you've got cases."],
  ["Jill Forsyth", 5, "Dalaman → Fethiye", "comfy ride to Fethiye, would book again"],
  ["Pete Hadley", 5, "Dalaman → Dalaman town", "Just needed a lift to our overnight hotel. Driver waited by the entrance while we got the receptionist to let us in, which was kind."],
  ["Miriam Fischer", 5, "Dalaman ↔ İçmeler", "Hin und zurück gebucht. Unser Hotel hat zwei Zufahrten, da war die kurze Nachricht vom Fahrer am Rückreisetag sehr hilfreich."],
  ["Nina Spencer", 5, "Dalaman → Ölüdeniz", "Had the pushchair and two big cases. I'd been worrying about fitting it all in, but it went in fine without moving the seats."],
  ["Owen Lawson", 5, "Dalyan → Dalaman", "driver was already by reception and sent the van details so we knew which one. even had time for a coffee at the airport"],
  ["Jenny Abbott", 5, "Dalaman → Marmaris", "helpful driver, spotless van"],
  ["Suzanne Riley", 5, "Dalaman ↔ Fethiye", "Both legs were good. Our return driver was a few mins early. Going straight from the apartment to the terminal made the last morning a lot easier."],
  ["Dave Glover", 5, "Dalaman → Sarıgerme", "on time, no fuss. thanks!"],
  ["Дмитрий Волков", 5, "Даламан → Дальян", "Нас было пятеро и у каждого чемодан. Всё поместилось, в салоне прохладно. Высадили прямо у входа в гостиницу, очень удобно."],
  ["Aisha Bennett", 5, "Dalaman → İçmeler", "Saved the pickup message before takeoff as my data never works straight away abroad. Found the spot fine. Would use again for İçmeler."],
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
