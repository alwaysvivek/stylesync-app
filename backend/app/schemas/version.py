from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Dict, Any

class VersionRead(BaseModel):
    id: UUID
    token_id: UUID
    previous_state: Dict[str, Any]
    new_state: Dict[str, Any]
    change_type: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
