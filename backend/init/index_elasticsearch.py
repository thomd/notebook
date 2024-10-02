from pathlib import Path
from elasticsearch import Elasticsearch
from notebook import page as pg
from notebook import search as es
from notebook import log
import os

url = os.environ.get('BASE_URL_ELASTICSEARCH')
client = Elasticsearch(url)

if not client.indices.exists(index='notebooks'):
    mapping = {
        "settings": {
            "analysis": {
                "tokenizer": {
                    "edge_ngram_tokenizer": {
                        "type": "edge_ngram",
                        "min_gram": 2,
                        "max_gram": 20,
                        "token_chars": ["letter", "digit"]
                    }
                },
                "analyzer": {
                    "edge_ngram_analyzer": {
                        "type": "custom",
                        "tokenizer": "edge_ngram_tokenizer",
                        "filter": ["lowercase"]
                    },
                    "search_analyzer": {
                        "type": "standard"
                    }
                }
            }
      },
      "mappings": {
            "properties": {
                "title": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer"
                },
                "category": {
                    "type": "text",
                    "analyzer": "standard"
                },
                "content": {
                    "type": "text",
                    "analyzer": "edge_ngram_analyzer",
                    "search_analyzer": "search_analyzer"
                }
            }
        }
    }
    client.indices.create(index='notebooks', body=mapping)
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
                'url': f'/pages/{p.id}/'
            }
            result = client.index(index='notebooks', id=p.id, body=document)
            log.info(f"ingested document '{p.title}' ({result['_id']})")
    log.info(f'ingested {pagecount} pages into elasticsearch')
