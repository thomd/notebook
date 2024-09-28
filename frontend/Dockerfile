FROM node:lts-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REMOTE_PAGES_REPO_URL
ENV REACT_APP_REMOTE_PAGES_REPO_URL=$REMOTE_PAGES_REPO_URL
RUN npm run build

FROM nginx:latest as prod
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80/tcp
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
