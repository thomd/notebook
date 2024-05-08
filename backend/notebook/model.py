from pydantic import BaseModel, Field
from typing import List, Optional

class Page(BaseModel):
    title: str = Field(min_length=2, max_length=100, examples=["Page Title"])
    category: Optional[str] = None
    favorite: Optional[bool] = None
    content: str = Field(examples=["# Page Title"])

class Response(Page):
    id: str = Field(min_length=2, max_length=100, pattern=r'^[a-z0-9-]+$', examples=["page"])
    filename: str = Field(pattern=r'^[a-z0-9-]+\.md$', examples=["page.md"])

class PageUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    favorite: Optional[bool] = None
    content: Optional[str] = None

class Pages(BaseModel):
    pages: List[Response]
    total: int = 0
