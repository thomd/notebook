# Notebook

## Setup
    
In order to access a ptivate git repository on Github, upload the following public key to [SSH keys](https://github.com/settings/keys) on Github.

Do not enter a passphrase for the key.

    cd ~/.ssh
    ssh-keygen -f notebook
    cat notebook.pub | pbcopy

Start application with

    docker compose up -d

The [notebook-pages](https://github.com/thomd/notebook-pages) repository containing all the markdown pages will be cloned into the docker volume
`~/.notebook/notebook-pages`.

## Development

    docker compose build
    docker compose down
    docker compose up -d
