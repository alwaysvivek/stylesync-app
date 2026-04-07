import uuid
from datetime import datetime
from typing import Any, Dict
from sqlalchemy import Text, ForeignKey, DateTime, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from app.models.base import BaseModel

class LockedToken(BaseModel):
    __tablename__ = "locked_tokens"

    token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("design_tokens.id", ondelete="CASCADE"), nullable=False)
    token_path: Mapped[str] = mapped_column(Text, nullable=False)
    locked_value: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    locked_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    token: Mapped["DesignToken"] = relationship("DesignToken", back_populates="locks")

class VersionHistory(BaseModel):
    __tablename__ = "version_history"

    token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("design_tokens.id", ondelete="CASCADE"), nullable=False)
    previous_state: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    new_state: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    change_type: Mapped[str] = mapped_column(Text, nullable=False)

    token: Mapped["DesignToken"] = relationship("DesignToken", back_populates="history")
