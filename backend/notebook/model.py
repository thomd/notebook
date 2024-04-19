from dataclasses import dataclass
from typing import List

@dataclass
class Page:
    id: str
    filename: str
    title: str
    content: str
    changed: bool = False

@dataclass
class Pages:
    pages: List[Page]

