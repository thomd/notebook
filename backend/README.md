# Notebook Backend

## Routes

    open http://localhost:8000/docs
    open http://localhost:8000/redoc

## Development

1. Edit `.env.dev` file 

2. Then either start FastAPI & ElasticSearch backend with

        make backend
        ...
        make clean

    or with

        source .venv/bin/activate
        while read e; do export "$e"; done < <(grep -v '^#' .env.dev | sed /^$/d)
        python -m init.clone_git
        make elasticsearch
        python -m init.index_elasticsearch
        uvicorn notebook.main:app --host 0.0.0.0 --port 8000 --reload

## Test

Either start `uvicorn` server in background or separate terminal (see above) and run

    source .venv/bin/activate
    nodemon -w notebook -e py -x pytest -vv

or run

    make test

