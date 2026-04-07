from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from app.database import get_async_session
from app.models import ScrapedSite, DesignToken

async def get_site_by_id(site_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)) -> ScrapedSite:
    """Fetch a ScrapedSite by ID, raise 404 if not found."""
    stmt = select(ScrapedSite).where(ScrapedSite.id == site_id)
    result = await session.execute(stmt)
    site = result.scalar_one_or_none()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")
    return site

async def get_tokens_by_site_id(site_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)) -> DesignToken:
    """Fetch a DesignToken by site_id, raise 404 if not found."""
    stmt = select(DesignToken).where(DesignToken.site_id == site_id)
    result = await session.execute(stmt)
    token = result.scalar_one_or_none()
    if not token:
        raise HTTPException(status_code=404, detail="Tokens not found for this site")
    return token
