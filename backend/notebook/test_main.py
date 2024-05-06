from fastapi.testclient import TestClient
from pathlib import Path
import os
import json
import pytest
from .main import app

client = TestClient(app)

@pytest.fixture(scope="session")
def setup_pages_dir(tmp_path_factory):
    os.environ["PAGES_DIR"] = str(tmp_path_factory.mktemp("pages"))

def test_get_pages(setup_pages_dir):
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json() == {'pages': [], 'total': 0}

def test_create_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    assert response.status_code == 201
    assert response.json() == {'content': '# Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}
