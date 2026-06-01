// Deep-merge additional `home` i18n keys per locale. Keys omitted for a locale
// fall back to English (see i18n/request.ts). Run with: node scripts/expand-home-i18n.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MSG = join(__dirname, "..", "messages");

function deepMerge(base, over) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(over)) {
    if (
      base[k] && over[k] &&
      typeof base[k] === "object" && typeof over[k] === "object" &&
      !Array.isArray(base[k]) && !Array.isArray(over[k])
    ) out[k] = deepMerge(base[k], over[k]);
    else out[k] = over[k];
  }
  return out;
}

// ---------------- English (complete) ----------------
const en = {
  bento: {
    eyebrow: "Built for",
    title: "Every kind of <em>shop</em>",
    subtitle: "From kirana counters to clinics — Whatly handles the chat so you can run the shop.",
    hoverCta: "Whatly replies in seconds — so you never miss one ↓",
    items: {
      restaurants: { title: "Restaurants", fact: "Diners order from whoever replies first — a late reply at the dinner rush is a lost table." },
      gyms: { title: "Gyms & studios", fact: "Most membership enquiries go cold if no one answers within the hour." },
      clinics: { title: "Clinics", fact: "Patients book the clinic that answers now — not the one that calls back later." },
      salons: { title: "Salons & spas", fact: "A booking message missed at peak hours is an empty chair you can't refill." },
      kirana: { title: "Kirana stores", fact: "Customers reorder from whoever confirms stock and price fastest." },
      boutiques: { title: "Boutiques", fact: "Shoppers asking for sizes buy from the first store that replies." },
    },
  },
  testimonials: {
    eyebrow: "Loved by shops",
    title: "What owners <em>say</em>",
    subtitle: "Kiranas, cafés, salons and clinics across India — closing more orders on WhatsApp with Whatly.",
    items: [
      { quote: "Pehle har order phone pe lena padta tha. Ab Whatly khud reply karta hai — main bas cooking pe focus karta hoon.", type: "Restaurant" },
      { quote: "Membership queries, class timings, renewals — all handled on WhatsApp before I even reach the floor.", type: "Gym & fitness" },
      { quote: "Hinglish orders bhi samajh leta hai. '2 atta 1 dal' type karo, total ready. Customers ko bahut pasand aaya.", type: "Kirana store" },
      { quote: "My evening rush meant 30 missed messages. Now every client gets slots instantly and I book them right in chat.", type: "Salon & spa" },
      { quote: "Customers ping for kurti sizes and prices all day. Whatly shares the catalogue and books trials — I just stitch.", type: "Boutique" },
      { quote: "Appointment reminders alone cut my no-shows by half. Hours and FAQs are answered 24/7. Worth every rupee.", type: "Clinic" },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "Live in *ten minutes*",
    subtitle: "From signup to first auto-reply. No tech skills, no migration.",
    cta: "Start now",
    steps: [
      { title: "Sign up free", body: "Phone number → verify on WhatsApp → 14-day trial. No credit card." },
      { title: "Connect WhatsApp Business", body: "One tap via Meta's official Embedded Signup. Your data stays yours." },
      { title: "Pick auto-replies", body: "12 ready templates — price, timings, menu, location. Edit answers, done." },
      { title: "Customers get instant answers", body: "The bot replies 24/7 in the customer's language. You watch the inbox." },
    ],
  },
  stats: {
    items: [
      { value: "6", label: "Languages supported" },
      { value: "₹399", label: "Starts from / month" },
      { value: "10 min", label: "To go live" },
      { value: "14-day", label: "Free trial" },
    ],
  },
  pricing: {
    title: "Plans that work best for your shop",
    subtitle: "Trusted by shops across India. Pick what fits how you sell — upgrade anytime.",
    monthly: "Monthly",
    yearly: "Yearly",
    saveBadge: "2 mo free",
    mostPopular: "Most popular",
    perYear: "year",
    perMonth: "month",
    conversations: "{count} conversations / month",
    startTrial: "Start free trial",
    whatsIncluded: "What's included:",
    plans: {
      starter: { name: "Starter", features: ["Auto-reply (6 languages)", "1,000 conversations/mo", "FAQ bot", "Inbox + dashboard", "Google Sheets sync"] },
      growth: { name: "Growth", features: ["Everything in Starter", "3,000 conversations/mo", "Orders + Pickup flow", "Bookings + Calendar", "Razorpay payment links", "Analytics"] },
      pro: { name: "Pro", features: ["Everything in Growth", "6,000 conversations/mo", "Broadcasts", "API + Webhooks", "Priority support"] },
    },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Common *questions*",
    subtitle: "Everything owners ask before they switch. Still unsure? Just message us.",
    items: [
      { q: "Will my customers know it's a bot?", a: "They get instant, accurate answers in their language. Most assume it's you typing fast. You can mark replies with 🤖 if you want full transparency." },
      { q: "Do I need a special WhatsApp number?", a: "Yes — a WhatsApp Business number (free, from the WhatsApp Business app). We connect to it via Meta's official integration." },
      { q: "What if a customer asks something my FAQs don't cover?", a: "The message lands in your inbox marked 'Needs reply'. You reply manually, or enable the AI add-on (₹699/mo) for smart fallback replies." },
      { q: "Which languages exactly?", a: "English, Hindi (देवनागरी), Hinglish, Bengali, Urdu, Bhojpuri. The bot detects what the customer wrote and replies in the same language." },
      { q: "How do I add new items / FAQs?", a: "Edit directly in the dashboard, or edit your Google Sheet — the bot auto-syncs every 15 minutes. Most owners prefer the Sheet." },
      { q: "Is there a setup fee or commitment?", a: "No setup fee. No commitment. 14-day free trial. Card not required for the trial." },
    ],
  },
  footer: {
    tagline: "WhatsApp automation for ambitious Indian shops — auto-replies, orders and bookings in six languages.",
    product: "Product",
    company: "Company",
    contactUs: "Contact us",
    links: {
      features: "Features", pricing: "Pricing", faq: "FAQ", startTrial: "Start free trial",
      about: "About us", stories: "Customer stories", careers: "Careers", liveChat: "Live chat",
    },
    rights: "All rights reserved.",
  },
  useCaseEyebrow: "Use case",
  showcase: {
    items: {
      restaurant: {
        title: "Restaurants",
        blurb: "Your busiest hours shouldn't mean missed orders. Whatly shares the menu, takes the order, totals it and locks in a pickup time — all inside WhatsApp, while you cook.",
        points: ["Auto-sends today's menu & live prices", "Captures and totals orders in chat", "Confirms pickup time + payment method", "Never leaves a hungry customer on read"],
        chat: ["Aaj ka menu bhejo?", "🍽️ Butter Naan ₹40 · Paneer Tikka ₹220 · Dal Makhani ₹180. Order karein?", "2 butter naan, 1 paneer tikka", "📝 ₹300 · Ready in 25 min. Pay on pickup?", "haan", "✅ Order #R210 confirmed! See you at 7 PM."],
      },
      kirana: {
        title: "Kirana Stores",
        blurb: "Customers type the way they talk. Whatly reads messy Hindi & Hinglish lists, checks stock, totals the basket and queues it for cash-on-delivery — no app, no forms.",
        points: ["Understands Hindi & Hinglish orders", "Checks stock and quotes live prices", "Auto-totals the basket instantly", "Queues cash-on-delivery pickups"],
        chat: ["kitne ka hai atta?", "Atta 5kg ₹250, 1kg ₹55. ✅ In stock!", "2 atta, 1 toor dal bhejo", "📝 Order ₹680 · Pickup by 5 PM. Reply YES to confirm.", "haan", "✅ Order #1234 confirmed! 💵 Cash on pickup."],
      },
      salon: {
        title: "Salons",
        blurb: "Stop pausing mid-haircut to answer the phone. Whatly shows open slots, books the appointment and sends the reminder — so your chair stays full and no-shows drop.",
        points: ["Shows live open slots instantly", "Books & reschedules right in chat", "Sends automatic visit reminders", "Cuts no-shows without a phone call"],
        chat: ["Kal haircut ka slot hai?", "Kal khaali: 11 AM, 2 PM, 5 PM. Kaunsa karein?", "2 PM theek hai", "✅ Booked — Haircut, kal 2 PM. Reminder bhej denge 🔔"],
      },
      clinic: {
        title: "Clinics",
        blurb: "Patients ask the same things at all hours. Whatly answers timings and FAQs instantly, books OPD slots and flags urgent cases — so your front desk breathes easier.",
        points: ["Answers hours & FAQs 24/7", "Books and confirms OPD appointments", "Sends visit & follow-up reminders", "Flags urgent messages for staff"],
        chat: ["Doctor aaj available hain?", "Aaj OPD 4–8 PM. Appointment book karein?", "haan, 6 baje", "✅ Token #18 · 6:00 PM. SMS bhej diya 📩"],
      },
    },
  },
  mobileStory: {
    chat: ["Clinic aaj khulega? Dr. Mehta available?", "Namaste! 🩺 Khula hai 10–7. Dr. Mehta ka 4:30 PM slot free hai.", "Book kar do — Anjali, 28", "✅ #C-204 confirmed · 4:30 PM aaj. Reminder set 🔔"],
  },
};

const additions = { en };

for (const [loc, data] of Object.entries(additions)) {
  const file = join(MSG, `${loc}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  json.home = deepMerge(json.home || {}, data);
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`expanded ${loc}.json`);
}
