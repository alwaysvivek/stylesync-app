import uuid
from typing import Any, Dict
from sqlalchemy import Text, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.models.base import BaseModel

class VersionHistory(BaseModel):
    __tablename__ = "version_history"

    token_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("design_tokens.id", ondelete="CASCADE"), nullable=False)
    previous_state: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    new_state: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False)
    change_type: Mapped[str] = mapped_column(Text, nullable=False)

    token: Mapped["DesignToken"] = relationship("DesignToken", back_populates="history")
