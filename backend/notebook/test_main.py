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

def test_create_none_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({}))
    assert response.status_code == 422

def test_create_new_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 1"}))
    assert response.status_code == 201
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test-1.md', 'id': 'test-1', 'title': 'Test 1'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-1.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test 1'
    assert 'category' not in metadata
    assert 'favorite' not in metadata

def test_create_new_page_with_content(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 2", "content": "# Test 2"}))
    assert response.status_code == 201
    assert response.json() == {'content': '# Test 2', 'favorite': False, 'filename': 'test-2.md', 'id': 'test-2', 'title': 'Test 2'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-2.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test 2'
    assert metadata['title'] == 'Test 2'
    assert 'category' not in metadata
    assert 'favorite' not in metadata

def test_create_new_page_with_category(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 3", "content": "# Test 3", "category": "Test"}))
    assert response.status_code == 201
    assert response.json() == {'category': 'Test', 'content': '# Test 3', 'favorite': False, 'filename': 'test-3.md', 'id': 'test-3', 'title': 'Test 3'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-3.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test 3'
    assert metadata['title'] == 'Test 3'
    assert metadata['category'] == 'Test'
    assert 'favorite' not in metadata

def test_create_new_page_with_favorite(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 4", "content": "# Test 4", "category": "Test", "favorite": True}))
    assert response.status_code == 201
    assert response.json() == {'category': 'Test', 'content': '# Test 4', 'favorite': True, 'filename': 'test-4.md', 'id': 'test-4', 'title': 'Test 4'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-4.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test 4'
    assert metadata['title'] == 'Test 4'
    assert metadata['category'] == 'Test'
    assert metadata['favorite'] == True

def test_delete_existing_page(setup_pages_dir):
    client.post('/pages', content=json.dumps({"title": "Test 5"}))
    response = client.delete('/pages/test-5')
    assert response.status_code == 204

def test_delete_non_existing_page(setup_pages_dir):
    response = client.delete('/pages/non-exist')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_create_existing_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 1"}))
    assert response.status_code == 409
    assert response.json() == {'detail': "Page 'test-1' does already exist"}

def test_get_page(setup_pages_dir):
    response = client.get('/pages/test-1')
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test-1.md', 'id': 'test-1', 'title': 'Test 1'}
    response = client.get('/pages/test-2')
    assert response.status_code == 200
    assert response.json() == {'content': '# Test 2', 'favorite': False, 'filename': 'test-2.md', 'id': 'test-2', 'title': 'Test 2'}
    response = client.get('/pages/test-3')
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'content': '# Test 3', 'favorite': False, 'filename': 'test-3.md', 'id': 'test-3', 'title': 'Test 3'}
    response = client.get('/pages/test-4')
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'content': '# Test 4', 'favorite': True, 'filename': 'test-4.md', 'id': 'test-4', 'title': 'Test 4'}

def test_get_non_existing_page(setup_pages_dir):
    response = client.get('/pages/non-exist')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

# def test_replace_same_existing_page(setup_pages_dir):
    # response = client.put('/pages/foo', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    # assert response.status_code == 200
    # assert response.json() == {'content': '# Foo', 'favorite': False, 'filename': 'foo.md', 'id': 'foo', 'title': 'Foo'}

# def test_replace_non_existing_page(setup_pages_dir):
    # response = client.put('/pages/bar', content=json.dumps({"title": "Foo", "content": "# Foo"}))
    # assert response.status_code == 404
    # assert response.json() == {'detail': "Page 'bar' does not exist"}

# def test_replace_to_existing_page(setup_pages_dir):
    # client.post('/pages', content=json.dumps({"title": "Baz", "content": "# Baz"}))
    # response = client.put('/pages/foo', content=json.dumps({"title": "Baz", "content": "# Baz"}))
    # assert response.status_code == 500
    # assert response.json() == {'detail': "Page 'baz' does already exist"}

def test_patch_non_existing_page(setup_pages_dir):
    response = client.patch('/pages/non-exist', content=json.dumps({"title": "Non Exist"}))
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_patch_page_title(setup_pages_dir):
    client.post('/pages', content=json.dumps({"title": "Test 6"}))
    response = client.patch('/pages/test-6', content=json.dumps({"title": "Test 7"}))
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test-7.md', 'id': 'test-7', 'title': 'Test 7'}
    response = client.get('/pages/test-6')
    assert response.status_code == 404
    with open(f'{os.environ.get("PAGES_DIR")}/test-7.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test 7'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    client.delete('/pages/test-7')

def test_patch_page_content(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 8"}))
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test-8.md', 'id': 'test-8', 'title': 'Test 8'}
    response = client.patch('/pages/test-8', content=json.dumps({"content": "# Test 8"}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Test 8', 'favorite': False, 'filename': 'test-8.md', 'id': 'test-8', 'title': 'Test 8'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-8.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test 8'
    assert metadata['title'] == 'Test 8'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    client.delete('/pages/test-8')

def test_patch_page_category(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 9"}))
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test-9.md', 'id': 'test-9', 'title': 'Test 9'}
    response = client.patch('/pages/test-9', content=json.dumps({"category": "Test"}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'content': '', 'favorite': False, 'filename': 'test-9.md', 'id': 'test-9', 'title': 'Test 9'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-9.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test 9'
    assert metadata['category'] == 'Test'
    assert 'favorite' not in metadata
    client.delete('/pages/test-9')

def test_patch_page_favorite(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test 10"}))
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test-10.md', 'id': 'test-10', 'title': 'Test 10'}
    response = client.patch('/pages/test-10', content=json.dumps({"favorite": True}))
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': True, 'filename': 'test-10.md', 'id': 'test-10', 'title': 'Test 10'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-10.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test 10'
    assert 'category' not in metadata
    assert metadata['favorite'] == True
    client.delete('/pages/test-10')

def test_get_multiple_pages(setup_pages_dir):
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json()['total'] == 4

