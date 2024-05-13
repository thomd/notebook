import { Link } from 'react-router-dom'

export default function Category({ category, groupedPages }) {
  return (
    <div>
      {category !== 'undefined' ? (
        <h2 className="font-bold">{category}</h2>
      ) : (
        <h2 className="font-bold">Uncategorized</h2>
      )}
      <ul>
        {groupedPages[category].map((page) => (
          <li key={page.id}>
            <Link to={`pages/${page.id}`}>
              {page.title}
              {page.favorite && <span className="ml-2">★</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

