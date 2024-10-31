<img src="https://github.com/thomd/notebook/raw/main/frontend/public/favicon.svg" width="60">

# Notebook

**Notebook** is a simple, minimalistic **wiki-like** web application to manage the sheer amount of my personal notes (mainly IT-development, math and science stuff) as **markdown files** and store them in a private **git repository**.

![screenshot of notebook](https://raw.githubusercontent.com/thomd/notebook/refs/heads/images/index-page.png?token=GHSAT0AAAAAACWOXRWWKFAGRPJ4U2OYPN2EZZD2TWA)

**Notebook** was created with the intention of **running it locally** (to avoid hosting and user management). Markdown files are stored in a git repository ("_git as database_") which allows to read and edit them in Github.

**Notebook** is implemented as a [React](https://react.dev) frontend for rendering and editing the markdown pages.
Pages are managed with a **Python** service which provides a REST API via [FastAPI](https://fastapi.tiangolo.com) to read/write pages and commit/push pages to Github.
All pages are indexed and searchable via an [ElasticSearch](https://www.elastic.co) service.

**Notebook** focuses on some special features to meet my needs:

* Isolated editing of page headline sections (similar to Wikipedia) for ease of editing.
* Extended markdown syntax: text highligting, tables, margin notes, mathematical expressions (via LaTeX) or internal page links.
* Simple categorisation of pages on an overview page.
* Page navigation reflecting the headline hierarchy.
* Search within all pages.
* Mark highly used pages as favorites.
* Page interaction via keyboard.

**Notebook** renders markdown pages leveraging the superb [remark](https://github.com/remarkjs) and [rehype](https://github.com/rehypejs) ecosystem.

Part of the **Notebook** implementation is a set of special **plugins** like [remark-heading-lines](https://github.com/thomd/remark-heading-lines), [remark-wiki-link](https://github.com/thomd/remark-wiki-link), [rehype-textmarker](https://github.com/thomd/rehype-textmarker), [rehype-navigation](https://github.com/thomd/rehype-navigation) and [rehype-block](https://github.com/thomd/rehype-block).

## Setup

1. Create a git repository for your markdown pages like for example [notebook-example-pages](https://github.com/thomd/notebook-example-pages).

2. If the repository is a private git repository on Github, then upload a public key to Github using [gh-cli](https://cli.github.com/) (do not enter a passphrase for the key):

        ssh-keygen -f ~/.ssh/notebook
        gh ssh-key add ~/.ssh/notebook.pub -t notebook

3. Add a record `127.0.0.1 notebook` into your local hosts file and flush DNS cache:

        sudo vim /etc/hosts
        sudo dscacheutil -flushcache

4. Install locally-trusted SSL certificate using [mkcert](https://github.com/FiloSottile/mkcert):

        mkcert -install
        (cd frontend; mkcert notebook)

5. Configure environment:

        cp .env.example .env
        vim .env

6. Build application

        docker compose build

7. Start the application with

        docker compose up -d
        docker compose ps
        open https://notebook

## Development

Follow development instructions in [backend](./backend/README.md) and [frontend](./frontend/README.md).
