import { Link } from 'react-router-dom'

export default function CategoryPages({ category, categoryPages }) {
  return (
    <div>
      <h2 className="font-bold mb-1 pb-1 border-b border-gray-300">{category !== 'undefined' ? category : 'Uncategorized'}</h2>
      <ul>
        {categoryPages[category].map((page) => (
          <li key={page.id}>
            <Link to={`pages/${page.id}/`}>
              {page.title}
              {page.favorite && <span className="ml-2">★</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
