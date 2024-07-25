import { useState, useEffect } from 'react'

export default function Counter({ inputRef, className }) {
  const [characterCount, setCharacterCount] = useState('')
  const [linesCount, setLinesCount] = useState('')

  useEffect(() => {
    setCharacterCount(new Intl.NumberFormat('de-DE').format(inputRef.current.value.length))
    setLinesCount(new Intl.NumberFormat('de-DE').format(inputRef.current.value.split('\n').length))
  })

  return (
    <div className={`${className || ''} text-sm text-gray-400 flex flex-col items-end`}>
      <div>
        <span className="text-gray-500">{characterCount}</span> Words
      </div>
      <div>
        <span className="text-gray-500">{linesCount}</span> Lines
      </div>
    </div>
  )
}
