import { useLoaderData } from 'react-router-dom'
import { getPages } from '../pages'
import Category from '../components/Category'

export async function loader({ request }) {
  const pages = await getPages()
  return { pages }
}

export default function Index() {
  const { pages } = useLoaderData()
  const groupedPages = Object.groupBy(pages, (page) => page.category)
  const categories = Object.keys(groupedPages).sort()

  const numberCols = 3
  let columns = []
  for (let i = 0; i < numberCols; i++) {
    columns.push(categories.filter((_, index) => index % numberCols === i))
  }

  return (
    <>
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
