from pydantic import BaseModel, Field
from typing import List, Optional

class Page(BaseModel):
    title: str = Field(min_length=2, max_length=100, example="Page Title")
    category: Optional[str] = None
    favorite: bool = Field(default=False)
    content: str = Field(example = "# Page Title")

class Response(Page):
    id: str = Field(min_length=2, max_length=100, pattern=r'^[a-z0-9-]+$', example="page")
    filename: str = Field(pattern=r'^[a-z0-9-]+\.md$', example="page.md")

class PageUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    favorite: Optional[bool] = None
    content: Optional[str] = None

class Pages(BaseModel):
    pages: List[Response]
    total: int = 0

