import uuid
from typing import Optional, List, Dict, Any
from sqlalchemy import String, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.models.base import BaseModel

class DesignToken(BaseModel):
    __tablename__ = "design_tokens"

    site_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("scraped_sites.id", ondelete="CASCADE"), nullable=False)
    
    colors: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=lambda: {})
    typography: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=lambda: {})
    spacing: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=lambda: {})
    metadata_info: Mapped[Dict[str, Any]] = mapped_column(JSONB, nullable=False, default=lambda: {})

    site: Mapped["ScrapedSite"] = relationship("ScrapedSite", back_populates="tokens")
    locks: Mapped[List["LockedToken"]] = relationship("LockedToken", back_populates="token", cascade="all, delete-orphan")
    history: Mapped[List["VersionHistory"]] = relationship("VersionHistory", back_populates="token", cascade="all, delete-orphan")
