import { Form, useLoaderData } from 'react-router-dom'
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
  const { page } = useLoaderData()

  const handleDelete = (ev) => {
    if (!window.confirm('Please confirm you want to delete this page.')) {
      ev.preventDefault()
    }
  }

  return (
    <div className="page">
      <div className="mb-4 flex">
        <Title page={page} />
        <Favorite page={page} />
      </div>
      <MarkdownViewer content={page.content} />
      <div>
        <Form action="edit" className="inline">
          <button type="submit" className="mt-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">Edit</button>
        </Form>
        <Form method="post" action="delete" className="inline" onSubmit={handleDelete}>
          <button type="submit" className="mt-4 ml-4 py-1 px-3 bg-red-400 hover:bg-red-500 text-white text-base rounded outline-none">Delete</button>
        </Form>
      </div>
    </div>
  )
}
