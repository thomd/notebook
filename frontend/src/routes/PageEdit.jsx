import { useState } from 'react'
import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom'
import { patchPage } from '../pages'
import * as prettier from 'prettier'
import * as parserMarkdown from 'prettier/parser-markdown'

export async function action({ request, params }) {
  const updates = Object.fromEntries(await request.formData())
  await patchPage(params, updates)
  return redirect(`/pages/${params.pageId}/`)
}

export default function PageEdit() {
  const { page } = useLoaderData()
  const navigate = useNavigate()
  const [content, setContent] = useState(page.content === '' ? '# ' + page.title : page.content)

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const prettify = async (event) => {
    event.preventDefault()
    const prettifiedContent = await prettier.format(content, {
      parser: 'markdown',
      plugins: [parserMarkdown],
      proseWrap: 'always',
      printWidth: 140,
    })
    setContent(prettifiedContent)
  }

  return (
    <Form method="post" className="grid grid-cols-2 gap-8 h-full grid-rows-[auto_1fr_auto]">
      <input type="hidden" name="favorite" value={page.favorite} />
      <div>
        <input
          required
          placeholder="Title"
          type="text"
          name="title"
          defaultValue={page.title}
          className="block w-full border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-300 outline-none"
        />
      </div>
      <div>
        <input
          placeholder="Category"
          type="text"
          name="category"
          defaultValue={page.category}
          className="block w-full border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-300 outline-none"
        />
      </div>
      <div className="col-span-2">
        <textarea
          name="content"
          autoFocus
          value={content}
          onChange={handleChange}
          className="font-mono text-sm block w-full h-full border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none"
        />
      </div>
      <div className="col-span-2">
        <button
          type="button"
          onClick={() => {
            navigate(-1)
          }}
          className="py-1 px-3 bg-white text-gray-500 text-base rounded border border-gray-400">
          Cancel
        </button>
        <button type="submit" className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">
          Save
        </button>
        <button type="button" onClick={prettify} className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">
          Prettify
        </button>
      </div>
    </Form>
  )
}
