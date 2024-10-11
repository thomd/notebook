<img src="https://github.com/thomd/notebook/raw/main/frontend/public/favicon.svg" width="60">

# Notebook

**Notebook** is a simple, minimalistic **wiki-like** web application to manage the sheer amount of my personal notes (mainly it-development, math and science stuff) as **markdown files** and store them in a private **git repository**.

**Notebook** has a reduced and simple user interface for ease of use. **Notebook** was created with the intention of **running it locally**. This avoids hosting costs and the need of security features like user authentication.

**Notebook** is implemented as a [React](https://react.dev) frontend for rendering and editing the markdown pages.
Pages are managed with a **Python** backend service which provides a REST API via [FastAPI](https://fastapi.tiangolo.com) to read/write pages and commit/push pages to Github.
All pages are indexed and searchable via an [ElasticSearch](https://www.elastic.co) service.

Markdown files are stored in a flat git repository ("_git as database_") which allows to also read and edit them within Github.

**Notebook** focuses on some special features:

* Isolated editing of page headline sections (similar to Wikipedia) for ease of editing.
* Extended markdown syntax to fit my personal needs: text highligting, tables, margin notes, LaTeX or internal page links.
* Simple categorisation of pages on an overview page.
* Page navigation reflecting the headline hierarchy.
* Search within all pages.
* Page interaction via keyboard.

**Notebook** renders markdown pages leveraging the superb [remark](https://github.com/remarkjs) and [rehype](https://github.com/rehypejs) ecosystem.

Part of the **Notebook** implementation is a set of special **plugins** like [remark-heading-lines](https://github.com/thomd/remark-heading-lines), [remark-wiki-link](https://github.com/thomd/remark-wiki-link), [rehype-textmarker](https://github.com/thomd/rehype-textmarker), [rehype-navigation](https://github.com/thomd/rehype-navigation) and [rehype-block](https://github.com/thomd/rehype-block).

## Setup

1. Create a git repository for your markdown pages like for example [notebook-example-pages](https://github.com/thomd/notebook-rexample-pages).

1. If the repository is a private git repository on Github, then upload a public key to [SSH keys](https://github.com/settings/keys) 
on Github (do not enter a passphrase for the key):

        cd ~/.ssh
        ssh-keygen -f notebook
        cat notebook.pub | pbcopy

1. Add a record `127.0.0.1 notebook` into your local hosts file and flush DNS cache:

        sudo vim /etc/hosts
        sudo dscacheutil -flushcache

1. Install locally-trusted SSL certificate (although this is not really necessary for a local application):

        mkcert -install
        (cd frontend; mkcert notebook)

1. Configure environment:

        cp .env.example .env
        vim .env

1. Build application

        docker compose build

1. Start the application with

        docker compose up -d
        docker compose ps
        open https://notebook

1. Stop the application with

        docker compose down

## Development

Follow development instructions in [backend](./backend/README.md) and [frontend](./frontend/README.md).
