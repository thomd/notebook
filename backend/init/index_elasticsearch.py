from pathlib import Path
from elasticsearch import Elasticsearch
from notebook import page as pg
from notebook import log
from markdown import markdown
import os

def remove_html_tags(text):
    import re
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

url = 'http://elasticsearch:9200' if os.environ.get('NOTEBOOK_MODE') == 'production' else 'http://localhost:9200'
es = Elasticsearch(url)

if not es.indices.exists(index='notebooks'):
    es.indices.create(index='notebooks', body={})
    log.info(f"created ealsticesearch index 'notebooks'")
    path = Path(pg.pagesDir())
    pagecount = 0
    for page in path.iterdir():
        if page.is_file():
            page = pg.getPage(page)
            pagecount += 1
            content = remove_html_tags(markdown(page.content))
            document = {
                'title': page.title,
                'category': page.category,
                'content': content,
                'url': f'/pages/{page.id}'
            }
            result = es.index(index='notebooks', body=document)
            log.info(f"ingested document '{page.title}' ({result['_id']})")
    log.info(f'ingested {pagecount} pages into elasticsearch')
