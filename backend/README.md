# Notebook Backend

## Development

    python -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    pip install ipython

    export REMOTE_PAGES_REPO="$HOME/.gitrepos/wiki-pages.git"
    export LOCAL_PAGES_REPO=".pages"
    export PAGES_DIR=".pages"
    uvicorn app.main:app --reload

## Routes

    curl -s localhost:8000/pages | jq
