from git import Repo
from notebook import log
from pathlib import Path
from elasticsearch import Elasticsearch
from notebook import page as pg
import os

#
# init git
#
REMOTE_PAGES_REPO = os.environ.get('REMOTE_PAGES_REPO')
LOCAL_PAGES_REPO = os.environ.get('LOCAL_PAGES_REPO')

if REMOTE_PAGES_REPO and LOCAL_PAGES_REPO:
    try:
        repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
        repo.remotes.origin.pull()
        log.info(f"git pull into '{LOCAL_PAGES_REPO}'")
    except:
        repo = Repo.clone_from(REMOTE_PAGES_REPO, LOCAL_PAGES_REPO)
        log.info(f"cloning '{REMOTE_PAGES_REPO}' to '{LOCAL_PAGES_REPO}'")
    finally:
        repo.config_writer().set_value("user", "name", "Thomas Dürr").release()
        repo.config_writer().set_value("user", "email", "thomduerr@gmail.com").release()
        log.info(f'git status: {repo.git.status()}')
else:
    log.error('Environment not set')

#
# init elasticsearch
#
es = Elasticsearch('http://localhost:9200')
INDEX_NAME = 'notebooks'
if not es.indices.exists(index=INDEX_NAME):
    es.indices.create(index=INDEX_NAME, body={})
    log.info(f"created ealsticesearch index '{INDEX_NAME}'")
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
            result = es.index(index=INDEX_NAME, body=document)
            log.info(f"ingested document '{page.title}' ({result['_id']})")
    log.info(f'ingested {pagecount} pages into elasticsearch')
