from typing import Union
from fastapi import FastAPI
import os
from pathlib import Path
from notebook import repo

pages_dir = os.getenv("PAGES_DIR")

app = FastAPI()

@app.get("/pages")
def read_pages():
    path = Path(pages_dir)
    pages = [(p.name, p.stem) for p in path.iterdir() if p.is_file()]
    return {"pages": [{"filename": page[0], "id": page[1], "name": page[1].title()} for page in pages]}

@app.get("/pages/{page_id}")
def read_item(page_id: str):
    path = Path(f'{pages_dir}/{page_id}.md')
    content = path.read_text(encoding="utf-8")
    return {"page": {"filename": path.name, "id": path.stem, "name": path.stem.title()}, "content": content}
