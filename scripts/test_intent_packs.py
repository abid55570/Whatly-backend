"""Tier-3 query simulation for business-type Q&A packs.

Loads each pack in data/intent_packs/ into the REAL MatchingEngine and fires
realistic, messy, code-mixed, misspelled customer queries — the way a tier-2/3
shopkeeper's customers actually type on WhatsApp — then reports which Q&A each
query matched, the confidence, the layer, and PASS/FAIL vs the expected intent.

Run:
    docker compose exec backend python scripts/test_intent_packs.py
"""
from __future__ import annotations

import json
from pathlib import Path

from app.services.matching.engine import MatchingEngine
from app.services.matching.intent_loader import IntentLibrary
from app.services.matching.schemas import IntentDefinition

PACKS_DIR = Path(__file__).resolve().parents[1] / "data" / "intent_packs"


def build_engine(pack_path: Path) -> tuple[MatchingEngine, str]:
    lib = IntentLibrary(Path("/__none__"))  # loads nothing
    data = json.loads(pack_path.read_text(encoding="utf-8"))
    for qa in data["qa"]:
        idef = IntentDefinition(
            key=qa["key"],
            name=qa["question"]["en"],
            default_reply_template=qa["answer"]["en"],
            languages=qa["keywords"],
            patterns=qa.get("patterns", []),
            emojis=qa.get("emojis", []),
            priority=qa.get("priority", 0),
            category=qa.get("category", "general"),
        )
        lib._intents[idef.key] = idef
    return MatchingEngine(lib), data["label"]


# Each case: (query, expected_key, accepted_alternates)
# accepted_alternates = other keys we'd also accept as "not wrong"
KIRANA = [
    ("kitne ka hai atta", "kirana_price", []),
    ("आटा कितने का है", "kirana_price", []),
    ("rate kya hai chawal ka", "kirana_price", []),
    ("daam batao bhaiya", "kirana_price", []),
    ("prise kya hai", "kirana_price", []),                     # typo: prise
    ("dukan kab khulti hai", "kirana_timing", []),
    ("kitne baje tak khula rehta hai", "kirana_timing", []),
    ("अभी खुला है क्या", "kirana_timing", ["kirana_availability"]),
    ("shop open ho abhi", "kirana_timing", []),
    ("address kya hai aapka", "kirana_location", []),
    ("दुकान कहाँ है", "kirana_location", []),
    ("kaise aaye aapke yaha", "kirana_location", []),
    ("home delivery karte ho", "kirana_delivery", []),
    ("ghar pe bhej doge kya", "kirana_delivery", []),
    ("होम डिलीवरी है क्या", "kirana_delivery", ["kirana_availability"]),
    ("maggi hai kya", "kirana_availability", []),
    ("क्या सर्फ मिलेगा", "kirana_availability", []),
    ("colgate milegi", "kirana_availability", []),
    ("order karna hai 2 atta 1 dal", "kirana_order", []),
    ("mujhe kuch saaman mangwana hai", "kirana_order", []),
    ("upi chalega", "kirana_payment", []),
    ("gpay se de sakte hai", "kirana_payment", []),
    ("ऑनलाइन पेमेंट होगा", "kirana_payment", []),
    ("udhaar milega kya", "kirana_udhaar", []),
    ("khata khol do mera", "kirana_udhaar", []),
    ("baad me de dunga paise", "kirana_udhaar", []),
    ("koi offer hai", "kirana_offers", []),
    ("thoda kam karo bhaiya", "kirana_offers", []),
    ("discount milega kya", "kirana_offers", ["kirana_availability"]),
    ("free delivery kitne ke upar", "kirana_delivery_charge", ["kirana_delivery"]),
    ("aapka number kya hai", "kirana_contact", []),
    ("namaste", "kirana_greeting", []),
    ("ram ram bhaiya", "kirana_greeting", []),
    ("🙏", "kirana_greeting", []),
]

RESTAURANT = [
    ("menu bhej do", "rest_menu", []),
    ("मेन्यू भेजिए", "rest_menu", []),
    ("kya kya milta hai khane me", "rest_menu", []),
    ("paneer butter masala kitne ka", "rest_price", []),
    ("रेट क्या है", "rest_price", []),
    ("half plate kitne me", "rest_price", []),
    ("delivery hoti hai kya", "rest_delivery", []),
    ("mere area me deliver karte ho", "rest_delivery", []),
    ("घर तक पहुंचाओगे", "rest_delivery", []),
    ("table book karna hai", "rest_table_booking", []),
    ("4 log ke liye table milega", "rest_table_booking", ["rest_delivery"]),
    ("reservation karni hai aaj raat", "rest_table_booking", []),
    ("kitne baje tak khula hai", "rest_timing", []),
    ("kab band hote ho", "rest_timing", []),
    ("location bhejo", "rest_location", []),
    ("कहाँ पर है आपका dhaba", "rest_location", []),
    ("khana order karna hai", "rest_order", []),
    ("2 roti 1 dal fry parcel", "rest_order", []),
    ("take away mil jayega", "rest_order", []),
    ("veg hai ya non veg", "rest_veg_nonveg", []),
    ("jain khana milta hai", "rest_veg_nonveg", []),
    ("बिना प्याज़ लहसुन का खाना", "rest_veg_nonveg", []),
    ("upi se pay kar sakte hai", "rest_payment", []),
    ("card chalega", "rest_payment", []),
    ("minimum order kitna hai delivery ka", "rest_min_order", ["rest_delivery"]),
    ("hello bhaiya", "rest_greeting", []),
    ("नमस्ते", "rest_greeting", []),
]

SALON = [
    ("kya kya service hai aapke yaha", "salon_services", []),
    ("facial hota hai", "salon_services", []),
    ("बाल कटिंग होती है", "salon_services", []),
    ("haircut kitne ka hai", "salon_price", []),
    ("facial ka rate kya hai", "salon_price", []),
    ("फेशियल कितने का", "salon_price", []),
    ("appointment book karni hai", "salon_booking", []),
    ("kal ka slot khali hai", "salon_booking", []),
    ("4 baje ka time mil jayega", "salon_booking", ["salon_timing"]),
    ("timing kya hai aapki", "salon_timing", []),
    ("sunday khula hai kya", "salon_timing", []),
    ("parlour kaha hai", "salon_location", []),
    ("पता बताइए", "salon_location", []),
    ("ghar pe service milti hai", "salon_home_service", []),
    ("घर आकर कर सकते हो", "salon_home_service", []),
    ("bridal package kitne ka", "salon_bridal", ["salon_price"]),
    ("shaadi ka makeup karte ho", "salon_bridal", []),
    ("दुल्हन का मेकअप", "salon_bridal", []),
    ("ladies ke liye hai ya gents", "salon_ladies_gents", []),
    ("gents salon hai", "salon_ladies_gents", []),
    ("bina appointment aa sakte hai", "salon_walkin", []),
    ("seedhe aa jaye", "salon_walkin", []),
    ("upi chalega", "salon_payment", []),
    ("namaste", "salon_greeting", []),
    ("hello", "salon_greeting", []),
]

SUITES = {
    "kirana.json": KIRANA,
    "restaurant.json": RESTAURANT,
    "salon.json": SALON,
}

# Held-out: fresh realistic queries NOT used to tune keywords. We just print
# what the engine does — to see real-world behaviour, including graceful misses
# (an unmatched message falls through to "needs reply" / AI, which is correct).
HELDOUT = {
    "kirana.json": [
        "namaskar bhaiya aaj dukan khuli hai",
        "doodh ka packet milega subah subah",
        "bhaiya 10 kilo aata ghar bhijwa dena",
        "kitne ka diya ye wala soap",
        "thoda udhaar chalega is mahine",
        "online paisa bhej du kya",
    ],
    "restaurant.json": [
        "do plate biryani pack kar do",
        "kitne logo ka table khali hai",
        "veg thali ka rate kya hai",
        "khana kitni der me ban jayega",
        "aaj ka special kya hai",
    ],
    "salon.json": [
        "ladies facial ka kitna lagega",
        "bridal ke liye advance dena padta hai kya",
        "rate list bhejo saari service ki",
        "kal subah ka slot mil jayega",
        "haircut ke baad hair spa free hai kya",
    ],
}


def run() -> None:
    grand_pass = grand_total = 0
    all_fails: list[str] = []

    for pack_file, cases in SUITES.items():
        engine, label = build_engine(PACKS_DIR / pack_file)
        print(f"\n{'='*72}\n  {label}   ({pack_file}) — {len(cases)} queries\n{'='*72}")
        passed = 0
        for query, expected, alts in cases:
            res = engine.match(query)
            got = res.intent_key if res else None
            conf = f"{res.confidence:.2f}" if res else "—"
            layer = res.matched_layer if res else "no-match"
            ok = got == expected or got in alts
            if ok:
                passed += 1
                mark = "✅"
            else:
                mark = "❌"
                all_fails.append(f"[{pack_file}] {query!r} → got {got} (want {expected})")
            note = "" if got == expected else (f"  (alt-ok: {got})" if ok else f"  WANT={expected}")
            print(f"  {mark} {conf:>4} {layer:<15} {got or 'NONE':<22} ⟵ {query}{note}")
        grand_pass += passed
        grand_total += len(cases)
        pct = 100 * passed / len(cases)
        print(f"\n  → {passed}/{len(cases)} ({pct:.0f}%)")

    print(f"\n{'#'*72}")
    print(f"  TUNED SET: {grand_pass}/{grand_total} ({100*grand_pass/grand_total:.1f}%) passed")
    if all_fails:
        print(f"\n  FAILURES ({len(all_fails)}):")
        for f in all_fails:
            print(f"    • {f}")
    print(f"{'#'*72}")

    # ---- Held-out realistic queries (untuned) — show real behaviour ----
    print(f"\n{'='*72}\n  HELD-OUT (untuned) — real behaviour, misses fall through to manual/AI\n{'='*72}")
    held_matched = held_total = 0
    for pack_file, queries in HELDOUT.items():
        engine, label = build_engine(PACKS_DIR / pack_file)
        print(f"\n  — {label} —")
        for q in queries:
            res = engine.match(q)
            held_total += 1
            if res:
                held_matched += 1
                print(f"  ✅ {res.confidence:.2f} {res.matched_layer:<14} {res.intent_key:<20} ⟵ {q}")
            else:
                print(f"  ·  ——  (no match → needs reply / AI)        ⟵ {q}")
    print(f"\n  Held-out matched: {held_matched}/{held_total} "
          f"({100*held_matched/held_total:.0f}%) — rest fall through gracefully")


if __name__ == "__main__":
    run()
