FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REMOTE_PAGES_REPO_URL
ENV REACT_APP_REMOTE_PAGES_REPO_URL=$REMOTE_PAGES_REPO_URL
ARG NOTEBOOK_MODE
ENV REACT_APP_NOTEBOOK_MODE=$NOTEBOOK_MODE
RUN npm run build

FROM nginx:latest AS prod
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY notebook.pem /etc/ssl/private
COPY notebook-key.pem /etc/ssl/private
EXPOSE 80/tcp
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
