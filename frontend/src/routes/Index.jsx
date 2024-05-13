import { useLoaderData } from 'react-router-dom'
import { getPages } from '../pages'
import Category from '../components/Category'

export async function loader({ request }) {
  const pages = await getPages()
  return { pages }
}

export default function Index() {
  const { pages } = useLoaderData()
  const groupedPages = Object.groupBy(pages, page => page.category)
  const categories = Object.keys(groupedPages)

  const firstColumn = categories.filter((_, index) => index % 3 === 0)
  const secondColumn = categories.filter((_, index) => index % 3 === 1)
  const thirdColumn = categories.filter((_, index) => index % 3 === 2)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="grid gap-8 auto-rows-min">
          {firstColumn.map((category) => (
            <Category key={category} category={category} groupedPages={groupedPages} />
          ))}
        </div>
        <div className="grid gap-8 auto-rows-min">
          {secondColumn.map((category) => (
            <Category key={category} category={category} groupedPages={groupedPages} />
          ))}
        </div>
        <div className="grid gap-8 auto-rows-min">
          {thirdColumn.map((category) => (
            <Category key={category} category={category} groupedPages={groupedPages} />
          ))}
        </div>
      </div>
    </>
  );
}

