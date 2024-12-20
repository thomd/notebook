# Notebook Backend

## Development

Edit `.env.dev` file.

Then either start FastAPI & ElasticSearch backend with

    make backend

or with

    pyenv install 3.9.20
    ./develop

## Test

Run

    python -m venv .venv
    source .venv/bin/activate
    make elasticsearch
    nodemon -w notebook -e py -x pytest -vv
