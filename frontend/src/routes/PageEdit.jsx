import { useState, useRef, useEffect } from 'react'
import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom'
import CategorySelect from '../components/CategorySelect'
import { patchPage } from '../pages'
import { useHotkeys } from 'react-hotkeys-hook'
import * as prettier from 'prettier'
import * as parserMarkdown from 'prettier/parser-markdown'

export async function action({ request, params }) {
  const updates = Object.fromEntries(await request.formData())
  const page = await patchPage(params, updates)
  return redirect(`/pages/${page.id}/${document.location.hash}`)
}

export default function PageEdit() {
  const { pages, page } = useLoaderData()
  const navigate = useNavigate()
  const [content, setContent] = useState(page.content === '' ? '# ' + page.title : page.content)
  const inputRef = useRef()
  const [characterCount, setCharacterCount] = useState('')
  const [linesCount, setLinesCount] = useState('')

  const count = (inputRef) => {
    setCharacterCount(new Intl.NumberFormat('de-DE').format(inputRef.current.value.length))
    setLinesCount(new Intl.NumberFormat('de-DE').format(inputRef.current.value.split('\n').length))
  }

  useEffect(() => {
    console.log(inputRef)
    count(inputRef)
  }, [inputRef])

  const handleChange = (ev) => {
    setContent(ev.target.value)
    count(inputRef)
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

  const cancel = () => {
    navigate(-1)
  }

  useHotkeys('escape', cancel)

  return (
    <div className="grid min-h-screen p-8">
      <Form method="post" className="grid grid-cols-2 gap-8 h-full grid-rows-pageedit">
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
          <CategorySelect pages={pages} page={page} />
        </div>
        <div className="col-span-2">
          <textarea
            ref={inputRef}
            name="content"
            autoFocus
            value={content}
            onChange={handleChange}
            className="px-3 py-[6px] font-mono text-sm block w-full h-full text-gray-900 border-2 border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="col-span-2 flex justify-between items-center">
          <div>
            <button type="button" onClick={cancel} className="py-1 px-3 bg-white text-gray-500 text-base rounded border border-gray-400">
              Cancel
            </button>
            <button type="submit" className="ml-8 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">
              Save
            </button>
            <button type="button" onClick={prettify} className="ml-8 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">
              Prettify
            </button>
          </div>
          <div>
            <Counter characterCount={characterCount} linesCount={linesCount} />
          </div>
        </div>
      </Form>
    </div>
  )
}

function Counter({ characterCount, linesCount }) {
  return (
    <div className="text-sm text-gray-400 flex flex-col items-end">
      <div>
        <span className="text-gray-500">{characterCount}</span> Words
      </div>
      <div>
        <span className="text-gray-500">{linesCount}</span> Lines
      </div>
    </div>
  )
}
