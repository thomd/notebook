# <img src="https://github.com/thomd/notebook/raw/main/frontend/public/favicon.svg" width="50"> Notebook

A simple **wiki-like** application to manage my personal notes (mainly it-development and science stuff) as **markdown files** in a **Git repository**.

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
