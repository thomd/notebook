from git import Repo
from pathlib import Path
from notebook import page as pg
from notebook import log
import os

REMOTE_PAGES_REPO = os.environ.get('REMOTE_PAGES_REPO')
REMOTE_REPO_USERNAME = os.environ.get('REMOTE_REPO_USERNAME')
REMOTE_REPO_EMAIL = os.environ.get('REMOTE_REPO_EMAIL')
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
        repo.config_writer().set_value("user", "name", REMOTE_REPO_USERNAME).release()
        repo.config_writer().set_value("user", "email", REMOTE_REPO_EMAIL).release()
        log.info(f'git status: {repo.git.status()}')
else:
    log.error('Environment not set')
