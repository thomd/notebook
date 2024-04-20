from notebook import model
from slugify import slugify

def _filename(path):
    return path.name

def _id(path):
    return path.stem

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

def createPage(p):
    page = model.Page(
        id = createId(p.title),
        filename = createFilename(p.title),
        title = p.title,
        content = p.content
    )
    return page




