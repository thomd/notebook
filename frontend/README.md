# Notebook Frontend

Notebook frontend build with [React](https://react.dev) and [Tailwind CSS](https://tailwindcss.com).

The app is served using a [Nginx](https://nginx.org) webserver.

## Development

    npm install
    ./develop
    open http://localhost:3000

## Styling

Styling of the notebook application is done using Tailwind in `tailwind.css`. Styling of the mardown source files is located in `markdown.scss`.

    npx tailwindcss -i ./src/tailwind.css -o ./src/notebook.css --watch
    npx sass src/markdown.scss src/markdown.css --no-source-map --watch
