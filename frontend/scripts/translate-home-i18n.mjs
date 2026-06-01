// Deep-merge translated `home` keys for hi + hinglish. Omitted keys fall back
// to English (see i18n/request.ts). Run: node scripts/translate-home-i18n.mjs
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

const hi = {
  bento: {
    eyebrow: "इनके लिए बना",
    title: "हर तरह की <em>दुकान</em>",
    subtitle: "किराना काउंटर से लेकर क्लीनिक तक — Whatly चैट संभालता है ताकि आप दुकान चलाएँ।",
    hoverCta: "Whatly सेकंडों में जवाब देता है — कोई ग्राहक छूटता नहीं ↓",
    items: {
      restaurants: { title: "रेस्टोरेंट", fact: "ग्राहक उसी से ऑर्डर करते हैं जो पहले जवाब दे — डिनर रश में देर यानी छूटी हुई टेबल।" },
      gyms: { title: "जिम और स्टूडियो", fact: "ज़्यादातर मेंबरशिप पूछताछ ठंडी पड़ जाती है अगर एक घंटे में जवाब न मिले।" },
      clinics: { title: "क्लीनिक", fact: "मरीज़ उसी क्लीनिक को बुक करते हैं जो अभी जवाब दे — बाद में कॉल करने वाले को नहीं।" },
      salons: { title: "सैलून और स्पा", fact: "पीक आवर में छूटा बुकिंग मैसेज यानी खाली कुर्सी जो भर नहीं सकती।" },
      kirana: { title: "किराना स्टोर", fact: "ग्राहक उसी से दोबारा ऑर्डर करते हैं जो स्टॉक और दाम सबसे तेज़ कन्फ़र्म करे।" },
      boutiques: { title: "बुटीक", fact: "साइज़ पूछने वाले ग्राहक पहली जवाब देने वाली दुकान से ख़रीदते हैं।" },
    },
  },
  testimonials: {
    eyebrow: "दुकानों की पसंद",
    title: "मालिक क्या <em>कहते हैं</em>",
    subtitle: "पूरे भारत के किराना, कैफ़े, सैलून और क्लीनिक — Whatly से WhatsApp पर ज़्यादा ऑर्डर बंद करते हैं।",
    items: [
      { quote: "पहले हर ऑर्डर फ़ोन पर लेना पड़ता था। अब Whatly ख़ुद जवाब देता है — मैं बस खाना बनाने पर ध्यान देता हूँ।", type: "रेस्टोरेंट" },
      { quote: "मेंबरशिप के सवाल, क्लास टाइमिंग, रिन्युअल — सब WhatsApp पर हल हो जाते हैं, फ़्लोर पर पहुँचने से पहले ही।", type: "जिम और फ़िटनेस" },
      { quote: "हिंग्लिश ऑर्डर भी समझ लेता है। '2 आटा 1 दाल' टाइप करो, टोटल तैयार। ग्राहकों को बहुत पसंद आया।", type: "किराना स्टोर" },
      { quote: "शाम की भीड़ में 30 मैसेज छूट जाते थे। अब हर क्लाइंट को तुरंत स्लॉट मिलता है और मैं चैट में ही बुक कर लेती हूँ।", type: "सैलून और स्पा" },
      { quote: "ग्राहक दिन भर कुर्ती के साइज़ और दाम पूछते हैं। Whatly कैटलॉग भेजता है और ट्रायल बुक करता है — मैं बस सिलाई करती हूँ।", type: "बुटीक" },
      { quote: "सिर्फ़ अपॉइंटमेंट रिमाइंडर से मेरे no-show आधे हो गए। टाइमिंग और सवाल 24/7 हल होते हैं। हर रुपया वसूल।", type: "क्लीनिक" },
    ],
  },
  how: {
    eyebrow: "कैसे काम करता है",
    title: "*दस मिनट* में शुरू",
    subtitle: "साइनअप से पहली ऑटो-रिप्लाई तक। न तकनीकी ज्ञान, न माइग्रेशन।",
    cta: "अभी शुरू करें",
    steps: [
      { title: "मुफ़्त साइनअप करें", body: "फ़ोन नंबर → WhatsApp पर वेरिफ़ाई → 14-दिन ट्रायल। कोई कार्ड नहीं।" },
      { title: "WhatsApp Business जोड़ें", body: "Meta के आधिकारिक Embedded Signup से एक टैप में। आपका डेटा आपका रहता है।" },
      { title: "ऑटो-रिप्लाई चुनें", body: "12 तैयार टेम्पलेट — दाम, समय, मेन्यू, लोकेशन। जवाब एडिट करें, हो गया।" },
      { title: "ग्राहकों को तुरंत जवाब", body: "बॉट 24/7 ग्राहक की भाषा में जवाब देता है। आप इनबॉक्स देखते रहें।" },
    ],
  },
  stats: {
    items: [
      { value: "6", label: "भाषाएँ समर्थित" },
      { value: "₹399", label: "शुरुआत / महीना" },
      { value: "10 मिनट", label: "लाइव होने में" },
      { value: "14-दिन", label: "मुफ़्त ट्रायल" },
    ],
  },
  pricing: {
    title: "आपकी दुकान के लिए बेहतरीन प्लान",
    subtitle: "पूरे भारत की दुकानों का भरोसा। जो आपकी बिक्री में फ़िट हो वो चुनें — कभी भी अपग्रेड करें।",
    monthly: "मासिक",
    yearly: "सालाना",
    saveBadge: "2 महीने फ़्री",
    mostPopular: "सबसे लोकप्रिय",
    perYear: "साल",
    perMonth: "महीना",
    conversations: "{count} बातचीत / महीना",
    startTrial: "फ़्री ट्रायल शुरू करें",
    whatsIncluded: "इसमें शामिल है:",
    plans: {
      starter: { name: "Starter", features: ["ऑटो-रिप्लाई (6 भाषाएँ)", "1,000 बातचीत/माह", "FAQ बॉट", "इनबॉक्स + डैशबोर्ड", "Google Sheets सिंक"] },
      growth: { name: "Growth", features: ["Starter का सब कुछ", "3,000 बातचीत/माह", "ऑर्डर + पिकअप फ़्लो", "बुकिंग + कैलेंडर", "Razorpay पेमेंट लिंक", "एनालिटिक्स"] },
      pro: { name: "Pro", features: ["Growth का सब कुछ", "6,000 बातचीत/माह", "ब्रॉडकास्ट", "API + Webhooks", "प्राथमिकता सपोर्ट"] },
    },
  },
  faq: {
    eyebrow: "सवाल-जवाब",
    title: "आम *सवाल*",
    subtitle: "स्विच करने से पहले मालिक यही पूछते हैं। फिर भी उलझन? बस मैसेज करें।",
    items: [
      { q: "क्या मेरे ग्राहकों को पता चलेगा कि ये बॉट है?", a: "उन्हें उनकी भाषा में तुरंत, सही जवाब मिलते हैं। ज़्यादातर समझते हैं कि आप तेज़ी से टाइप कर रहे हैं। पूरी पारदर्शिता चाहें तो जवाब पर 🤖 लगा सकते हैं।" },
      { q: "क्या मुझे ख़ास WhatsApp नंबर चाहिए?", a: "हाँ — एक WhatsApp Business नंबर (मुफ़्त, WhatsApp Business ऐप से)। हम Meta के आधिकारिक इंटीग्रेशन से जुड़ते हैं।" },
      { q: "अगर ग्राहक कुछ ऐसा पूछे जो मेरे FAQ में नहीं है?", a: "वो मैसेज आपके इनबॉक्स में 'जवाब चाहिए' के साथ आता है। आप ख़ुद जवाब दें, या स्मार्ट जवाब के लिए AI ऐड-ऑन (₹699/माह) चालू करें।" },
      { q: "कौन-कौन सी भाषाएँ?", a: "अंग्रेज़ी, हिन्दी (देवनागरी), हिंग्लिश, बंगाली, उर्दू, भोजपुरी। बॉट पहचानता है कि ग्राहक ने क्या लिखा और उसी भाषा में जवाब देता है।" },
      { q: "नई चीज़ें / FAQ कैसे जोड़ूँ?", a: "डैशबोर्ड में सीधे एडिट करें, या अपनी Google Sheet एडिट करें — बॉट हर 15 मिनट में ऑटो-सिंक करता है। ज़्यादातर मालिक Sheet पसंद करते हैं।" },
      { q: "क्या कोई सेटअप फ़ीस या कमिटमेंट है?", a: "कोई सेटअप फ़ीस नहीं। कोई कमिटमेंट नहीं। 14-दिन फ़्री ट्रायल। ट्रायल के लिए कार्ड ज़रूरी नहीं।" },
    ],
  },
  footer: {
    tagline: "महत्वाकांक्षी भारतीय दुकानों के लिए WhatsApp ऑटोमेशन — छह भाषाओं में ऑटो-रिप्लाई, ऑर्डर और बुकिंग।",
    product: "प्रोडक्ट",
    company: "कंपनी",
    contactUs: "संपर्क करें",
    links: { features: "फ़ीचर्स", pricing: "क़ीमत", faq: "सवाल-जवाब", startTrial: "फ़्री ट्रायल शुरू करें", about: "हमारे बारे में", stories: "ग्राहक कहानियाँ", careers: "करियर", liveChat: "लाइव चैट" },
    rights: "सर्वाधिकार सुरक्षित।",
  },
  useCaseEyebrow: "यूज़ केस",
  showcase: {
    items: {
      restaurant: {
        title: "रेस्टोरेंट",
        blurb: "आपके व्यस्त घंटे का मतलब छूटे ऑर्डर नहीं होना चाहिए। Whatly मेन्यू भेजता है, ऑर्डर लेता है, टोटल करता है और पिकअप टाइम तय करता है — सब WhatsApp में, जब आप खाना बनाते हैं।",
        points: ["आज का मेन्यू और लाइव दाम ऑटो-भेजे", "चैट में ऑर्डर लेकर टोटल करे", "पिकअप टाइम + पेमेंट तरीका कन्फ़र्म करे", "भूखे ग्राहक को कभी अनदेखा न करे"],
        chat: ["आज का मेन्यू भेजो?", "🍽️ बटर नान ₹40 · पनीर टिक्का ₹220 · दाल मखनी ₹180। ऑर्डर करें?", "2 बटर नान, 1 पनीर टिक्का", "📝 ₹300 · 25 मिनट में तैयार। पिकअप पर पेमेंट?", "हाँ", "✅ ऑर्डर #R210 कन्फ़र्म! शाम 7 बजे मिलते हैं।"],
      },
      kirana: {
        title: "किराना स्टोर",
        blurb: "ग्राहक जैसे बोलते हैं वैसे टाइप करते हैं। Whatly बिखरी हिन्दी और हिंग्लिश लिस्ट पढ़ता है, स्टॉक देखता है, बास्केट टोटल करता है और कैश-ऑन-डिलीवरी के लिए लगाता है — न ऐप, न फ़ॉर्म।",
        points: ["हिन्दी और हिंग्लिश ऑर्डर समझे", "स्टॉक देखे और लाइव दाम बताए", "बास्केट तुरंत ऑटो-टोटल करे", "कैश-ऑन-डिलीवरी पिकअप लगाए"],
        chat: ["आटा कितने का है?", "आटा 5kg ₹250, 1kg ₹55। ✅ स्टॉक में!", "2 आटा, 1 तूर दाल भेजो", "📝 ऑर्डर ₹680 · 5 बजे तक पिकअप। कन्फ़र्म के लिए YES भेजें।", "हाँ", "✅ ऑर्डर #1234 कन्फ़र्म! 💵 पिकअप पर कैश।"],
      },
      salon: {
        title: "सैलून",
        blurb: "हेयरकट के बीच फ़ोन उठाना बंद करें। Whatly खाली स्लॉट दिखाता है, अपॉइंटमेंट बुक करता है और रिमाइंडर भेजता है — कुर्सी भरी रहे और no-show घटें।",
        points: ["लाइव खाली स्लॉट तुरंत दिखाए", "चैट में बुक और रीशेड्यूल करे", "अपने आप विज़िट रिमाइंडर भेजे", "बिना फ़ोन किए no-show घटाए"],
        chat: ["कल हेयरकट का स्लॉट है?", "कल खाली: 11 AM, 2 PM, 5 PM। कौन सा करें?", "2 PM ठीक है", "✅ बुक — हेयरकट, कल 2 PM। रिमाइंडर भेज देंगे 🔔"],
      },
      clinic: {
        title: "क्लीनिक",
        blurb: "मरीज़ हर समय वही सवाल पूछते हैं। Whatly समय और सवाल तुरंत बताता है, OPD स्लॉट बुक करता है और ज़रूरी केस फ़्लैग करता है — आपका फ़्रंट डेस्क राहत में।",
        points: ["समय और सवाल 24/7 बताए", "OPD अपॉइंटमेंट बुक और कन्फ़र्म करे", "विज़िट और फ़ॉलो-अप रिमाइंडर भेजे", "ज़रूरी मैसेज स्टाफ़ के लिए फ़्लैग करे"],
        chat: ["डॉक्टर आज उपलब्ध हैं?", "आज OPD 4–8 PM। अपॉइंटमेंट बुक करें?", "हाँ, 6 बजे", "✅ टोकन #18 · 6:00 PM। SMS भेज दिया 📩"],
      },
    },
  },
  mobileStory: {
    chat: ["क्लीनिक आज खुलेगा? डॉ. मेहता उपलब्ध हैं?", "नमस्ते! 🩺 खुला है 10–7। डॉ. मेहता का 4:30 PM स्लॉट फ़्री है।", "बुक कर दो — अंजली, 28", "✅ #C-204 कन्फ़र्म · आज 4:30 PM। रिमाइंडर सेट 🔔"],
  },
};

// Hinglish: only override marketing copy; chat bubbles & quotes are already
// Hinglish in English, so they fall back automatically.
const hinglish = {
  bento: {
    eyebrow: "Inke liye bana",
    title: "Har tarah ki <em>dukaan</em>",
    subtitle: "Kirana counter se clinic tak — Whatly chat sambhalta hai taaki aap dukaan chalayein.",
    hoverCta: "Whatly seconds mein reply karta hai — koi customer miss nahi ↓",
    items: {
      restaurants: { fact: "Customer usi se order karte hain jo pehle reply de — dinner rush mein late reply matlab gayi hui table." },
      gyms: { title: "Gyms & studios", fact: "Zyadatar membership enquiry thandi pad jaati hai agar ek ghante mein reply na mile." },
      clinics: { fact: "Patient usi clinic ko book karte hain jo abhi reply de — baad mein call karne wale ko nahi." },
      salons: { title: "Salons & spas", fact: "Peak hours mein missed booking message matlab khaali chair jo bhar nahi sakti." },
      kirana: { title: "Kirana stores", fact: "Customer usi se dobara order karte hain jo stock aur price sabse fast confirm kare." },
      boutiques: { fact: "Size poochhne wale customer pehli reply dene wali shop se khareedte hain." },
    },
  },
  testimonials: {
    eyebrow: "Dukaano ki pasand",
    title: "Owners kya <em>kehte</em> hain",
    subtitle: "Pure India ke kirana, cafe, salon aur clinic — Whatly se WhatsApp par zyada orders close karte hain.",
  },
  how: {
    eyebrow: "Kaise kaam karta hai",
    title: "*Das minute* mein live",
    subtitle: "Signup se pehli auto-reply tak. Na tech skills, na migration.",
    cta: "Abhi shuru karein",
    steps: [
      { title: "Free signup karein", body: "Phone number → WhatsApp pe verify → 14-din trial. Koi card nahi." },
      { title: "WhatsApp Business connect karein", body: "Meta ke official Embedded Signup se ek tap. Aapka data aapka rehta hai." },
      { title: "Auto-replies chunein", body: "12 ready templates — price, timings, menu, location. Answers edit karo, done." },
      { title: "Customers ko turant jawab", body: "Bot 24/7 customer ki bhasha mein reply karta hai. Aap inbox dekhte rahein." },
    ],
  },
  stats: {
    items: [
      { value: "6", label: "Languages supported" },
      { value: "₹399", label: "Shuruaat / mahina" },
      { value: "10 min", label: "Live hone mein" },
      { value: "14-din", label: "Free trial" },
    ],
  },
  pricing: {
    title: "Aapki dukaan ke liye best plans",
    subtitle: "Pure India ki dukaano ka bharosa. Jo aapki selling mein fit ho wo chunein — kabhi bhi upgrade karein.",
    perYear: "saal",
    perMonth: "mahina",
    conversations: "{count} conversations / mahina",
    startTrial: "Free trial shuru karein",
    whatsIncluded: "Isme shaamil hai:",
    plans: {
      growth: { features: ["Starter ka sab kuch", "3,000 conversations/mo", "Orders + Pickup flow", "Bookings + Calendar", "Razorpay payment links", "Analytics"] },
      pro: { features: ["Growth ka sab kuch", "6,000 conversations/mo", "Broadcasts", "API + Webhooks", "Priority support"] },
    },
  },
  faq: {
    title: "Common *sawaal*",
    subtitle: "Switch karne se pehle owners yahi poochhte hain. Phir bhi confusion? Bas message karein.",
    items: [
      { q: "Kya mere customers ko pata chalega ki ye bot hai?", a: "Unhe unki bhasha mein turant, sahi jawab milte hain. Zyadatar samajhte hain ki aap fast type kar rahe ho. Full transparency chahiye to reply pe 🤖 laga sakte ho." },
      { q: "Kya mujhe special WhatsApp number chahiye?", a: "Haan — ek WhatsApp Business number (free, WhatsApp Business app se). Hum Meta ke official integration se connect karte hain." },
      { q: "Agar customer kuch aisa poochhe jo mere FAQs mein nahi hai?", a: "Wo message aapke inbox mein 'Needs reply' ke saath aata hai. Aap khud reply karein, ya smart fallback ke liye AI add-on (₹699/mo) on karein." },
      { q: "Exactly kaunsi languages?", a: "English, Hindi (Devanagari), Hinglish, Bengali, Urdu, Bhojpuri. Bot detect karta hai customer ne kya likha aur usi bhasha mein reply karta hai." },
      { q: "Naye items / FAQs kaise add karun?", a: "Dashboard mein directly edit karein, ya apni Google Sheet edit karein — bot har 15 min mein auto-sync karta hai. Zyadatar owners Sheet prefer karte hain." },
      { q: "Koi setup fee ya commitment hai?", a: "Koi setup fee nahi. Koi commitment nahi. 14-din free trial. Trial ke liye card zaroori nahi." },
    ],
  },
  footer: {
    tagline: "Ambitious Indian dukaano ke liye WhatsApp automation — chhe languages mein auto-reply, orders aur bookings.",
    product: "Product",
    company: "Company",
    contactUs: "Contact karein",
    links: { startTrial: "Free trial shuru karein", about: "Hamare baare mein", stories: "Customer stories", careers: "Careers", liveChat: "Live chat" },
    rights: "Sabhi adhikaar surakshit.",
  },
  showcase: {
    items: {
      restaurant: { blurb: "Aapke busy hours ka matlab missed orders nahi hona chahiye. Whatly menu bhejta hai, order leta hai, total karta hai aur pickup time lock karta hai — sab WhatsApp mein, jab aap cooking karte ho.", points: ["Aaj ka menu & live prices auto-bheje", "Chat mein orders lekar total kare", "Pickup time + payment method confirm kare", "Bhookhe customer ko kabhi ignore na kare"] },
      kirana: { blurb: "Customers jaise bolte hain waise type karte hain. Whatly bikhri Hindi & Hinglish list padhta hai, stock check karta hai, basket total karta hai aur cash-on-delivery ke liye queue karta hai — na app, na forms.", points: ["Hindi & Hinglish orders samjhe", "Stock check kare aur live price bataye", "Basket turant auto-total kare", "Cash-on-delivery pickup queue kare"] },
      salon: { blurb: "Haircut ke beech phone uthana band karein. Whatly khaali slots dikhata hai, appointment book karta hai aur reminder bhejta hai — chair bhari rahe aur no-shows ghatein.", points: ["Live khaali slots turant dikhaye", "Chat mein book & reschedule kare", "Auto visit reminders bheje", "Bina phone kiye no-shows ghataye"] },
      clinic: { blurb: "Patients har time wahi cheezein poochhte hain. Whatly timings aur FAQs turant batata hai, OPD slots book karta hai aur urgent cases flag karta hai — aapka front desk relax.", points: ["Hours & FAQs 24/7 answer kare", "OPD appointments book & confirm kare", "Visit & follow-up reminders bheje", "Urgent messages staff ke liye flag kare"] },
    },
  },
};

const updates = { hi, hinglish };
for (const [loc, data] of Object.entries(updates)) {
  const file = join(MSG, `${loc}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  json.home = deepMerge(json.home || {}, data);
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n", "utf8");
  console.log(`translated ${loc}.json`);
}
