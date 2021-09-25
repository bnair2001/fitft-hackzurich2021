from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    weight: Optional[int] = 0
    height: Optional[int] = 0

class Connection(BaseModel):
    connection_id: Optional[str] = ""
    user_id: Optional[str] = ""
    operation: Optional[str] = ""