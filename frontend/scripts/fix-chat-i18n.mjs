// English chats should be English; Hinglish locale keeps the original Hinglish
// (otherwise it would inherit the new English via fallback).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MSG = join(__dirname, "..", "messages");

const enChats = {
  restaurant: ["Can you send today's menu?", "🍽️ Butter Naan ₹40 · Paneer Tikka ₹220 · Dal Makhani ₹180. Shall I place your order?", "2 butter naan, 1 paneer tikka", "📝 ₹300 · Ready in 25 min. Pay on pickup?", "yes", "✅ Order #R210 confirmed! See you at 7 PM."],
  kirana: ["How much is the flour (atta)?", "Flour 5kg ₹250, 1kg ₹55. ✅ In stock!", "Send 2 flour, 1 toor dal", "📝 Order ₹680 · Pickup by 5 PM. Reply YES to confirm.", "yes", "✅ Order #1234 confirmed! 💵 Cash on pickup."],
  salon: ["Any haircut slot tomorrow?", "Tomorrow's free: 11 AM, 2 PM, 5 PM. Which one?", "2 PM works", "✅ Booked — Haircut, tomorrow 2 PM. We'll send a reminder 🔔"],
  clinic: ["Is the doctor available today?", "OPD today 4–8 PM. Shall I book an appointment?", "yes, 6 PM", "✅ Token #18 · 6:00 PM. SMS sent 📩"],
};
const enMobile = ["Is the clinic open today? Is Dr. Mehta available?", "Hello! 🩺 We're open 10–7. Dr. Mehta has a 4:30 PM slot free.", "Book it — Anjali, 28", "✅ #C-204 confirmed · 4:30 PM today. Reminder set 🔔"];

const hingChats = {
  restaurant: ["Aaj ka menu bhejo?", "🍽️ Butter Naan ₹40 · Paneer Tikka ₹220 · Dal Makhani ₹180. Order karein?", "2 butter naan, 1 paneer tikka", "📝 ₹300 · Ready in 25 min. Pay on pickup?", "haan", "✅ Order #R210 confirmed! See you at 7 PM."],
  kirana: ["kitne ka hai atta?", "Atta 5kg ₹250, 1kg ₹55. ✅ In stock!", "2 atta, 1 toor dal bhejo", "📝 Order ₹680 · Pickup by 5 PM. Reply YES to confirm.", "haan", "✅ Order #1234 confirmed! 💵 Cash on pickup."],
  salon: ["Kal haircut ka slot hai?", "Kal khaali: 11 AM, 2 PM, 5 PM. Kaunsa karein?", "2 PM theek hai", "✅ Booked — Haircut, kal 2 PM. Reminder bhej denge 🔔"],
  clinic: ["Doctor aaj available hain?", "Aaj OPD 4–8 PM. Appointment book karein?", "haan, 6 baje", "✅ Token #18 · 6:00 PM. SMS bhej diya 📩"],
};
const hingMobile = ["Clinic aaj khulega? Dr. Mehta available?", "Namaste! 🩺 Khula hai 10–7. Dr. Mehta ka 4:30 PM slot free hai.", "Book kar do — Anjali, 28", "✅ #C-204 confirmed · 4:30 PM aaj. Reminder set 🔔"];

function applyChats(loc, chats, mobile) {
  const file = join(MSG, `${loc}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  for (const key of Object.keys(chats)) {
    json.home.showcase.items[key] = json.home.showcase.items[key] || {};
    json.home.showcase.items[key].chat = chats[key];
  }
  json.home.mobileStory = json.home.mobileStory || {};
  json.home.mobileStory.chat = mobile;
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`updated chats in ${loc}.json`);
}

applyChats("en", enChats, enMobile);
applyChats("hinglish", hingChats, hingMobile);
