import { useLoaderData } from 'react-router-dom'
import { getPages } from '../pages'
import Category from '../components/Category'
import { Search } from '../components/Search'
import { FavoritesMenu } from '../components/Favorites'
import { NewPageForm } from '../components/NewPage'
import { EditButton, DeleteButton } from '../components/Actions'

export async function loader({ request }) {
  const pages = await getPages()
  return { pages }
}

export default function Index() {
  const { pages } = useLoaderData()
  const groupedPages = Object.groupBy(pages, (page) => page.category)
  const categories = Object.keys(groupedPages).sort()

  const numberCols = 4
  let columns = []
  for (let i = 0; i < numberCols; i++) {
    columns.push(categories.filter((_, index) => index % numberCols === i))
  }

  return (
    <>
      <div className="header flex flex-nowrap justify-between items-center p-4">
        <NewPageForm />
      </div>
      <div className="grid gap-24" style={{ gridTemplateColumns: 'repeat(' + numberCols + ', minmax(0, 1fr))' }}>
        {columns.map((column, index) => (
          <div key={'col-' + index} className="grid gap-8 auto-rows-min">
            {column.map((category) => (
              <Category key={category} category={category} groupedPages={groupedPages} />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
