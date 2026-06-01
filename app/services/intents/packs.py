"""Business-type Q&A packs.

Curated, ready-to-use question→answer sets per business type (kirana, restaurant,
salon, …) authored in data/intent_packs/<type>.json. At onboarding we seed a
business's intents FROM its type's pack (instead of the 10 generic globals), and
at match time we build IntentDefinitions from the pack so the engine can match
customer messages against these Q&As.

A pack entry carries:
  - question : human label shown to the owner (en/hi/hinglish)
  - answer   : suggested reply (en/hi/hinglish) — editable by the owner
  - keywords : multilingual match triggers (fed to the matching engine)
  - patterns/emojis/priority/category
"""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from app.services.matching.schemas import IntentDefinition

_PACKS_DIR = Path(__file__).resolve().parents[3] / "data" / "intent_packs"

# BusinessType enum value → pack filename stem (data/intent_packs/<stem>.json).
# Types without a pack fall back to the generic global intents.
_TYPE_TO_PACK: dict[str, str] = {
    "shop": "kirana",
    "restaurant": "restaurant",
    "salon": "salon",
}

# Business Language enum value → pack language key for the question LABEL.
# Packs ship en/hi/hinglish today; other languages get a sensible label fallback
# (answers still carry their own translations independently).
_LANG_TO_PACK_KEY: dict[str, str] = {
    "english": "en",
    "hindi": "hi",
    "hinglish": "hinglish",
    "urdu": "hinglish",
    "bhojpuri": "hi",
    "bengali": "en",
}


@lru_cache(maxsize=16)
def load_pack(business_type: str) -> dict | None:
    """Load and cache the raw pack JSON for a business type (None if no pack)."""
    stem = _TYPE_TO_PACK.get(business_type)
    if not stem:
        return None
    path = _PACKS_DIR / f"{stem}.json"
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def has_pack(business_type: str) -> bool:
    return load_pack(business_type) is not None


@lru_cache(maxsize=16)
def pack_intent_definitions(business_type: str) -> dict[str, IntentDefinition]:
    """Build IntentDefinitions (keyed by intent_key) for a type's pack Q&As.

    These are passed to the matching engine as `custom_intents` so customer
    messages match against the pack's keywords/patterns.
    """
    pack = load_pack(business_type)
    if not pack:
        return {}
    defs: dict[str, IntentDefinition] = {}
    for qa in pack.get("qa", []):
        defs[qa["key"]] = IntentDefinition(
            key=qa["key"],
            name=qa.get("question", {}).get("en", qa["key"]),
            description="",
            default_reply_template=qa.get("answer", {}).get("en", ""),
            languages=qa.get("keywords", {}),
            patterns=qa.get("patterns", []),
            emojis=qa.get("emojis", []),
            priority=qa.get("priority", 0),
            category=qa.get("category", "general"),
        )
    return defs


def seed_entries(
    business_type: str, primary_language: str | None
) -> list[dict]:
    """Return BusinessIntent seed dicts from the pack for a new business.

    Each dict: {intent_key, title, reply_text, reply_translations, priority}.
    `reply_text` is the English answer; `reply_translations` carries hi/hinglish
    so replies are multilingual out of the box. `title` (the question label) is
    in the owner's primary language where available.
    """
    pack = load_pack(business_type)
    if not pack:
        return []
    title_key = _LANG_TO_PACK_KEY.get(primary_language or "", "hinglish")
    entries: list[dict] = []
    for qa in pack.get("qa", []):
        q = qa.get("question", {})
        a = qa.get("answer", {})
        title = q.get(title_key) or q.get("hinglish") or q.get("en") or qa["key"]
        reply_text = a.get("en") or a.get("hinglish") or next(iter(a.values()), "")
        translations = {k: v for k, v in a.items() if k != "en" and v}
        entries.append(
            {
                "intent_key": qa["key"],
                "title": title,
                "reply_text": reply_text,
                "reply_translations": translations,
                "priority": qa.get("priority", 0),
            }
        )
    return entries
