SHELL = /bin/bash
include .env.dev
export

backend: clean build git index
	@docker run -d -t --rm --name dev-backend -v $(REMOTE_PAGES_REPO):/$(REMOTE_PAGES_REPO) -v $(LOCAL_PAGES_REPO):$(LOCAL_PAGES_REPO) -p 8000:8000 --env-file .env.dev notebook-backend
	@docker logs -f dev-backend

clean:
	@if [ -d $(LOCAL_PAGES_REPO) ]; then mv -v $(LOCAL_PAGES_REPO) $$(mktemp -d); fi
	@if [ $$(docker inspect -f '{{.State.Status}}' dev-backend 2> /dev/null) ]; then docker stop dev-backend; fi
	@if [ $$(docker inspect -f '{{.State.Status}}' dev-es 2> /dev/null) ]; then docker stop dev-es; fi

git: build
	@if [ -d $(REMOTE_PAGES_REPO) ]; \
	then \
	docker run -t --rm -v $(REMOTE_PAGES_REPO):$(REMOTE_PAGES_REPO) -v $(LOCAL_PAGES_REPO):$(LOCAL_PAGES_REPO) --env-file .env.dev notebook-backend python -m init.clone_git; \
	else \
		docker run -t --rm --env-file .env.dev notebook-backend python -m init.clone_git; \
	fi

elasticsearch:
	@docker run -d --rm --name dev-es -p 9200:9200 \
		-e "discovery.type=single-node" \
		-e "xpack.security.enabled=false" \
		-e "http.cors.enabled=true" \
		-e 'http.cors.allow-origin="http://localhost:3000"' \
		-e 'http.cors.allow-headers="X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization,x-elastic-client-meta"' \
		-e "http.cors.allow-credentials=true" \
		elasticsearch:8.9.0
	@until $$(curl -s http://localhost:9200 >/dev/null); do echo "Waiting for Elasticsearch..."; sleep 1; done

index: build elasticsearch
	@docker run -t --rm --network="host" -v $(LOCAL_PAGES_REPO):/$(LOCAL_PAGES_REPO) --env-file .env.dev notebook-backend python -m init.index_elasticsearch

test: build
	@docker run -t --rm -v $(PWD):/code notebook-backend pytest -vv

build:
	@[ -z "$$(docker images -q notebook-backend:latest)" ] && docker compose build || echo "'notebook-backend:latest' does already exist"

.PHONY: backend clean git elasticsearch index test build
