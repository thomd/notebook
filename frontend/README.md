# Notebook Frontend

Notebook frontend build with React and Tailwind CSS.

The app is served using a nginx webserver.

## Development

    npm start
    npx tailwindcss -i ./src/tailwind.css -o ./src/notebook.css --watch
    npx sass src/markdown.scss src/markdown.css --no-source-map --watch
    open http://localhost:3000
