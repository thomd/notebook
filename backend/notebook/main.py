from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from notebook import page as pg
from notebook import search as es
from notebook import model
from notebook import log
from notebook import repository

origins = [
    "http://localhost:3000",
    "https://notebook",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# curl -H "Content-Type: application/json " http://localhost:9100/pages -s | jq
@app.get("/pages", response_model=model.Pages, response_model_exclude_none=True)
def get_pages():
    path = Path(pg.pagesDir())
    return pg.getPages(path)


# curl -H "Content-Type: application/json" http://localhost:9100/pages/foo -s | jq
@app.get("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def get_page(page_id: str):
    path = Path(f"{pg.pagesDir()}/{page_id}.md")
    if path.exists():
        return pg.getPage(path)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" http://localhost:9100/pages/foo/1/2 -s | jq
@app.get("/pages/{page_id}/{start}/{end}", response_model=model.Response, response_model_exclude_none=True)
def get_page(page_id: str, start: int, end: int):
    path = Path(f"{pg.pagesDir()}/{page_id}.md")
    if start <= 0 or end < start:
        raise HTTPException(status_code=404, detail=f"Page with lines {start} to {end} does not exist")
    if path.exists():
        return pg.getPageFragment(path, start, end)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -d '{"title": "Foo", "content": "# Foo"}' http://localhost:9100/pages -s | jq
@app.post("/pages", status_code=201, response_model=model.Response, response_model_exclude_none=True)
def create_page(background_tasks: BackgroundTasks, page: model.Page):
    filename = pg.createFilename(page.title)
    path = Path(f"{pg.pagesDir()}/{filename}")
    if path.exists():
        raise HTTPException(status_code=409, detail=f"Page '{path.stem}' does already exist")
    else:
        response = pg.createPage(path, page)
        es.createDocument(response.id, response.title, response.category, response.content)
        background_tasks.add_task(repository.push)
        return response


# curl -H "Content-Type: application/json" -X PATCH -d '{"title": "Other Foo"}' http://localhost:9100/pages/foo -s | jq
@app.patch("/pages/{page_id}", response_model=model.Response, response_model_exclude_none=True)
def update_page(background_tasks: BackgroundTasks, page_id: str, page: model.PageUpdate):
    """ PATCH is used to partially replace existing page attributes. """
    path = Path(f'{pg.pagesDir()}/{page_id}.md')
    # if we change the title to an already existing page, we would unintentionally overwrite it
    if page.title != None and page_id != pg.createId(page.title) and Path(f'{pg.pagesDir()}/{pg.createFilename(page.title)}').exists():
        raise HTTPException(status_code=500, detail=f"Page '{pg.createId(page.title)}' does already exist")
    elif path.exists():
        response = pg.updatePage(path, page)
        if page.title != None and page_id != response.id:
            es.createDocument(response.id, response.title, response.category, response.content)
            es.deleteDocumentById(page_id)
        else:
            es.updateDocument(response.id, response.title, response.category, response.content)
        background_tasks.add_task(repository.push)
        return response
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -X PATCH -d '{"content": "Bar"}' http://localhost:9100/pages/foo/1/2 -s | jq
@app.patch("/pages/{page_id}/{start}/{end}", response_model=model.Response, response_model_exclude_none=True)
def update_page(background_tasks: BackgroundTasks, page_id: str, start: int, end: int, page: model.PageUpdate):
    """ PATCH content of a page with a updated fragment between lines {start} and {end}. """
    if start <= 0 or end < start:
        raise HTTPException(status_code=404, detail=f"Page with lines {start} to {end} does not exist")
    path = Path(f'{pg.pagesDir()}/{page_id}.md')
    # if we change the title to an existing page, we would unintentionally overwrite it
    if page.title != None and page_id != pg.createId(page.title) and Path(f'{pg.pagesDir()}/{pg.createFilename(page.title)}').exists():
        raise HTTPException(status_code=500, detail=f"Page '{pg.createId(page.title)}' does already exist")
    elif path.exists():
        response = pg.updatePageWithFragment(path, start, end, page)
        if page.title != None and page_id != response.id:
            es.createDocument(response.id, response.title, response.category, response.content)
            es.deleteDocumentById(page_id)
        else:
            es.updateDocument(response.id, response.title, response.category, response.content)
        background_tasks.add_task(repository.push)
        return response
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")


# curl -H "Content-Type: application/json" -X DELETE http://localhost:9100/pages/foo -s | jq
@app.delete("/pages/{page_id}", status_code=204)
def delete_page(background_tasks: BackgroundTasks, page_id: str):
    path = Path(f"{pg.pagesDir()}/{page_id}.md")
    if path.exists():
        es.deleteDocument(path)
        pg.deletePage(path)
        background_tasks.add_task(repository.push)
    else:
        raise HTTPException(status_code=404, detail=f"Page '{page_id}' does not exist")

