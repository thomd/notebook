from pydantic import BaseModel
from typing import List

class Page(BaseModel):
    id: str = None
    filename: str = None
    title: str = None
    content: str = None

class Pages(BaseModel):
    pages: List[Page]
    total: int = 0

