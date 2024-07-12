import { Outlet, Link, useLoaderData } from 'react-router-dom'
import { Search } from '../components/Search'
import Navigation from '../components/Navigation'
import { NewPageForm } from '../components/NewPage'
import { getPages } from '../pages'
import { useScrollToTop, useHashEditPageLink, useScrollIntoView } from '../hooks/scroll'

export async function loader({ request }) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const pages = await getPages(q)
  return { pages, q }
}

export default function Decorator() {
  const { pages, q } = useLoaderData()
  useScrollToTop()
  useHashEditPageLink()
  useScrollIntoView()

  return (
    <>
      <div className="menu-wrapper header flex flex-nowrap justify-between items-center">
        <Search q={q} />
        <Link to={'edit'}>Edit</Link>
        <NewPageForm />
      </div>
      <div className="navigation">
        <Navigation pages={pages} />
      </div>
      <div className="content">
        <Outlet />
      </div>
      <div className="footer">
        <a className="text-sm text-gray-400" href="https://github.com/thomd/notebook-notes">
          https://github.com/thomd/notebook-notes
        </a>
      </div>
    </>
  )
}
