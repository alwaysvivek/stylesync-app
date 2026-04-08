import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.database import get_async_session
from app.models.design_token import DesignToken
from app.models.version_history import VersionHistory
from app.schemas.version import VersionRead

router = APIRouter(prefix="/api/versions", tags=["Versions"])

@router.get("/{site_id}", response_model=list[VersionRead])
async def get_history(site_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)):
    stmt = select(DesignToken).where(DesignToken.site_id == site_id)
    result = await session.execute(stmt)
    tokens = result.scalar_one_or_none()
    if not tokens: return []
    
    v_stmt = select(VersionHistory).where(VersionHistory.token_id == tokens.id).order_by(desc(VersionHistory.created_at))
    v_result = await session.execute(v_stmt)
    return v_result.scalars().all()

@router.post("/{site_id}/restore/{version_id}")
async def restore_version(site_id: uuid.UUID, version_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)):
    stmt = select(DesignToken).where(DesignToken.site_id == site_id)
    result = await session.execute(stmt)
    tokens = result.scalar_one_or_none()
    
    v_stmt = select(VersionHistory).where(VersionHistory.id == version_id)
    v_result = await session.execute(v_stmt)
    version = v_result.scalar_one_or_none()
    
    if version:
        tokens.colors = version.new_state["colors"]
        tokens.typography = version.new_state["typography"]
        tokens.spacing = version.new_state["spacing"]
        await session.commit()
        return {"status": "restored"}
    return {"status": "failed"}
