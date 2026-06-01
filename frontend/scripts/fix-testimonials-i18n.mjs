// English testimonial quotes should be English; Hinglish locale keeps the
// original (mixed Hinglish) voice so it doesn't inherit the new English.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MSG = join(__dirname, "..", "messages");

// Original (mixed-voice) quotes — what the Hinglish locale should show.
const hinglishItems = [
  { quote: "Pehle har order phone pe lena padta tha. Ab Whatly khud reply karta hai — main bas cooking pe focus karta hoon.", type: "Restaurant" },
  { quote: "Membership queries, class timings, renewals — all handled on WhatsApp before I even reach the floor.", type: "Gym & fitness" },
  { quote: "Hinglish orders bhi samajh leta hai. '2 atta 1 dal' type karo, total ready. Customers ko bahut pasand aaya.", type: "Kirana store" },
  { quote: "My evening rush meant 30 missed messages. Now every client gets slots instantly and I book them right in chat.", type: "Salon & spa" },
  { quote: "Customers ping for kurti sizes and prices all day. Whatly shares the catalogue and books trials — I just stitch.", type: "Boutique" },
  { quote: "Appointment reminders alone cut my no-shows by half. Hours and FAQs are answered 24/7. Worth every rupee.", type: "Clinic" },
];

// English replacements for the two Hinglish quotes.
const en = JSON.parse(readFileSync(join(MSG, "en.json"), "utf8"));
en.home.testimonials.items[0].quote =
  "Earlier I had to take every order on the phone. Now Whatly replies on its own — I just focus on cooking.";
en.home.testimonials.items[2].quote =
  "It even understands Hinglish orders. Type '2 atta 1 dal' and the total's ready. My customers loved it.";
writeFileSync(join(MSG, "en.json"), JSON.stringify(en, null, 2) + "\n", "utf8");
console.log("en.json testimonials → English");

const hing = JSON.parse(readFileSync(join(MSG, "hinglish.json"), "utf8"));
hing.home.testimonials.items = hinglishItems;
writeFileSync(join(MSG, "hinglish.json"), JSON.stringify(hing, null, 2) + "\n", "utf8");
console.log("hinglish.json testimonials → original Hinglish voice");
