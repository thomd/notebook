from typing import Union
from fastapi import FastAPI
from git import Repo
import os

remote_pages_repo = os.getenv("REMOTE_PAGES_REPO")
local_pages_repo = os.getenv("LOCAL_PAGES_REPO")
try:
    repo = Repo(local_pages_repo)
    repo.remotes.origin.pull()
except:
    repo = Repo.clone_from(remote_pages_repo, local_pages_repo)

status = repo.git.status()
print(status)


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
