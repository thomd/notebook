import { useEffect } from 'react'
import { useLoaderData, useOutletContext } from 'react-router-dom'
import { getPages, getPage, patchPage } from '../pages'
import { Favorite } from '../components/Actions'
import Breadcrumb from '../components/Breadcrumb'
import Navigation from '../components/Navigation'
import { FavoritesMenu } from '../components/Favorites'
import { EditButton, DeleteButton } from '../components/Actions'
import MarkdownViewer from '../components/Markdown'
import { Footer } from '../components/Footer'
import StickyBox from 'react-sticky-box'

export async function loader({ params }) {
  const pages = await getPages()
  const page = await getPage(params)
  if (!page) {
    throw new Response('', { status: 404, statusText: 'Page Not Found' })
  }
  return { pages, page }
}

export async function action({ request, params }) {
  let formData = await request.formData()
  return patchPage(params, {
    favorite: formData.get('favorite') === 'true',
  })
}

export default function Page() {
  const [currentPage, setCurrentPage] = useOutletContext() // eslint-disable-line no-unused-vars
  const { pages, page } = useLoaderData()

  useEffect(() => {
    setCurrentPage(page)
  })

  return (
    <div className="grid grid-cols-page min-h-screen">
      <div className="navigation">
        <StickyBox className="self-start" offsetTop={30} offsetBottom={30}>
          <Navigation content={page.content} />
        </StickyBox>
      </div>
      <div className="grid grid-rows-page">
        <div className="px-8 flex flex-nowrap justify-between items-center">
          <div className="flex flex-nowrap">
            <Breadcrumb pages={pages} page={page} />
            <Favorite page={page} className="ml-5" />
          </div>
          <div className="flex flex-nowrap">
            <FavoritesMenu pages={pages} className="mr-8" />
            <EditButton className="mr-5" />
            <DeleteButton pageTitle={currentPage?.title} />
          </div>
        </div>
        <MarkdownViewer content={page.content} className="px-8" />
        <Footer filename={page?.filename} className="flex items-end px-8 py-6" />
      </div>
    </div>
  )
}
