import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_async_session
from app.models.design_token import DesignToken
from app.models.locked_token import LockedToken
from app.schemas.token import TokenRead, TokenUpdate
from app.services.token_manager import TokenManager

router = APIRouter(prefix="/api/tokens", tags=["Tokens"])

@router.get("/{site_id}", response_model=TokenRead)
async def get_tokens(site_id: uuid.UUID, session: AsyncSession = Depends(get_async_session)):
    stmt = select(DesignToken).where(DesignToken.site_id == site_id)
    result = await session.execute(stmt)
    tokens = result.scalar_one_or_none()
    if not tokens:
        raise HTTPException(status_code=404, detail="Tokens not found")
    return tokens

@router.put("/{site_id}", response_model=TokenRead)
async def update_tokens(site_id: uuid.UUID, data: TokenUpdate, session: AsyncSession = Depends(get_async_session)):
    stmt = select(DesignToken).where(DesignToken.site_id == site_id)
    result = await session.execute(stmt)
    tokens = result.scalar_one_or_none()
    if not tokens:
        raise HTTPException(status_code=404, detail="Tokens not found")
    
    manager = TokenManager()
    prev_state = {"colors": tokens.colors, "typography": tokens.typography, "spacing": tokens.spacing}
    
    # Update fields
    if data.colors: tokens.colors = data.colors
    if data.typography: tokens.typography = data.typography
    if data.spacing: tokens.spacing = data.spacing
    
    current_state = {"colors": tokens.colors, "typography": tokens.typography, "spacing": tokens.spacing}
    await manager.create_version(session, tokens.id, prev_state, current_state, "manual_edit")
    
    await session.commit()
    await session.refresh(tokens)
    return tokens

@router.post("/{site_id}/lock")
async def lock_token(site_id: uuid.UUID, path: str, value: Any, session: AsyncSession = Depends(get_async_session)):
    stmt = select(DesignToken).where(DesignToken.site_id == site_id)
    result = await session.execute(stmt)
    tokens = result.scalar_one_or_none()
    
    # Check for existing lock
    lock_stmt = select(LockedToken).where(LockedToken.token_id == tokens.id, LockedToken.token_path == path)
    lock_result = await session.execute(lock_stmt)
    existing = lock_result.scalar_one_or_none()
    
    if existing:
        existing.locked_value = value
    else:
        lock = LockedToken(token_id=tokens.id, token_path=path, locked_value=value)
        session.add(lock)
        
    await session.commit()
    return {"status": "locked"}
