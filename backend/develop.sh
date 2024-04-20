#!/usr/bin/env bash

source .venv/bin/activate
pip install -r requirements.txt
pip install --upgrade pip

export REMOTE_PAGES_REPO="$HOME/.gitrepos/wiki-pages.git"
export LOCAL_PAGES_REPO=".pages"
export PAGES_DIR=".pages"

uvicorn main:app --reload
