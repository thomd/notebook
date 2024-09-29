# Notebook Backend

## Routes

    open http://localhost:8000/docs
    open http://localhost:8000/redoc

## Development

Either edit `.env.dev` file and start FastAPI & ElasticSearch backend with

    make backend
    ...
    make clean

or 

    . .venv/bin/activate
    python -m init.clone_git
    make index
    uvicorn notebook.main:app --host 0.0.0.0 --port 8000 --reload

## Test

Either start `uvicorn` server in background or separate terminal (see above) and run

    source .venv/bin/activate
    nodemon -w notebook -e py -x pytest -vv

or run

    make test

