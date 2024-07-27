from pydantic import BaseModel, Field
from typing import List, Optional

class Page(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    category: Optional[str] = None
    favorite: Optional[bool] = None
    content: Optional[str] = ""

class Response(Page):
    id: str = Field(min_length=1, max_length=100, pattern=r'^[a-z0-9-]+$')
    cid: Optional[str] = None
    filename: str = Field(pattern=r'^[a-z0-9-]+\.md$')

class PageUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    favorite: Optional[bool] = None
    content: Optional[str] = None

class Pages(BaseModel):
    pages: List[Response]
    total: int = 0
