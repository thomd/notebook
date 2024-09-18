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
    uvicorn notebook.main:app --reload

or run

    ./develop

## Test

Start `uvicorn` server in background or separate terminal (see above) and run

    source .venv/bin/activate
    nodemon -w notebook -e py -x pytest -vv

## Routes

    open http://localhost:8000/docs
    open http://localhost:8000/redoc
