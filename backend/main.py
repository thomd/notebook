from fastapi import FastAPI, HTTPException
import os
from pathlib import Path
from notebook import page as pg
from notebook import model

pages_dir = os.getenv("PAGES_DIR")
app = FastAPI()

# curl http://127.0.0.1:8000/pages -s | jq
@app.get("/pages")
def get_pages():
    path = Path(pages_dir)
    return pg.getPages(path)

# curl http://127.0.0.1:8000/pages/foo -s | jq
@app.get("/pages/{page_id}")
def get_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        return pg.getPage(path)
    else:
        raise HTTPException(status_code=404, detail="Page does not exist")

# curl -H "Content-Type: application/json" -d '{"title":"foo","content":"# foo"}' http://127.0.0.1:8000/pages -s | jq
@app.post("/pages", status_code=201)
def create_new_page(page: model.Page):
    filename = pg.createFilename(page.title)
    path = Path(f"{pages_dir}/{filename}.md")
    if path.exists():
        raise HTTPException(status_code=409, detail="Page does already exist")
    else:
        return pg.createPage(path, page.content)

@app.delete("/pages/{page_id}")
def delete_page(page_id: str):
    # TODO error if page does not exist
    return {"todo": "delete page"}

@app.patch("/pages/{page_id}")
    # TODO error if page does not exist
def update_page(page_id: str):
    return {"todo": "update page"}
