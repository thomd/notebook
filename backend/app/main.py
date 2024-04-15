from typing import Union
from fastapi import FastAPI
from git import Repo

# repo_url = "https://github.com/gitpython-developers/QuickStartTutorialFiles.git"

# repo = Repo.clone_from(repo_url, local_dir)


app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
