from fastapi import FastAPI, HTTPException
import os
from pathlib import Path
from notebook import page as pg
from notebook import model

pages_dir = os.getenv("PAGES_DIR")
app = FastAPI()


# curl -H "Content-Type: application/json " http://localhost:8000/pages -s | jq
@app.get("/pages", response_model=model.Pages, response_model_exclude_none=True)
def get_pages():
    path = Path(pages_dir)
    return pg.getPages(path)


# curl -H "Content-Type: application/json" http://localhost:8000/pages/foo -s | jq
@app.get("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def get_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        return pg.getPage(path)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -d '{"title": "Foo", "content": "# Foo"}' http://localhost:8000/pages -s | jq
@app.post("/pages", status_code=201, response_model=model.Response, response_model_exclude_none=True)
def create_page(page: model.Page):
    filename = pg.createFilename(page.title)
    path = Path(f"{pages_dir}/{filename}")
    if path.exists():
        raise HTTPException(status_code=409, detail=f"Page '{filename}' does already exist")
    else:
        return pg.createPage(path, page)


# curl -H "Content-Type: application/json" -X DELETE http://localhost:8000/pages/foo -s | jq
@app.delete("/pages/{page_id}")
def delete_page(page_id: str):
    path = Path(f"{pages_dir}/{page_id}.md")
    if path.exists():
        pg.deletePage(path)
        return {"success": f"deleted page {page_id}"}
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -X PUT -d '{"title": "Foo", "content": "# Foo"}' http://localhost:8000/pages/foo -s | jq
@app.put("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def update_page(page_id: str, page: model.Page):
    """ PUT is used to replace the existing page """
    path = Path(f"{pages_dir}/{page_id}.md")
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")
    elif path.name != pg.createFilename(page.title) and Path(f'{pages_dir}/{pg.createFilename(page.title)}').exists():
        raise HTTPException(status_code=500, detail=f"Page '{pg.createId(page.title)}' does already exist")
    else:
        return pg.putPage(path, page)


# curl -H "Content-Type: application/json" -X PATCH -d '{"title": "Other Foo"}' http://localhost:8000/pages/foo -s | jq
@app.patch("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def change_page_attributes(page_id: str, page: model.PageUpdate):
    """ PATCH is used to partially replace existing page attributes """
    path = Path(f'{pages_dir}/{page_id}.md')
    if page.title != None and Path(f'{pages_dir}/{pg.createFilename(page.title)}').exists() and not path.exists():
        raise HTTPException(status_code=500, detail=f"Page '{pg.createId(page.title)}' does already exist")
    if path.exists():
        return pg.patchPage(path, page)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")
