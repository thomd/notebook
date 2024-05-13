import { Link } from 'react-router-dom'

export default function Navigation({ pages }) {
  const favoritePages = pages.filter(page => page.favorite === true)

  return (
    <nav>
      <ul>
        <li className="mb-4">
          <Link to={''}>Home</Link>
        </li>
        {favoritePages.map((page) => (
          <li key={page.id}>
            <Link to={`pages/${page.id}`}>
              {page.title}
              {page.favorite && <span className="ml-2">★</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

