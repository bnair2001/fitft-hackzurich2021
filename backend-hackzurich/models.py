from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: Optional[str] = None
    email: str
    password: str

class Connection(BaseModel):
    connection_id: Optional[str] = ""
    user_id: Optional[str] = ""