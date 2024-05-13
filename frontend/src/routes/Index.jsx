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

  return (
    <>
      <div className="index">
        {categories.map((category) => (
          <Category key={category} category={category} groupedPages={groupedPages} />
        ))}
      </div>
    </>
  );
}

