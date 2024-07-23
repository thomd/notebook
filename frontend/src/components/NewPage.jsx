import { useState } from 'react'
import { Form } from 'react-router-dom'

export function NewPageForm({ className }) {
  const [title, setTitle] = useState('')
  const [newtitle, setNewTitle] = useState('')
  let disabled = newtitle === ''

  const handleInputChange = (ev) => {
    setNewTitle(ev.target.value)
    setTitle(ev.target.value)
  }

  const handleFormSubmit = (ev) => {
    setNewTitle('')
  }

  return (
    <Form method="post" action="new" onSubmit={handleFormSubmit} className={`${className || ''} flex`}>
      <input
        type="text"
        placeholder="Title"
        onChange={handleInputChange}
        name="newtitle"
        value={newtitle}
        className="block border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-300 outline-none"
      />
      <input type="text" defaultValue={title} name="title" hidden />
      <button
        type="submit"
        disabled={disabled}
        className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none disabled:bg-white disabled:text-gray-500 disabled:text-base disabled:rounded disabled:border disabled:border-gray-400">
        New Page
      </button>
    </Form>
  )
}
