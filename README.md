# Notebook

## Setup
    
In order to access a ptivate git repository on Github, upload the following public key to [SSH keys](https://github.com/settings/keys) on Github.

Do not enter a passphrase for the key.

    cd ~/.ssh
    ssh-keygen -f notebook
    cat notebook.pub | pbcopy

Start application with

    docker compose up -d

## Development

    docker compose build
    docker compose down
    docker compose up -d
