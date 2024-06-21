from notebook import model, repository
from slugify import slugify
from pathlib import Path
import frontmatter
import os
from notebook import log

def pagesDir():
    ''' to make API testable, endpoints determine pages location in each call '''
    return os.environ.get("PAGES_DIR")

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


def getPageFragment(path, start, end):
    data = frontmatter.load(str(path))
    lines = data.content.splitlines()
    fragments = lines[start-1:end]
    fragment = '\n'.join(fragments)
    response = model.Response(
        id = path.stem,
        filename = path.name,
        title = data.get('title', path.stem),
        category = data.get('category'),
        favorite = data.get('favorite', False),
        content = fragment
    )
    return response


def createPage(path, page):
    data = frontmatter.Post(content=page.content)
    data['title'] = page.title
    if page.category:
        data['category'] = page.category
    if page.favorite != None:
        data['favorite'] = page.favorite
    with path.open('w', encoding='utf-8') as file:
        file.write(frontmatter.dumps(data))
    repository.commit()
    response = getPage(path)
    return response


def deletePage(path):
    path.unlink()
    repository.commit()


def putPage(path, page):
    current_page = getPage(path)
    if current_page.title != page.title:
        path = path.rename(Path(f'{str(path.parent)}/{createFilename(page.title)}'))
    return createPage(path, page)


def updatePage(path, page):
    updates = page.model_dump(exclude_none=True)

    # if we change the title we first rename the file
    if updates.get('title') and path.stem != createId(updates.get('title')):
        filename = createFilename(updates.get('title'))
        path = path.rename(Path(f'{str(path.parent)}/{filename}'))

    # then we update the content and the frontmatter
    data = frontmatter.load(str(path))
    if updates.get('content'):
        data.content = updates.get('content')
    if updates.get('title'):
        data['title'] = updates.get('title')
    if 'favorite' in data:
        del data['favorite']
    if updates.get('favorite') == True:
        data['favorite'] = updates.get('favorite')
    if updates.get('category'):
        data['category'] = updates.get('category')

    # finally we write the file ...
    with path.open('w', encoding='utf-8') as file:
        file.write(frontmatter.dumps(data))

    # ... commit ...
    repository.commit()

    # ... and return the page data
    return getPage(path)


def updatePageWithFragment(path, start, end, page):
    updates = page.model_dump(exclude_none=True)
    log.info(f'updates: {updates}')

    # if we change the title we first rename the file
    if updates.get('title') and path.stem != createId(updates.get('title')):
        filename = createFilename(updates.get('title'))
        path = path.rename(Path(f'{str(path.parent)}/{filename}'))

    # then we update the content and the frontmatter
    data = frontmatter.load(str(path))
    if updates.get('content') != None:
        lines = data.content.splitlines()
        fragments = updates.get('content').splitlines()
        newLines = [*lines[:start-1], *fragments, *lines[end:]]
        data.content = '\n'.join(newLines)
    if updates.get('title'):
        data['title'] = updates.get('title')
    if 'favorite' in data:
        del data['favorite']
    if updates.get('favorite') == True:
        data['favorite'] = updates.get('favorite')
    if updates.get('category'):
        data['category'] = updates.get('category')

    # finally we write the file ...
    with path.open('w', encoding='utf-8') as file:
        file.write(frontmatter.dumps(data))

    # ... commit ...
    repository.commit()

    # ... and return the page data
    return getPage(path)
