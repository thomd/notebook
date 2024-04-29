from fastapi import FastAPI, HTTPException
import os
from pathlib import Path
from notebook import page as pg
from notebook import model

pages_dir = os.getenv("PAGES_DIR")
app = FastAPI()


# curl http://127.0.0.1:8000/pages -s | jq
@app.get("/pages", response_model=model.Pages, response_model_exclude_none=True)
def get_pages():
    path = Path(pages_dir)
    return pg.getPages(path)


# curl http://127.0.0.1:8000/pages/foo -s | jq
@app.get("/pages/{page_id}", response_model=model.Page, response_model_exclude_none=True)
def get_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        return pg.getPage(path)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -X DELETE http://127.0.0.1:8000/pages/foo -s | jq
@app.delete("/pages/{page_id}")
def delete_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        pg.deletePage(path)
        return {"success": f"deleted page {page_id}"}
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -d '{"title":"foo","content":"# foo"}' http://127.0.0.1:8000/pages -s | jq
@app.post("/pages", status_code=201, response_model=model.Page, response_model_exclude_none=True)
def create_page(page: model.Page):
    filename = pg.createFilename(page.title)
    path = Path(f"{pages_dir}/{filename}.md")
    if path.exists():
        raise HTTPException(status_code=409, detail=f"Page '{filename}' does already exist")
    else:
        return pg.createPage(path, page.content)


# curl -H "Content-Type: application/json" -X PUT -d '{"title":"foo","content":"# foo"}' http://127.0.0.1:8000/pages/foo -s | jq
@app.put("/pages/{page_id}", response_model=model.Page, response_model_exclude_none=True)
    # TODO error if page does not exist
def update_page(page_id: str): # PUT is used to receive data that should replace the existing data.
    return {"todo": "update page"}


# curl -H "Content-Type: application/json" -X PATCH -d '{"title":"bar"}' http://127.0.0.1:8000/pages/foo -s | jq
@app.patch("/pages/{page_id}", response_model=model.Page, response_model_exclude_none=True)
def change_page(page_id: str, page: model.Page):
    """ PATCH is used to partially replace existing data. """
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        return pg.patchPage(path, page)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")
