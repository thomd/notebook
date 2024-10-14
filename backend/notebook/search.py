from elasticsearch import Elasticsearch
from markdown import markdown
from notebook import log
from notebook import page as pg
import os
import re

url = 'http://elasticsearch:9200' if os.environ.get('NOTEBOOK_MODE') == 'production' else 'http://localhost:9202'
client = Elasticsearch(url)

def sanitize(content):
    content = markdown(content)                            # transform Markdown to HTML
    content = re.sub(re.compile('<.*?>'), '', content)     # remove HTML tags
    content = content.replace('\n', ' ')                   # remove line-breaks
    content = content.replace('≈', '')                   # remove text-highlight symbol
    return content

def createDocument(id, title, category, content):
    document = {
        'title': title,
        'category': category,
        'content': sanitize(content),
        'url': f'/pages/{id}/'
    }
    result = client.index(index='notebooks', id=id, document=document)
    log.info(f"CREATE elasticsearch document '{result['_id']}'")

def updateDocument(id, title, category, content):
    document = {
        'title': title,
        'category': category,
        'content': sanitize(content),
        'url': f'/pages/{id}/'
    }
    result = client.update(index='notebooks', id=id, doc=document)
    log.info(f"UPDATE elasticsearch document '{result['_id']}'")

def deleteDocument(path):
    p = pg.getPage(path)
    result = client.delete(index='notebooks', id=p.id)
    log.info(f"DELETE elasticsearch document '{result['_id']}'")

def deleteDocumentById(id):
    result = client.delete(index='notebooks', id=id)
    log.info(f"DELETE elasticsearch document '{result['_id']}'")
