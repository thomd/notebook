<img src="https://github.com/thomd/notebook/raw/main/frontend/public/favicon.svg" width="50">

# Notebook

A simple **wiki-like** application to manage my personal notes (mainly it-development and science stuff) as **markdown files** and store them in a private **git repository**.

**Notebook** has a reduced and simple feature set for ease of use and was created with the intention of running it locally. This avoids hosting costs and security features like user authentication.

**Notebook** is implemented as a **[React](https://react.dev)** frontend for rendering and editing the markdown pages.
Below is a **Python** backend served by **Nginx** which provides a REST API via **[FastAPI](https://fastapi.tiangolo.com)** to read/write pages and commit/push to Github.
All pages are indexed and searchable via an **[ElasticSearch](https://www.elastic.co)** service.

Pages are stored in a local and remote Github git repository ("_git as database_") which allows to also read and edit them within Github.

Special features are:

* Isolated editing of page headline sections (similar to Wikipedia) for ease of editing.
* Extended markdown syntax to fit my personal needs: text highligting, tables, margin notes, LaTeX, internal page links (see [notebook-example-pages](https://github.com/thomd/notebook-rexample-pages)).
* Simple categorisation of pages on an overview page (stored as page frontmatter).
* Page navigation reflecting the headline hierarchy.
* Search within all pages.

Notebook renders markdown pages leveraging the superb [remark](https://github.com/remarkjs) and [rehype](https://github.com/rehypejs) ecosystem. 
Part of the Notebook implementation are a set of special plugins like [rehype-textmarker](https://github.com/thomd/rehype-textmarker), [remark-heading-lines](https://github.com/thomd/remark-heading-lines), [remark-wiki-link](https://github.com/thomd/remark-wiki-link), [rehype-navigation](https://github.com/thomd/rehype-navigation) and [rehype-block](https://github.com/thomd/rehype-block).

This application was developed and tested on **MacOS** only.

## Setup

1. Create a git repository for notebook pages like for example [notebook-example-pages](https://github.com/thomd/notebook-rexample-pages).

1. If the pages repository is a private git repository on Github, then upload a public key to [SSH keys](https://github.com/settings/keys) 
on Github (do not enter a passphrase for the key):

        cd ~/.ssh
        ssh-keygen -f notebook
        cat notebook.pub | pbcopy

1. Add a record `127.0.0.1 notebook` into your local hosts file and flush DNS cache:

        sudo vim /etc/hosts
        sudo dscacheutil -flushcache

1. Install locally-trusted SSL certificate:

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
