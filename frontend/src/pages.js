import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

const baseUrl = 'http://localhost:8000'

export async function getPages(query) {
    const response = await fetch(`${baseUrl}/pages`)
    const data = await response.json()
    let pages = await data.pages
    if (!pages) pages = []
    if (query) {
        pages = matchSorter(pages, query, { keys: ['title'] })
    }
    return pages.sort(sortBy('title'))
}

export async function getPage(id, start, end) {
    let url = `${baseUrl}/pages/${id}`
    if (start && end) {
        url += `/${start}/${end}`
    }
    const response = await fetch(url)
    const data = await response.json()
    return data ?? null
}

export async function createPage(updates) {
    const response = await fetch(`${baseUrl}/pages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await response.json()
    return data ?? null
}

export async function patchPage(id, start, end, updates) {
    let url = `${baseUrl}/pages/${id}`
    if (start && end) {
        url += `/${start}/${end}`
    }
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
    });
    const data = await response.json()
    return data ?? null
}

export async function deletePage(id) {
    const response = await fetch(`${baseUrl}/pages/${id}`, {
        method: 'DELETE'
    });
    return response.status === '204' ? true : false
}
