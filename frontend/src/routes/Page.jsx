import { Form, useLoaderData, useFetcher } from 'react-router-dom'
import { getPage, patchPage } from '../pages'
import MarkdownViewer from '../components/Markdown'

export async function loader({ params }) {
  const page = await getPage(params.pageId, params.start, params.end)
  if (!page) {
    throw new Response('', { status: 404, statusText: 'Page Not Found' })
  }
  return { page }
}

export async function action({ request, params }) {
  let formData = await request.formData()
  return patchPage(params.pageId, {
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
  );
}

function Title({ page }) {
  return (
    <>
      {page.category ? (
        <>
          <span className="text-gray-400">{page.category}</span>
          <svg className="w-3 h-3 text-gray-400 ml-3 mr-1 mt-2" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span className="text-gray-400">{page.title}</span>
        </>
      ) : (
        <span className="text-gray-400">{page.title}</span>
      )}
    </>
  )
}

function Favorite({ page }) {
  const fetcher = useFetcher()
  let favorite = page.favorite
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true"
  }
  return (
    <fetcher.Form method="post" className="inline ml-4">
      <button name="favorite" value={favorite ? "false" : "true"} className="text-gray-400">
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  )
}

