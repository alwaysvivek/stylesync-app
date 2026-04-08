import uuid
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.design_token import DesignToken
from app.models.locked_token import LockedToken
from app.models.version_history import VersionHistory

class TokenManager:
    async def merge_with_locks(self, session: AsyncSession, site_id: uuid.UUID, new_tokens: Dict) -> Dict:
        # 1. Find existing tokens for this site
        stmt = select(DesignToken).where(DesignToken.site_id == site_id)
        result = await session.execute(stmt)
        db_token = result.scalar_one_or_none()
        
        if not db_token:
            return new_tokens

        # 2. Find all locks for this token record
        lock_stmt = select(LockedToken).where(LockedToken.token_id == db_token.id)
        lock_result = await session.execute(lock_stmt)
        locks = lock_result.scalars().all()
        
        # 3. Apply locks over the experimental new tokens
        merged = new_tokens.copy()
        for lock in locks:
            # Simple path traversal (colors, typography, spacing)
            parts = lock.token_path.split('.')
            if len(parts) == 2:
                cat, key = parts
                if cat in merged and key in merged[cat]:
                    merged[cat][key] = lock.locked_value
                    
        return merged

    async def create_version(self, session: AsyncSession, token_id: uuid.UUID, previous: Dict, current: Dict, change_type: str):
        history = VersionHistory(
            token_id=token_id,
            previous_state=previous,
            new_state=current,
            change_type=change_type
        )
        session.add(history)
        await session.flush()
