// One-off: inject the `home` namespace (landing page copy) into every locale
// message file. Safe JSON read/modify/write (preserves existing keys).
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MSG = join(__dirname, "..", "messages");

const home = {
  en: {
    nav: { home: "Home", features: "Features", pricing: "Pricing", blog: "Blog", faq: "FAQ", cta: "Begin Journey" },
    hero: {
      badge: "For Indian SMBs",
      title: "Where <em>replies</em> flow <em2>through the silence.</em2>",
      subtitle:
        "WhatsApp automation for ambitious shop owners — auto-replies, orders and pickups across six languages.",
      cta: "Start 14-day free trial",
      scroll: "Scroll to begin",
    },
    stages: { ask: "Ask.", reply: "Reply.", book: "Book.", confirmed: "Confirmed." },
    closing: "WhatsApp that answers — for you, 24/7.",
  },
  hi: {
    nav: { home: "होम", features: "फ़ीचर्स", pricing: "क़ीमत", blog: "ब्लॉग", faq: "सवाल-जवाब", cta: "शुरू करें" },
    hero: {
      badge: "भारतीय छोटे व्यापारों के लिए",
      title: "जहाँ <em>जवाब</em> ख़ुद <em2>ख़ामोशी में बहते हैं।</em2>",
      subtitle:
        "महत्वाकांक्षी दुकानदारों के लिए WhatsApp ऑटोमेशन — छह भाषाओं में ऑटो-रिप्लाई, ऑर्डर और पिकअप।",
      cta: "14-दिन का मुफ़्त ट्रायल शुरू करें",
      scroll: "शुरू करने के लिए स्क्रॉल करें",
    },
    stages: { ask: "पूछिए।", reply: "जवाब।", book: "बुकिंग।", confirmed: "कन्फ़र्म।" },
    closing: "WhatsApp जो ख़ुद जवाब दे — आपके लिए, 24/7।",
  },
  hinglish: {
    nav: { home: "Home", features: "Features", pricing: "Pricing", blog: "Blog", faq: "FAQ", cta: "Shuru Karein" },
    hero: {
      badge: "Indian dukaandaaron ke liye",
      title: "Jahan <em>replies</em> khud <em2>khaamoshi mein chalte hain.</em2>",
      subtitle:
        "Ambitious shop owners ke liye WhatsApp automation — auto-reply, orders aur pickup, chhe languages mein.",
      cta: "14-din ka free trial shuru karein",
      scroll: "Shuru karne ke liye scroll karein",
    },
    stages: { ask: "Poochho.", reply: "Reply.", book: "Book.", confirmed: "Confirmed." },
    closing: "WhatsApp jo khud reply kare — aapke liye, 24/7.",
  },
  bn: {
    nav: { home: "হোম", features: "ফিচার", pricing: "দাম", blog: "ব্লগ", faq: "প্রশ্নোত্তর", cta: "শুরু করুন" },
    hero: {
      badge: "ভারতের ছোট ব্যবসার জন্য",
      title: "যেখানে <em>উত্তর</em> নিজে থেকেই <em2>নীরবতায় বয়ে চলে।</em2>",
      subtitle:
        "উচ্চাকাঙ্ক্ষী দোকানদারদের জন্য WhatsApp অটোমেশন — ছয়টি ভাষায় অটো-রিপ্লাই, অর্ডার ও পিকআপ।",
      cta: "১৪-দিনের ফ্রি ট্রায়াল শুরু করুন",
      scroll: "শুরু করতে স্ক্রোল করুন",
    },
    stages: { ask: "জিজ্ঞাসা।", reply: "উত্তর।", book: "বুকিং।", confirmed: "নিশ্চিত।" },
    closing: "WhatsApp যা নিজেই উত্তর দেয় — আপনার জন্য, ২৪/৭।",
  },
  ur: {
    nav: { home: "ہوم", features: "خصوصیات", pricing: "قیمت", blog: "بلاگ", faq: "سوال و جواب", cta: "شروع کریں" },
    hero: {
      badge: "بھارتی چھوٹے کاروبار کے لیے",
      title: "جہاں <em>جوابات</em> خود بخود <em2>خاموشی میں بہتے ہیں۔</em2>",
      subtitle:
        "محنتی دکانداروں کے لیے WhatsApp آٹومیشن — چھ زبانوں میں آٹو ری پلائی، آرڈر اور پک اپ۔",
      cta: "14 دن کا مفت ٹرائل شروع کریں",
      scroll: "شروع کرنے کے لیے اسکرول کریں",
    },
    stages: { ask: "پوچھیں۔", reply: "جواب۔", book: "بکنگ۔", confirmed: "تصدیق۔" },
    closing: "WhatsApp جو خود جواب دے — آپ کے لیے، 24/7۔",
  },
  bho: {
    nav: { home: "होम", features: "फीचर", pricing: "दाम", blog: "ब्लॉग", faq: "सवाल-जवाब", cta: "शुरू करीं" },
    hero: {
      badge: "भारतीय छोट दुकानदारन खातिर",
      title: "जहाँ <em>जवाब</em> अपने आप <em2>चुप्पी में बहेला।</em2>",
      subtitle:
        "मेहनती दुकानदारन खातिर WhatsApp ऑटोमेशन — छव भाषा में ऑटो-रिप्लाई, ऑर्डर आ पिकअप।",
      cta: "14-दिन के फ्री ट्रायल शुरू करीं",
      scroll: "शुरू करे खातिर स्क्रॉल करीं",
    },
    stages: { ask: "पूछीं।", reply: "जवाब।", book: "बुकिंग।", confirmed: "कन्फर्म।" },
    closing: "WhatsApp जे खुदे जवाब देला — रउरा खातिर, 24/7।",
  },
};

for (const [loc, data] of Object.entries(home)) {
  const file = join(MSG, `${loc}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  json.home = data;
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`updated ${loc}.json`);
}
