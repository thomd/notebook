from pathlib import Path
from elasticsearch import Elasticsearch
from notebook import page as pg
from notebook import search as es
from notebook import log
import os

url = 'http://elasticsearch:9200' if os.environ.get('NOTEBOOK_MODE') == 'production' else 'http://localhost:9200'
client = Elasticsearch(url)

if not client.indices.exists(index='notebooks'):
    client.indices.create(index='notebooks', body={})
    log.info(f"created ealsticesearch index 'notebooks'")
    path = Path(pg.pagesDir())
    pagecount = 0
    for page in path.iterdir():
        if page.is_file():
            p = pg.getPage(page)
            pagecount += 1
            content = es.sanitize(p.content)
            document = {
                'title': p.title,
                'category': p.category,
                'content': content,
                'url': f'/pages/{p.id}'
            }
            result = client.index(index='notebooks', id=p.id, body=document)
            log.info(f"ingested document '{p.title}' ({result['_id']})")
    log.info(f'ingested {pagecount} pages into elasticsearch')
