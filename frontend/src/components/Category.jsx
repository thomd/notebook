import { NavLink } from 'react-router-dom'

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
            <NavLink to={`pages/${page.id}`}>
              <span>{page.title}</span>
              {page.favorite && <span>★</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

