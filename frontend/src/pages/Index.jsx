import { useEffect } from 'react'
import { useLoaderData, Link, useOutletContext } from 'react-router-dom'
import { getPages } from '../services/pages'
import { NewPageForm } from '../components/NewPage'
import { FavoritesMenu, blackCircle } from '../components/Favorites'
import { Footer } from '../components/Footer'
import parse from 'html-react-parser'

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
      <div className="flex justify-between items-center px-8">
        <h1 className="-ml-4 mt-32 text-headline font-bold text-stone-100">Notebook</h1>
        <FavoritesMenu pages={pages} className="font-medium" />
        <NewPageForm pages={pages} />
      </div>
      <div className="grid gap-10 p-8" style={{ gridTemplateColumns: 'repeat(' + numberCols + ', minmax(0, 1fr))' }}>
        {columns.map((column, i) => (
          <div key={`col-${i}`} className="grid gap-8 auto-rows-min">
            {column.map((category, j) => (
              <div key={`col-${i}-${j}`}>
                <h1 className="font-light text-xl mb-1 pl-2 pb-1 border-b block border-gray-400 text-gray-400">
                  {category !== 'undefined' ? category : 'Uncategorized'}
                </h1>
                <ul className="pl-2">
                  {categoryPages[category].map((page) => (
                    <li key={page.id}>
                      <Link to={`/pages/${page.id}/`}>
                        {page.title}
                        {page.favorite && <span className="ml-2 text-orange-600">{parse(blackCircle)}</span>}
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
