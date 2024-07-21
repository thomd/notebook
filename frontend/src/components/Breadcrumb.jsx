import { Link } from 'react-router-dom'

export default function Breadcrumb({ page }) {
  return (
    <>
      <Link className="text-gray-400 hover:text-gray-600" to={'/'}>
        Index
      </Link>
      <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-2" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
      </svg>
      {page.category ? (
        <>
          <Link className="text-gray-400 hover:text-gray-600" to={`/category/${page.cid}`}>
            {page.category}
          </Link>
          <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-2" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="text-gray-400">{page.title}</span>
        </>
      ) : (
        <span className="text-gray-400">{page.title}</span>
      )}
    </>
  )
}
