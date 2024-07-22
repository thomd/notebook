import { useEffect } from 'react'
import { useLoaderData, Link, useOutletContext } from 'react-router-dom'
import { getPages } from '../pages'
import { NewPageForm } from '../components/NewPage'

export async function loader({ request }) {
  const pages = await getPages()
  return { pages }
}

export default function Index() {
  const { pages } = useLoaderData()
  const [currentPage, setCurrentPage] = useOutletContext() // eslint-disable-line no-unused-vars
  const categoryPages = Object.groupBy(pages, (page) => page.category)
  const categories = Object.keys(categoryPages).sort()

  const numberCols = 5
  let columns = []
  for (let i = 0; i < numberCols; i++) {
    columns.push(categories.filter((_, index) => index % numberCols === i))
  }

  useEffect(() => {
    setCurrentPage(undefined)
  })

  return (
    <>
      <div className="mb-10 flex">
        <NewPageForm />
      </div>
      <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(' + numberCols + ', minmax(0, 1fr))' }}>
        {columns.map((column, i) => (
          <div key={`col-${i}`} className="grid gap-8 auto-rows-min">
            {column.map((category, j) => (
              <div key={`col-${i}-${j}`}>
                <Link className="font-bold mb-1 pb-1 border-b hover:text-gray-600 block border-gray-400" to={`/category/${categoryPages[category][0].cid}`}>
                  {category !== 'undefined' ? category : 'Uncategorized'}
                </Link>
                <ul>
                  {categoryPages[category].map((page) => (
                    <li key={page.id}>
                      <Link to={`/pages/${page.id}/`}>
                        {page.title}
                        {page.favorite && <span className="ml-2">★</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
