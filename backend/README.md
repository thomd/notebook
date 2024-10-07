# Notebook Backend

## Development

Edit `.env.dev` file.

Then either start FastAPI & ElasticSearch backend with

    make backend

or with

    ./develop

## Test

Either start `uvicorn` server in background or separate terminal (see above) and run

    source .venv/bin/activate
    nodemon -w notebook -e py -x pytest -vv

or run

    make test

