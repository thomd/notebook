# Notebook

A simple **wiki-like** application to manage my personal notes (mainly it-development and science stuff) as **markdown files**.

> [!IMPORTANT]
> This application was developed and tested on **MacOS** only.

## Setup

1. Accessing the private git repository on Github containing the [notebook-pages](https://github.com/thomd/notebook-pages), upload a public key to [SSH
keys](https://github.com/settings/keys) on Github (do not enter a passphrase for the key):

        cd ~/.ssh
        ssh-keygen -f notebook
        cat notebook.pub | pbcopy

2. Add a record `127.0.0.1 notebook` into your local hosts file and flush DNS cache:

        sudo vim /etc/hosts
        sudo dscacheutil -flushcache

3. Build application

    Configure environment in `.env` file.

    Then run

        docker compose build

4. Start the application with

        docker compose up -d
        docker compose ps
        open http://notebook

5. Stop the application with

        docker compose down

The repository containing all the notebook pages as markdown files will be cloned into the docker volume `~/.notebook/notebook-pages`.

## Development

Follow development instructions in [backend](./backend/README.md) and [frontend](./frontend/README.md).
