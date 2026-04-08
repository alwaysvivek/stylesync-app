from pydantic import BaseModel, HttpUrl, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Dict, Any

class SiteBase(BaseModel):
    url: str
    domain: Optional[str] = None

class SiteCreate(SiteBase):
    pass

class SiteRead(SiteBase):
    id: UUID
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
