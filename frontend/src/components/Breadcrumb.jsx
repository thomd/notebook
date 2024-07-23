import { Link, useNavigate } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'

export default function Breadcrumb({ page }) {
  const navigate = useNavigate()

  useHotkeys('shift+i', () => {
    navigate('/')
  })

  useHotkeys('shift+c', () => {
    navigate(`/category/${page.cid}`)
  })

  return (
    <>
      <Link className="text-lg text-gray-400 hover:text-gray-600" to={'/'}>
        Index
      </Link>
      <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-[9px]" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
      </svg>
      {page.category ? (
        <>
          <Link className="text-lg text-gray-400 hover:text-gray-600" to={`/category/${page.cid}`}>
            {page.category}
          </Link>
          <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-[9px]" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
          <span className="text-lg text-gray-400">{page.title}</span>
        </>
      ) : (
        <span className="text-lg text-gray-400">{page.title}</span>
      )}
    </>
  )
}
