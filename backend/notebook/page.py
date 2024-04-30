from notebook import model, repository, log
from slugify import slugify
from pathlib import Path
import frontmatter

def _id(path):
    return path.stem

def _title(path):
    # FIXME remove
    return path.stem.title()

def _content(path):
    return path.read_text(encoding="utf-8")

def error(message):
    return model.Error(message)

def createFilename(title):
    return slugify(title)

def createId(title):
    return slugify(title)


def getPages(path):
    pages = []
    for page in path.iterdir():
        if page.is_file():
            pages.append(getPage(page))
    return model.Pages(pages=pages, total=len(pages))


def getPage(path):
    data = frontmatter.load(str(path))
    response = model.Response(
        id = path.stem,
        filename = path.name,
        title = data.get('title', path.stem),
        content = data.content
    )
    return response


def createPage(path, page):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = frontmatter.Post(content=page.content)
    data['title'] = page.title
    with path.open('w', encoding='utf-8') as file:
        file.write(frontmatter.dumps(data))
    repository.commit()
    response = model.Response(
        id = path.stem,
        filename = path.name,
        title = page.title,
        content = page.content
    )
    return response


def deletePage(path):
    path.unlink()
    repository.commit()


def putPage(path, page):
    return getPage(path).copy(update=page.dict(exclude_none=True))


def patchPage(path, page):
    updates = page.dict(exclude_none=True)
    if updates.get('content'):
        data = frontmatter.load(str(path))
        data.content = page.content
        with path.open('w', encoding='utf-8') as file:
            file.write(frontmatter.dumps(data))
    if updates.get('title'):
        filename = createFilename(updates.get('title'))
        path = path.rename(Path(f'{str(path.parent)}/{filename}.md'))
        data = frontmatter.load(str(path))
        data['title'] = updates.get('title')
        with path.open('w', encoding='utf-8') as file:
            file.write(frontmatter.dumps(data))
    repository.commit()
    return getPage(path).copy(update=updates)


