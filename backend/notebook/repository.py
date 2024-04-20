from git import Repo
from notebook import log
import os

LOCAL_PAGES_REPO = os.getenv('LOCAL_PAGES_REPO')

def push(action, filename):
    repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
    if filename in repo.untracked_files:
        repo.index.add(filename)
        repo.index.commit(f'{action} {filename}')
        origin = repo.remote(name='origin')
        origin.push()

