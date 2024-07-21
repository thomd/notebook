import { useLoaderData, Link } from 'react-router-dom'
import { getPages } from '../pages'

export async function loader({ params }) {
  const pages = await getPages()
  return { pages, params }
}

export default function Category() {
  const { pages, params } = useLoaderData()
  const categoryPages = pages.filter((page) => page.cid === params.cid)
  const category = categoryPages[0].category
  return (
    <div>
      <h2 className="font-bold mb-1 pb-1 border-b border-gray-300">{category !== 'undefined' ? category : 'Uncategorized'}</h2>
      <ul>
        {categoryPages.map((page) => (
          <li key={page.id}>
            <Link to={`/pages/${page.id}/`}>
              {page.title}
              {page.favorite && <span className="ml-2">★</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
