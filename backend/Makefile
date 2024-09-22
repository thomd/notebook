SHELL = /opt/homebrew/bin/bash
include .env
export

start: build git index
	@docker run -d -t --rm --name dev-backend -v $(PWD):/code -p 8000:8000 --env-file .env notebook-backend
	@docker logs -f dev-backend

stop:
	@docker stop dev-backend
	@docker stop dev-es

git: build
	@docker run -t --rm -v $(PWD):/code -v $(REMOTE_PAGES_REPO):$(REMOTE_PAGES_REPO) --env-file .env notebook-backend python -m init.clone_git

elasticsearch:
	@if $$(docker inspect -f '{{.State.Status}}' dev-es 2> /dev/null | grep -q "running"); then docker stop dev-es; fi
	@docker run -d --rm --name dev-es -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.9.0
	@until $$(curl -s http://localhost:9200 >/dev/null); do echo "Waiting for Elasticsearch..."; sleep 5; done

index: build elasticsearch
	@docker run -t --rm --network="host" -v $(PWD):/code --env-file .env notebook-backend python -m init.index_elasticsearch

test: build
	@docker run -t --rm -v $(PWD):/code notebook-backend pytest -vv

build:
	@if ! docker inspect notebook-backend:latest >/dev/null 2>&1; then (cd ..; docker compose build); fi

.PHONY: start stop git elasticsearch index test build
