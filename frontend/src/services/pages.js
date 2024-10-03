import { matchSorter } from 'match-sorter'
import sortBy from 'sort-by'

const baseURL = process.env.REACT_APP_NOTEBOOK_MODE === 'production' ? 'http://localhost:8000' : 'http://localhost:8002'

export async function getPages(query) {
  const response = await fetch(`${baseURL}/pages`)
  const data = await response.json()
  let pages = await data.pages
  if (!pages) pages = []
  if (query) {
    pages = matchSorter(pages, query, { keys: ['title'] })
  }
  return pages.sort(sortBy('title'))
}

export async function getPage(params) {
  let { pageId, start, end } = params
  let url = `${baseURL}/pages/${pageId}`
  if (start && end) {
    url += `/${start}/${end}`
  }
  const response = await fetch(url)
  const data = await response.json()
  return data ?? null
}

export async function createPage(updates) {
  const response = await fetch(`${baseURL}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
  return {
    status: response.status,
    data: await response.json(),
  }
}

export async function patchPage(params, updates) {
  let { pageId, start, end } = params
  let url = `${baseURL}/pages/${pageId}`
  if (start && end) {
    url += `/${start}/${end}`
  }
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
  const data = await response.json()
  return data ?? null
}

export async function deletePage(pageId) {
  const response = await fetch(`${baseURL}/pages/${pageId}`, {
    method: 'DELETE',
  })
  return response.status === '204' ? true : false
}
