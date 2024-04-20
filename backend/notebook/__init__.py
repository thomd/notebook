from git import Repo
from notebook import log
import os

REMOTE_PAGES_REPO = os.getenv('REMOTE_PAGES_REPO')
LOCAL_PAGES_REPO = os.getenv('LOCAL_PAGES_REPO')

try:
    repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
    repo.remotes.origin.pull()
    log.info(f"git pull into '{LOCAL_PAGES_REPO}'")
except:
    repo = Repo.clone_from(REMOTE_PAGES_REPO, LOCAL_PAGES_REPO)
    log.info(f"cloning '{REMOTE_PAGES_REPO}' to '{LOCAL_PAGES_REPO}'")

log.info(f'git status: {repo.git.status()}')

