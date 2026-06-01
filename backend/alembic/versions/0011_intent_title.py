"""Add title (question label) to business_intents for Q&A packs

Revision ID: 0011_intent_title
Revises: 0010_gst_safety
Create Date: 2026-06-01
"""
from alembic import op
import sqlalchemy as sa


revision = "0011_intent_title"
down_revision = "0010_gst_safety"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "business_intents",
        sa.Column("title", sa.String(length=300), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("business_intents", "title")
