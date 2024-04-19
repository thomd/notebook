from fastapi import FastAPI
import os
from pathlib import Path
from notebook import repo, model, page

pages_dir = os.getenv("PAGES_DIR")

app = FastAPI()

@app.get("/pages")
def read_pages():
    pages = []
    for path in Path(pages_dir).iterdir():
        if path.is_file():
            pages.append(page.create(path))
    return pages

@app.get("/pages/{page_id}")
def read_item(page_id: str):
    path = Path(f'{pages_dir}/{page_id}.md')
    return page.create(path)
