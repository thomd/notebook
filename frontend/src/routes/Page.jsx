import { useEffect } from 'react'
import { useLoaderData, useOutletContext } from 'react-router-dom'
import { getPage, patchPage } from '../pages'
import MarkdownViewer from '../components/Markdown'
import Favorite from '../components/Favorite'
import Title from '../components/Title'

export async function loader({ params }) {
  const page = await getPage(params)
  if (!page) {
    throw new Response('', { status: 404, statusText: 'Page Not Found' })
  }
  return { page }
}

export async function action({ request, params }) {
  let formData = await request.formData()
  return patchPage(params, {
    favorite: formData.get('favorite') === 'true',
  })
}

export default function Page() {
  const [currentPage, setCurrentPage] = useOutletContext() // eslint-disable-line no-unused-vars
  const { page } = useLoaderData()

  useEffect(() => {
    setCurrentPage(page)
  })

  return (
    <div className="page">
      <div className="mb-4 flex">
        <Title page={page} />
        <Favorite page={page} />
      </div>
      <MarkdownViewer content={page.content} />
    </div>
  )
}
