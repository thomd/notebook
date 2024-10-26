import { useState, useRef, useEffect } from 'react'
import { Form, useLoaderData, redirect, useNavigate } from 'react-router-dom'
import CategorySelect from '../components/CategorySelect'
import { patchPage } from '../services/pages'
import { useScrollMirror } from '../hooks/scroll'
import { useHotkeys } from 'react-hotkeys-hook'
import * as prettier from 'prettier'
import * as parserMarkdown from 'prettier/parser-markdown'
import MarkdownViewer from '../components/Markdown'

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
  const [preview, setPreview] = useState('hidden')
  const [characterCount, setCharacterCount] = useState('')
  const [linesCount, setLinesCount] = useState('')
  const [disabled, setDisabled] = useState(true)

  const count = (inputRef) => {
    setCharacterCount(new Intl.NumberFormat('de-DE').format(inputRef.current.value.length))
    setLinesCount(new Intl.NumberFormat('de-DE').format(inputRef.current.value.split('\n').length))
  }

  useEffect(() => {
    count(inputRef)
  }, [inputRef])

  const handleContentChange = (ev) => {
    setContent(ev.target.value)
    count(inputRef)
    setDisabled(page.content === ev.target.value)
  }

  const handleTitleChange = (ev) => {
    setDisabled(page.title === ev.target.value)
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
    setDisabled(page.content === prettifiedContent)
  }

  const togglePreview = (ev) => {
    ev.preventDefault()
    setPreview(preview === 'hidden' ? 'grid preview' : 'hidden')
  }

  const cancel = () => {
    navigate(-1)
  }

  useHotkeys('escape', cancel)

  useScrollMirror()

  return (
    <div className="grid min-h-screen has-[.preview]:grid-rows-2 bg-gray-100 has-[.preview]:bg-gray-200">
      <div
        className={`${preview} scroll-mirror pl-8 gap-8 h-[50vh] bg-white shadow-[inset_0_-10px_20px_-10px_#ddd] border border-solid border-gray-300 overflow-scroll`}>
        <MarkdownViewer content={content} className="" preview={true} />
      </div>
      <Form method="post" className="grid grid-cols-2 gap-8 p-8 h-full grid-rows-pageedit">
        <input type="hidden" name="favorite" value={page.favorite} />
        <div>
          <input
            required
            placeholder="Title"
            type="text"
            name="title"
            onChange={handleTitleChange}
            defaultValue={page.title}
            className="block w-full border-0 px-3 py-[6px] text-gray-900 placeholder:text-gray-300 border-2 border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0"
          />
        </div>
        <div>
          <CategorySelect setDisabled={setDisabled} pages={pages} page={page} />
        </div>
        <div className="col-span-2">
          <textarea
            ref={inputRef}
            name="content"
            autoFocus
            value={content}
            onChange={handleContentChange}
            className="scroll-mirror px-3 py-[6px] font-mono text-sm block w-full h-full text-gray-900 border-2 border-gray-300 focus:border-gray-400 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="col-span-2 flex justify-between items-center">
          <div>
            <button type="button" onClick={cancel} className="py-1 px-3 bg-white hover:bg-gray-100 text-gray-500 text-base rounded border border-gray-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className="ml-8 py-1 px-3 bg-emerald-500 hover:bg-emerald-600 text-white text-base rounded outline-none disabled:bg-gray-500 disabled:text-white disabled:text-base disabled:rounded disabled:outline-none">
              Save
            </button>
            <button
              type="button"
              onClick={prettify}
              className="ml-16 py-1 px-3 bg-white hover:bg-gray-100 text-gray-500 text-base rounded border border-gray-400">
              Prettify
            </button>
            <button
              type="button"
              onClick={togglePreview}
              className="ml-8 py-1 px-3 bg-white hover:bg-gray-100 text-gray-500 text-base rounded border border-gray-400">
              {preview === 'hidden' ? 'Show Preview' : 'Hide Preview'}
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
