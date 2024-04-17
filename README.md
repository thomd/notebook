# Notebook

A simple Wiki-like application to manage my personal notes (mainly it-development and science stuff) as Markdown files.

## Setup

Accessing the private git repository on Github containing the [notebook-pages](https://github.com/thomd/notebook-pages), upload a public key to [SSH
keys](https://github.com/settings/keys) on Github (do not enter a passphrase for the key):

    cd ~/.ssh
    ssh-keygen -f notebook
    cat notebook.pub | pbcopy

Start the application with

    docker compose up -d

The [notebook-pages](https://github.com/thomd/notebook-pages) repository containing all the markdown pages will be cloned into the docker volume
`~/.notebook/notebook-pages`.

## Development

    docker compose build
    docker compose up -d
    docker compose ps
    docker compose down
