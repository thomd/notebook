# Notebook Backend

## Development

Edit `.env.dev` file.

Then either start FastAPI & ElasticSearch backend with

    make backend

or with

    source .venv/bin/activate
    while read e; do export "$e"; done < <(grep -v '^#' .env.dev | sed /^$/d)
    python -m init.clone_git
    make elasticsearch
    python -m init.index_elasticsearch
    uvicorn notebook.main:app --host 0.0.0.0 --port 8002 --reload

## Test

Either start `uvicorn` server in background or separate terminal (see above) and run

    source .venv/bin/activate
    nodemon -w notebook -e py -x pytest -vv

or run

    make test

