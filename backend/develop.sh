#!/usr/bin/env bash

if test -d .venv; then
  source .venv/bin/activate
else
  python -m venv .venv
  source .venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
fi

export REMOTE_PAGES_REPO="$HOME/.gitrepos/wiki-pages.git"
export LOCAL_PAGES_REPO=".pages"
export PAGES_DIR=".pages"

uvicorn notebook.main:app --reload
