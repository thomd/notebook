# Notebook Frontend

Notebook frontend build with [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com).

The app is served using a [nginx](https://nginx.org) webserver.

## Development

    ./develop
    open http://localhost:3000

## Styling

Styling of the notebook application is done using Tailwind in `tailwind.css`. Styling of the 'page' itself, i.e. everything related to the mardown source files,
is located on `markdown.scss`.

    npx tailwindcss -i ./src/tailwind.css -o ./src/notebook.css --watch
    npx sass src/markdown.scss src/markdown.css --no-source-map --watch
