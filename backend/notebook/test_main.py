from fastapi.testclient import TestClient
from pathlib import Path
import os
import json
import frontmatter
import pytest
from .main import app

client = TestClient(app)

@pytest.fixture(scope="session")
def setup_pages_dir(tmp_path_factory):
    os.environ["PAGES_DIR"] = str(tmp_path_factory.mktemp("pages"))

def test_get_zero_pages(setup_pages_dir):
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json() == {'pages': [], 'total': 0}

def test_create_new_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    assert response.status_code == 201
    assert response.json() == {'content': '# Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}
    with open(f'{os.environ.get("PAGES_DIR")}/foo.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Foo'
    assert metadata['title'] == 'Foo'
    assert 'category' not in metadata
    assert 'favorite' not in metadata

def test_delete_existing_page(setup_pages_dir):
    client.post('/pages', content=json.dumps({"title": "Bar", "content": "# Bar"}))
    response = client.delete('/pages/bar')
    assert response.status_code == 204

def test_delete_non_existing_page(setup_pages_dir):
    response = client.delete('/pages/non-exist')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_create_existing_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    assert response.status_code == 409
    assert response.json() == {'detail': "Page 'foo' does already exist"}

def test_get_page(setup_pages_dir):
    response = client.get('/pages/foo')
    assert response.status_code == 200
    assert response.json() == {'content': '# Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}

def test_get_non_existing_page(setup_pages_dir):
    response = client.get('/pages/bar')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'bar' does not exist"}

def test_replace_same_existing_page(setup_pages_dir):
    response = client.put('/pages/foo', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}

def test_replace_non_existing_page(setup_pages_dir):
    response = client.put('/pages/bar', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'bar' does not exist"}

def test_replace_to_existing_page(setup_pages_dir):
    client.post('/pages', content=json.dumps({"title": "Baz", "content": "# Baz"}))
    response = client.put('/pages/foo', content=json.dumps({"title": "Baz", "content": "# Baz"}))
    assert response.status_code == 500
    assert response.json() == {'detail': "Page 'baz' does already exist"}

def test_patch_non_existing_page(setup_pages_dir):
    response = client.patch('/pages/non-exist', content=json.dumps({"content": "# Foo Foo"}))
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_patch_page_content(setup_pages_dir):
    response = client.patch('/pages/foo', content=json.dumps({"content": "# Foo Foo"}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Foo Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}

def test_patch_page_category(setup_pages_dir):
    response = client.patch('/pages/foo', content=json.dumps({"category": "Test"}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'content': '# Foo Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}
    with open(f'{os.environ.get("PAGES_DIR")}/foo.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Foo Foo'
    assert metadata['title'] == 'Foo'
    assert metadata['category'] == 'Test'
    assert 'favorite' not in metadata

def test_patch_page_favorite(setup_pages_dir):
    response = client.patch('/pages/foo', content=json.dumps({"favorite": True}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'content': '# Foo Foo', 'favorite': True, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}
    with open(f'{os.environ.get("PAGES_DIR")}/foo.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Foo Foo'
    assert metadata['title'] == 'Foo'
    assert metadata['category'] == 'Test'
    assert metadata['favorite'] == True

def test_patch_page_title(setup_pages_dir):
    response = client.patch('/pages/foo', content=json.dumps({"title": "Foo2"}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'content': '# Foo Foo', 'favorite': True, 'filename': 'foo2.md', 'id': 'foo2', 'title': 'Foo2'}
    response = client.get('/pages/foo')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'foo' does not exist"}

def test_patch_existing_page_title(setup_pages_dir):
    client.post('/pages', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    response = client.patch('/pages/foo2', content=json.dumps({"title": "Foo"}))
    assert response.status_code == 500
    assert response.json() == {'detail': "Page 'foo' does already exist"}

def test_get_multiple_pages(setup_pages_dir):
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json()['total'] == 3

