from git import Repo
from notebook import log
import os

LOCAL_PAGES_REPO = os.getenv('LOCAL_PAGES_REPO')

def changes(repo):
    for file in repo.untracked_files:
        repo.index.add(file)
    return [tuple([elem for elem in status.split(' ') if elem != '']) for status in repo.git.status(short=True).split('\n') if status != '']

def commit(push=True):
    repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
    message = []
    for (flag, file) in changes(repo):
        if flag == 'M':
            message.append(f'changed {file}')
        if flag == 'A':
            message.append(f'added {file}')
        if flag == 'D':
            message.append(f'deleted {file}')
        repo.git.add(file)
    repo.index.commit(' and '.join(message))
    if push == True:
        origin = repo.remote(name='origin')
        origin.push()

# def add(filename):
    # repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
    # if filename in repo.untracked_files:
        # repo.index.add(filename)
        # repo.index.commit(f'add {filename}')
        # origin = repo.remote(name='origin')
        # origin.push()

# def delete(filename):
    # repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
    # repo.git.add(filename)
    # repo.index.commit(f'delete {filename}')
    # origin = repo.remote(name='origin')
    # origin.push()

# def patch():
    # repo = Repo(LOCAL_PAGES_REPO, search_parent_directories=True)
    # # is there a file to delete?
    # repo.git.add(filename)
    # # is there a file with changes?
    # repo.git.add(new_filename)
    # repo.index.commit(f'patched {filename} to {new_filename}')
    # origin = repo.remote(name='origin')
    # origin.push()

