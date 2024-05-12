import { useState } from 'react'
import { Form } from 'react-router-dom'

export function NewPageForm() {
  const [text, setText] = useState('')

  const handleInputChange = (ev) => {
    setText(ev.target.value)
  }

  let disabled = text === ''

  return (
    <>
      <Form method="post" action="new" className="flex">
        <input placeholder="Title" type="text" onChange={handleInputChange} value={text} name="title" className="block border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-300 outline-none" />
        <button type="submit" disabled={disabled} className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none disabled:bg-white disabled:text-gray-500 disabled:text-base disabled:rounded disabled:border disabled:border-gray-400">New Page</button>
      </Form>
    </>
  )
}
