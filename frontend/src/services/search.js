const baseURL = process.env.REACT_APP_NOTEBOOK_MODE === 'production' ? 'http://localhost:9200' : 'http://localhost:9202'

export async function searchIndex(input) {
  const query = {
    query: {
      multi_match: {
        query: input,
        fields: ['title', 'content'],
      },
    },
    highlight: {
      require_field_match: false,
      fields: [
        {
          content: {
            fragment_size: 160,
            number_of_fragments: 5,
          },
        },
      ],
    },
  }
  const response = await fetch(`${baseURL}/notebooks/_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })
  const data = await response.json()
  const hits = await data.hits.hits
  const results = hits.map((result) => {
    return {
      result: result.highlight ? result.highlight.content : [],
      url: result._source.url,
      category: result._source.category,
      title: result._source.title,
    }
  })
  return results
}

export async function updateDocument(input) {
  // TODO
}

export async function deleteDocument(input) {
  // TODO
}
