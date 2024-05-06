from notebook import model, repository, log
from slugify import slugify
from pathlib import Path
import frontmatter

def createFilename(title):
    return slugify(title) + '.md'

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
        category = data.get('category'),
        favorite = data.get('favorite', False),
        content = data.content
    )
    return response

def createPage(path, page):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = frontmatter.Post(content=page.content)
    data['title'] = page.title
    if page.category:
        data['category'] = page.category
    if page.favorite != None:
        data['favorite'] = page.favorite
    with path.open('w', encoding='utf-8') as file:
        file.write(frontmatter.dumps(data))
    repository.commit()
    response = model.Response(
        id = path.stem,
        filename = path.name,
        title = page.title,
        category = page.category,
        favorite = page.favorite,
        content = page.content
    )
    return response

def deletePage(path):
    path.unlink()
    repository.commit()

def putPage(path, page):
    current_page = getPage(path)
    if current_page.title != page.title:
        path = path.rename(Path(f'{str(path.parent)}/{createFilename(page.title)}'))
    return createPage(path, page)

def patchPage(path, page):
    updates = page.dict(exclude_none=True)
    if not updates.get('title'):
        data = frontmatter.load(str(path))
        if updates.get('content'):
            data.content = updates.get('content')
        if updates.get('category'):
            data['category'] = updates.get('category')
        if updates.get('favorite') != None:
            data['favorite'] = updates.get('favorite')
        with path.open('w', encoding='utf-8') as file:
            file.write(frontmatter.dumps(data))
    if updates.get('title'):
        filename = createFilename(updates.get('title'))
        path = path.rename(Path(f'{str(path.parent)}/{filename}'))
        data = frontmatter.load(str(path))
        data['title'] = updates.get('title')
        with path.open('w', encoding='utf-8') as file:
            file.write(frontmatter.dumps(data))
    repository.commit()
    return getPage(path).copy(update=updates)

