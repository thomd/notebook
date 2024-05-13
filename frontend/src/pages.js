import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

const baseUrl = 'http://localhost:8000'

export async function getPages(query) {
    const response = await fetch(`${baseUrl}/pages`)
    const data = await response.json()
    let pages = await data.pages
    console.log('pages:', pages)
    if (!pages) pages = []
    if (query) {
        pages = matchSorter(pages, query, { keys: ['title'] })
    }
    return pages.sort(sortBy('title'))
}

export async function getPage(id) {
    const response = await fetch(`${baseUrl}/pages/${id}`)
    const data = await response.json()
    console.log('page:', data)
    return data ?? null
}

export async function createPage(updates) {
    console.log('create page with', updates)
    const response = await fetch(`${baseUrl}/pages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await response.json()
    console.log('created page:', data)
    return data ?? null
}

export async function patchPage(id, updates) {
    console.log('patch page', id, 'with', updates)
    const response = await fetch(`${baseUrl}/pages/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await response.json()
    console.log('patched page:', data)
    return data ?? null
}

export async function deletePage(id) {
    const response = await fetch(`${baseUrl}/pages/${id}`, {
        method: 'DELETE'
    });
    return response.status === '204' ? true : false
}
