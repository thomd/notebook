from elasticsearch import Elasticsearch
from markdown import markdown
from notebook import log
import os
import re

url = 'http://elasticsearch:9200' if os.environ.get('NOTEBOOK_MODE') == 'production' else 'http://localhost:9200'
client = Elasticsearch(url)

def sanitize(text):
    text = markdown(text)                            # transform Markdown to HTML
    text = re.sub(re.compile('<.*?>'), '', text)     # remove HTML tags
    text = text.replace('\n', ' ')                   # remove line-breaks
    return text

def createDocument(path):
    p = pg.getPage(path)
    content = es.sanitize(p.content)
    document = {
        'title': p.title,
        'category': p.category,
        'content': content,
        'url': f'/pages/{p.id}'
    }
    result = client.index(index='notebooks', id=p.id, document=document)
    client.indices.refresh(index='notebooks')
    log.info(f"ingested document '{p.title}' ({result['_id']})")

def updateDocument(path):
    p = pg.getPage(path)
    content = es.sanitize(p.content)
    document = {
        'title': p.title,
        'category': p.category,
        'content': content,
        'url': f'/pages/{p.id}'
    }
    result = client.update(index='notebooks', id=p.id, doc=document)
    client.indices.refresh(index='notebooks')
    log.info(f"updated document '{p.title}' ({result['_id']})")

def deleteDocument(path):
    p = pg.getPage(path)
    result = client.delete(index='notebooks', id=p.id)
    client.indices.refresh(index='notebooks')
    log.info(f"updated document '{p.title}' ({result['_id']})")
