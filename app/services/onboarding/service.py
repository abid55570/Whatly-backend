"""Business creation and onboarding helpers."""
import logging

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models import Business, BusinessIntent, User
from app.services.matching import get_matching_engine

logger = logging.getLogger(__name__)


async def get_my_business(
    db: AsyncSession,
    user: User,
    *,
    with_subscription: bool = True,
) -> Business | None:
    """Return the user's business (None if not created yet)."""
    stmt = select(Business).where(Business.owner_user_id == user.id)
    if with_subscription:
        stmt = stmt.options(selectinload(Business.subscription))
    return (await db.execute(stmt)).scalar_one_or_none()


async def get_my_business_or_404(
    db: AsyncSession,
    user: User,
    *,
    with_subscription: bool = True,
) -> Business:
    """Like get_my_business but raises 404 if not found."""
    biz = await get_my_business(db, user, with_subscription=with_subscription)
    if biz is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No business found for this user. Create one first.",
        )
    return biz


async def initialize_default_intents(
    db: AsyncSession,
    business: Business,
) -> int:
    """Pre-populate BusinessIntent rows, all enabled, ready to use.

    Preference order:
      1. Business-type Q&A pack (kirana/restaurant/salon, …) — concrete
         question→answer cards in the owner's language. Seeded with the
         English answer in reply_text and hi/hinglish in reply_translations,
         so replies are multilingual out of the box.
      2. Fallback: the 10 generic global intents (for types without a pack).

    The owner reviews/edits these in the Q&A picker; nothing is required.
    """
    from app.services.intents import seed_entries

    biz_type = (
        business.business_type.value
        if hasattr(business.business_type, "value")
        else str(business.business_type)
    )
    primary_language = business.languages[0] if business.languages else None

    pack_rows = seed_entries(biz_type, primary_language)
    if pack_rows:
        for entry in pack_rows:
            db.add(
                BusinessIntent(
                    business_id=business.id,
                    intent_key=entry["intent_key"],
                    title=entry["title"],
                    enabled=True,
                    reply_text=entry["reply_text"],
                    reply_translations=entry["reply_translations"],
                    priority=entry["priority"],
                    custom_keywords=[],
                )
            )
        await db.flush()
        logger.info(
            "Seeded %d pack intents (%s) for business %s",
            len(pack_rows),
            biz_type,
            business.id,
        )
        return len(pack_rows)

    # ---- Fallback: generic global intents ----
    engine = get_matching_engine()
    created = 0
    for intent_def in engine.library.list_all():
        reply = (
            intent_def.default_reply_template.replace("[Your Business]", business.name)
            .replace("[Business Name]", business.name)
            .replace("{{business_name}}", business.name)
        )
        db.add(
            BusinessIntent(
                business_id=business.id,
                intent_key=intent_def.key,
                title=intent_def.name,
                enabled=True,
                reply_text=reply,
                priority=intent_def.priority,
                custom_keywords=[],
            )
        )
        created += 1

    await db.flush()
    logger.info(
        "Initialized %d generic intents for business %s", created, business.id
    )
    return created
