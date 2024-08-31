import { useEffect } from 'react'
import { useLoaderData, Link, useOutletContext } from 'react-router-dom'
import { getPages } from '../pages'
import { NewPageForm } from '../components/NewPage'
import { Footer } from '../components/Footer'

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
    <div className="grid grid-rows-index min-h-screen">
      <div className="flex justify-start items-center px-8">
        <NewPageForm pages={pages} />
      </div>
      <div className="grid gap-10 p-8" style={{ gridTemplateColumns: 'repeat(' + numberCols + ', minmax(0, 1fr))' }}>
        {columns.map((column, i) => (
          <div key={`col-${i}`} className="grid gap-8 auto-rows-min">
            {column.map((category, j) => (
              <div key={`col-${i}-${j}`}>
                <h2 className="font-bold mb-1 pb-1 border-b hover:text-gray-600 block border-gray-400">
                  {category !== 'undefined' ? category : 'Uncategorized'}
                </h2>
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
      <Footer className="px-8 py-4" />
    </div>
  )
}
