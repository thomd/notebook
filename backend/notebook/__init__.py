from git import Repo
import os
import logging

REMOTE_PAGES_REPO = os.getenv("REMOTE_PAGES_REPO")
LOCAL_PAGES_REPO = os.getenv("LOCAL_PAGES_REPO")

logging.basicConfig(level=logging.INFO, format="[API]: %(message)s")

try:
    repo = Repo(LOCAL_PAGES_REPO)
    repo.remotes.origin.pull()
    logging.info(f"git pull into '{LOCAL_PAGES_REPO}'")
except:
    repo = Repo.clone_from(REMOTE_PAGES_REPO, LOCAL_PAGES_REPO)
    logging.info(f"cloning '{REMOTE_PAGES_REPO}' to '{LOCAL_PAGES_REPO}'")

logging.info(f"git status: {repo.git.status()}")

