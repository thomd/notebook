# Notebook Backend

## Development

Either run the following commands

    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    pip install ipython

    export REMOTE_PAGES_REPO="$HOME/.gitrepos/wiki-pages.git"
    export LOCAL_PAGES_REPO=".pages"
    export PAGES_DIR=".pages"
    uvicorn main:app --reload

or run

    ./develop.sh

## Routes

    open http://localhost:8000/docs
    open http://localhost:8000/redoc
