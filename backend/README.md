# Notebook Backend

## Routes

    open http://localhost:8000/docs
    open http://localhost:8000/redoc

## Development

1. Edit `.env` file

2. Either run the following commands

        python -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
        pip install ipython

        export REMOTE_PAGES_REPO="$HOME/.gitrepos/wiki-pages.git"
        export LOCAL_PAGES_REPO=".pages"
        export PAGES_DIR=".pages"
        uvicorn notebook.main:app --reload

    or run

        make start
        make stop

## Test

Either start `uvicorn` server in background or separate terminal (see above) and run

    source .venv/bin/activate
    nodemon -w notebook -e py -x pytest -vv

or run

    make test

