from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, Dict, Any

class TokenBase(BaseModel):
    colors: Dict[str, Any]
    typography: Dict[str, Any]
    spacing: Dict[str, Any]
    metadata_info: Dict[str, Any]

class TokenUpdate(BaseModel):
    colors: Optional[Dict[str, Any]] = None
    typography: Optional[Dict[str, Any]] = None
    spacing: Optional[Dict[str, Any]] = None
    metadata_info: Optional[Dict[str, Any]] = None

class TokenRead(TokenBase):
    id: UUID
    site_id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LockedTokenRead(BaseModel):
    token_path: str
    locked_value: Any
    locked_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
