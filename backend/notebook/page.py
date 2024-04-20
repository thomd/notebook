from notebook import model, repository, log
from slugify import slugify
from pathlib import Path

def _filename(path):
    return path.name

def _id(path):
    return slugify(path.stem)

def _title(path):
    return path.stem.title()

def _content(path):
    return path.read_text(encoding="utf-8")

def error(message):
    return model.Error(message)

def createFilename(title):
    return slugify(title)

def createId(title):
    return slugify(title)


def getPage(path):
    page= model.Page(
        id = _id(path),
        filename = _filename(path),
        title = _title(path),
        content = _content(path)
    )
    return page


def getPages(path):
    pages = []
    for page in path.iterdir():
        if page.is_file():
            pages.append(getPage(page))
    return model.Pages(pages=pages, total=len(pages))


def createPage(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', encoding='utf-8') as file:
        file.write(content)
    repository.add(_filename(path))
    page = model.Page(
        id = _id(path),
        filename = _filename(path),
        title = _title(path),
        content = content
    )
    return page


def deletePage(path):
    path.unlink()
    repository.delete(_filename(path))


