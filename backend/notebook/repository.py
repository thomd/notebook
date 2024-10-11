from git import Repo
from notebook import log
import os

LOCAL_PAGES_REPO = os.environ.get('LOCAL_PAGES_REPO')

def getChanges(repo):
    for file in repo.untracked_files:
        repo.index.add(file)
    return [tuple([elem for elem in status.split(' ') if elem != '']) for status in repo.git.status(short=True).split('\n') if status != '']

def push():
    if LOCAL_PAGES_REPO:
        repo = Repo(LOCAL_PAGES_REPO)
        try:
            origin = repo.remote(name='origin')
            origin.push()
        except Exception as e:
            log.info(f'ERROR on git push: {str(e)}')

def commit():
    if LOCAL_PAGES_REPO:
        repo = Repo(LOCAL_PAGES_REPO)
        changes = getChanges(repo)
        if len(changes) > 0:
            message = []
            for (flag, file) in changes:
                if flag == 'M':
                    message.append(f'updated {file}')
                if flag == 'A':
                    message.append(f'added {file}')
                if flag == 'D':
                    message.append(f'deleted {file}')
                repo.git.add(file)
            repo.index.commit(' and '.join(message))
