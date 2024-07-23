from fastapi.testclient import TestClient
from pathlib import Path
import os
import json
import frontmatter
import pytest
from .main import app

client = TestClient(app)

@pytest.fixture(scope='session')
def setup_pages_dir(tmp_path_factory):
    os.environ["PAGES_DIR"] = str(tmp_path_factory.mktemp('pages'))

def test_get_zero_pages(setup_pages_dir):
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json() == {'pages': [], 'total': 0}

def test_get_pages(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test', 'content': '# Test', 'category': 'Test', 'favorite': True}))
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json() == {'pages': [{'category': 'Test', 'cid': 'test', 'favorite': True, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}], 'total': 1}
    client.delete('/pages/test')

def test_get_multiple_pages(setup_pages_dir):
    client.post('/pages', content=json.dumps({"title": "Test 1"}))
    client.post('/pages', content=json.dumps({"title": "Test 2"}))
    response = client.get('/pages')
    assert response.status_code == 200
    assert response.json()['total'] == 2
    client.delete('/pages/test-1')
    client.delete('/pages/test-2')

def test_create_none_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({}))
    assert response.status_code == 422

def test_create_new_page(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test'}))
    assert response.status_code == 201
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    response = client.get('/pages/test')
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    client.delete('/pages/test')

def test_create_new_page_with_content(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test', 'content': '# Test'}))
    assert response.status_code == 201
    assert response.json() == {'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    response = client.get('/pages/test')
    assert response.status_code == 200
    assert response.json() == {'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    client.delete('/pages/test')

def test_create_new_page_with_category(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test', 'content': '# Test', 'category': 'Test'}))
    assert response.status_code == 201
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert metadata['category'] == 'Test'
    assert 'favorite' not in metadata
    response = client.get('/pages/test')
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    client.delete('/pages/test')

def test_create_new_page_with_favorite(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test', 'content': '# Test', 'category': 'Test', 'favorite': True}))
    assert response.status_code == 201
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': True, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert metadata['category'] == 'Test'
    assert metadata['favorite'] == True
    response = client.get('/pages/test')
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': True, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    client.delete('/pages/test')

def test_delete_existing_page(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test'}))
    response = client.delete('/pages/test')
    assert response.status_code == 204

def test_delete_non_existing_page(setup_pages_dir):
    response = client.delete('/pages/non-exist')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_create_existing_page(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test'}))
    response = client.post('/pages', content=json.dumps({'title': 'Test'}))
    assert response.status_code == 409
    assert response.json() == {'detail': "Page 'test' does already exist"}
    client.delete('/pages/test')

def test_get_non_existing_page(setup_pages_dir):
    response = client.get('/pages/non-exist')
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_patch_non_existing_page(setup_pages_dir):
    response = client.patch('/pages/non-exist', content=json.dumps({'title': 'Non Exist'}))
    assert response.status_code == 404
    assert response.json() == {'detail': "Page 'non-exist' does not exist"}

def test_patch_page_title(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test'}))
    response = client.patch('/pages/test', content=json.dumps({"title": "Other Test"}))
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'other-test.md', 'id': 'other-test', 'title': 'Other Test'}
    response = client.get('/pages/test')
    assert response.status_code == 404
    with open(f'{os.environ.get("PAGES_DIR")}/other-test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Other Test'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    client.delete('/pages/other-test')

def test_patch_page_content(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test'}))
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    response = client.patch('/pages/test', content=json.dumps({"content": "# Test"}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    client.delete('/pages/test')

def test_patch_page_category(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({'title': 'Test'}))
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    response = client.patch('/pages/test', content=json.dumps({"category": "Test"}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test'
    assert metadata['category'] == 'Test'
    assert 'favorite' not in metadata
    client.delete('/pages/test')

def test_patch_delete_page_category(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test', 'content': '# Test', 'category': 'Test', 'favorite': True}))
    response = client.patch('/pages/test', content=json.dumps({"category": ""}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    client.delete('/pages/test')

def test_patch_page_favorite(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test"}))
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    response = client.patch('/pages/test', content=json.dumps({"favorite": True}))
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': True, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test'
    assert 'category' not in metadata
    assert metadata['favorite'] == True
    response = client.patch('/pages/test', content=json.dumps({"favorite": False}))
    assert response.status_code == 200
    assert response.json() == {'content': '', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == ''
    assert metadata['title'] == 'Test'
    assert 'category' not in metadata
    assert 'favorite' not in metadata
    client.delete('/pages/test')

def test_patch_page_favorite_with_category(setup_pages_dir):
    response = client.post('/pages', content=json.dumps({"title": "Test", 'content': '# Test', 'category': 'Test'}))
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    response = client.patch('/pages/test', content=json.dumps({"favorite": True}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': True, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert metadata['category'] == 'Test'
    assert metadata['favorite'] == True
    response = client.patch('/pages/test', content=json.dumps({"favorite": False}))
    assert response.status_code == 200
    assert response.json() == {'category': 'Test', 'cid': 'test', 'content': '# Test', 'favorite': False, 'filename': 'test.md', 'id': 'test', 'title': 'Test'}
    with open(f'{os.environ.get("PAGES_DIR")}/test.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test'
    assert metadata['title'] == 'Test'
    assert metadata['category'] == 'Test'
    assert 'favorite' not in metadata
    client.delete('/pages/test')

def test_get_page_fragment(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test Fragment', 'content': '# Test\n\ntext\ntext\n\n## Test\n\n* test\n* test\n* test\n\n## Test\n\ntext\ntext\ntext'}))
    response = client.get('/pages/test-fragment/1/5')
    assert response.status_code == 200
    assert response.json() == {'content': '# Test\n\ntext\ntext\n', 'favorite': False, 'filename': 'test-fragment.md', 'id': 'test-fragment', 'title': 'Test Fragment'}
    response = client.get('/pages/test-fragment/6/10')
    assert response.status_code == 200
    assert response.json() == {'content': '## Test\n\n* test\n* test\n* test', 'favorite': False, 'filename': 'test-fragment.md', 'id': 'test-fragment', 'title': 'Test Fragment'}
    response = client.get('/pages/test-fragment/1/1')
    assert response.status_code == 200
    assert response.json() == {'content': '# Test', 'favorite': False, 'filename': 'test-fragment.md', 'id': 'test-fragment', 'title': 'Test Fragment'}
    client.delete('/pages/test-fragment')

def test_get_page_fragment_with_illegal_range(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test Fragment', 'content': '# Test\n\ntext\ntext\n\n## Test\n\n* test\n* test\n* test'}))
    response = client.get('/pages/test-fragment/0/1')
    assert response.status_code == 404
    assert response.json() == {'detail': 'Page with lines 0 to 1 does not exist'}
    response = client.get('/pages/test-fragment/10/6')
    assert response.status_code == 404
    assert response.json() == {'detail': 'Page with lines 10 to 6 does not exist'}
    client.delete('/pages/test-fragment')

def test_patch_page_content_with_fragment(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test Fragment', 'content': '# Test\n\ntext\ntext\n\n## Test\n\n* test\n* test\n* test\n\n## Test\n\ntext\ntext\ntext'}))
    response = client.patch('/pages/test-fragment/6/10', content=json.dumps({'content': '## Fragment\n\nfragment'}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Test\n\ntext\ntext\n\n## Fragment\n\nfragment\n\n## Test\n\ntext\ntext\ntext', 'favorite': False, 'filename': 'test-fragment.md', 'id': 'test-fragment', 'title': 'Test Fragment'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-fragment.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test\n\ntext\ntext\n\n## Fragment\n\nfragment\n\n## Test\n\ntext\ntext\ntext'
    client.delete('/pages/test-fragment')

def test_patch_page_content_with_empty_fragment(setup_pages_dir):
    client.post('/pages', content=json.dumps({'title': 'Test Fragment', 'content': '# Test\n\ntext\ntext\n\n## Test\n\n* test\n* test\n* test\n\n## Test\n\ntext\ntext\ntext'}))
    response = client.patch('/pages/test-fragment/11/16', content=json.dumps({'content': ''}))
    assert response.status_code == 200
    assert response.json() == {'content': '# Test\n\ntext\ntext\n\n## Test\n\n* test\n* test\n* test', 'favorite': False, 'filename': 'test-fragment.md', 'id': 'test-fragment', 'title': 'Test Fragment'}
    with open(f'{os.environ.get("PAGES_DIR")}/test-fragment.md') as f:
        metadata, content = frontmatter.parse(f.read())
    assert content == '# Test\n\ntext\ntext\n\n## Test\n\n* test\n* test\n* test'
    client.delete('/pages/test-fragment')

