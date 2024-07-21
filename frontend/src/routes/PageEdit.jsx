import { useState } from 'react'
import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom'
import CreatableSelect from 'react-select/creatable'
import { patchPage } from '../pages'
import * as prettier from 'prettier'
import * as parserMarkdown from 'prettier/parser-markdown'

export async function action({ request, params }) {
  const updates = Object.fromEntries(await request.formData())
  await patchPage(params, updates)
  return redirect(`/pages/${params.pageId}/${document.location.hash}`)
}

export default function PageEdit() {
  const { pages, page } = useLoaderData()
  const navigate = useNavigate()
  const [content, setContent] = useState(page.content === '' ? '# ' + page.title : page.content)

  const handleChange = (event) => {
    setContent(event.target.value)
  }

  const categories = pages
    .map((page) => page.category)
    .filter((category) => category !== undefined)
    .filter((category, index, self) => index === self.indexOf(category))
    .map((category) => {
      return { value: category, label: category }
    })
  const [value, setValue] = useState({ value: page.category, label: page.category })

  const creatableSelectTheme = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#9ca3af',
      primary25: '#d1d5db',
      neutral30: '#d1d5db',
    },
  })

  const creatableSelectStyles = {
    control: (baseStyles) => ({
      ...baseStyles,
      borderWidth: 2,
      boxShadow: 'none',
      borderColor: '#d1d5db',
      borderRadius: 0,
    }),
    placeholder: (baseStyles) => ({
      ...baseStyles,
      fontSize: '1rem',
      color: '#d1d5db',
    }),
  }

  const prettify = async (ev) => {
    ev.preventDefault()
    const prettifiedContent = await prettier.format(content, {
      parser: 'markdown',
      plugins: [parserMarkdown],
      proseWrap: 'always',
      printWidth: 140,
    })
    setContent(prettifiedContent)
  }

  const cancel = (ev) => {
    navigate(-1)
  }

  return (
    <Form method="post" className="mt-4 grid grid-cols-2 gap-8 h-full grid-rows-[auto_1fr_auto]">
      <input type="hidden" name="favorite" value={page.favorite} />
      <div>
        <input
          required
          placeholder="Title"
          type="text"
          name="title"
          defaultValue={page.title}
          className="block w-full border-0 px-3 py-[6px] text-gray-900 placeholder:text-gray-300 border-2 border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0"
        />
      </div>
      <div>
        <CreatableSelect
          name="category"
          placeholder="Category"
          onChange={(newValue) => setValue(newValue ? newValue : '')}
          defaultValue={value}
          isClearable
          options={categories}
          styles={creatableSelectStyles}
          theme={creatableSelectTheme}
        />
      </div>
      <div className="col-span-2">
        <textarea
          name="content"
          autoFocus
          value={content}
          onChange={handleChange}
          className="px-3 py-[6px] font-mono text-sm block w-full h-full text-gray-900 border-2 border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0"
        />
      </div>
      <div className="col-span-2">
        <button type="button" onClick={cancel} className="py-1 px-3 bg-white text-gray-500 text-base rounded border border-gray-400">
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
