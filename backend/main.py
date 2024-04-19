from fastapi import FastAPI
import os
from pathlib import Path
from notebook import repo, model, page

pages_dir = os.getenv("PAGES_DIR")

app = FastAPI()

@app.get("/pages")
def read_pages():
    path = Path(pages_dir)
    pages = [(p.name, p.stem) for p in path.iterdir() if p.is_file()]
    return {"pages": [{"filename": p[0], "id": p[1], "name": p[1].title()} for p in pages]}

@app.get("/pages/{page_id}")
def read_item(page_id: str):
    path = Path(f'{pages_dir}/{page_id}.md')
    filename = page.getFilename(path)
    id = page.getId(path)
    title = page.getTitle(path)
    content = page.getContent(path)
    return model.Page(id, filename, title, content)
