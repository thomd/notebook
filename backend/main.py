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
@app.get("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def get_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        return pg.getPage(path)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -d '{"title": "Foo", "content": "# Foo"}' http://127.0.0.1:8000/pages -s | jq
@app.post("/pages", status_code=201, response_model=model.Response, response_model_exclude_none=True)
def create_page(page: model.Page):
    filename = pg.createFilename(page.title)
    path = Path(f"{pages_dir}/{filename}.md")
    if path.exists():
        raise HTTPException(status_code=409, detail=f"Page '{filename}' does already exist")
    else:
        return pg.createPage(path, page)


# curl -X DELETE http://127.0.0.1:8000/pages/foo -s | jq
@app.delete("/pages/{page_id}")
def delete_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        pg.deletePage(path)
        return {"success": f"deleted page {page_id}"}
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -X PUT -d '{"title":"foo","content":"# foo"}' http://127.0.0.1:8000/pages/foo -s | jq
@app.put("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def update_page(page_id: str, page: model.Page):
    """ PUT is used to replace the existing page """
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        return pg.putPage(path, page)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -X PATCH -d '{"title": "Other Foo"}' http://127.0.0.1:8000/pages/foo -s | jq
# @app.patch("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
@app.patch("/pages/{page_id}")
def change_page(page_id: str, page: model.PageUpdate):
    """ PATCH is used to partially replace existing page attributes """
    path = Path(f"{pages_dir}/{page_id}.md")
    # TODO if new title a.k.a. page alread exist, then show error
    if path.exists():
        return pg.patchPage(path, page)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")
