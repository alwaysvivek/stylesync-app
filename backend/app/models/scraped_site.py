import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, ForeignKey, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from app.models.base import BaseModel

class ScrapedSite(BaseModel):
    __tablename__ = "scraped_sites"

    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    domain: Mapped[Optional[str]] = mapped_column(String(255))
    raw_html: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    error_message: Mapped[Optional[str]] = mapped_column(Text)

    tokens: Mapped[List["DesignToken"]] = relationship("DesignToken", back_populates="site", cascade="all, delete-orphan")
