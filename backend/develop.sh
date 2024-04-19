#!/usr/bin/env bash

source .venv/bin/activate

export REMOTE_PAGES_REPO="$HOME/.gitrepos/wiki-pages.git"
export LOCAL_PAGES_REPO=".pages"
export PAGES_DIR=".pages"

uvicorn main:app --reload
