from pydantic import BaseModel
from typing import List

class Page(BaseModel):
    id: str = None
    filename: str = None
    title: str
    content: str

class Pages(BaseModel):
    pages: List[Page]
    total: int = 0

