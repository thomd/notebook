from elasticsearch import Elasticsearch
from markdown import markdown
from notebook import log
from notebook import page as pg
import os
import re

url = os.environ.get('BASE_URL_ELASTICSEARCH')
client = Elasticsearch(url)

def sanitize(content):
    content = markdown(content)                            # transform Markdown to HTML
    content = re.sub(re.compile('<.*?>'), '', content)     # remove HTML tags
    content = content.replace('\n', ' ')                   # remove line-breaks
    return content

def createDocument(id, title, category, content):
    document = {
        'title': title,
        'category': category,
        'content': sanitize(content),
        'url': f'/pages/{id}'
    }
    result = client.index(index='notebooks', id=id, document=document)
    log.info(f"ingested document '{title}' ({result['_id']})")

def updateDocument(id, title, category, content):
    document = {
        'title': title,
        'category': category,
        'content': sanitize(content),
        'url': f'/pages/{id}'
    }
    result = client.update(index='notebooks', id=id, doc=document)
    log.info(f"updated document '{title}' ({result['_id']})")

def deleteDocument(path):
    p = pg.getPage(path)
    result = client.delete(index='notebooks', id=p.id)
    log.info(f"deleted document '{p.title}' ({result['_id']})")
