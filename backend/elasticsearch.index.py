#!/usr/bin/env python

from notebook import log
from pathlib import Path
from elasticsearch import Elasticsearch
from notebook import page as pg

es = Elasticsearch('http://localhost:9200')

if not es.indices.exists(index='notebooks'):
    es.indices.create(index='notebooks', body={})
    log.info(f"created ealsticesearch index 'notebooks'")
    path = Path(pg.pagesDir())
    pagecount = 0
    for page in path.iterdir():
        if page.is_file():
            page = pg.getPage(page)
            pagecount += 1
            document = {
                "title": page.title,
                "category": page.category,
                "content": page.content
            }
            result = es.index(index='notebooks', body=document)
            log.info(f"ingested document '{page.title}' ({result['_id']})")
    log.info(f'ingested {pagecount} pages into elasticsearch')
