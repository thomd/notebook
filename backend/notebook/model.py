from pydantic import BaseModel, Field
from typing import List, Optional

class Page(BaseModel):
    title: str = Field(min_length=2, max_length=100, example="Foo")
    content: str = Field(example = "# Foo")

class Response(Page):
    id: str = Field(min_length=2, max_length=100, pattern=r'^[a-z0-9-]+$', example="foo")
    filename: str = Field(pattern=r'^[a-z0-9-]+\.md$', example="foo.md")

class PageUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class Pages(BaseModel):
    pages: List[Response]
    total: int = 0

