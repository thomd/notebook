import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalCloseButton } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import parse from 'html-react-parser'
import { searchIndex } from '../search'

export function SearchModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const input = useRef(null)
  const [results, setResults] = useState([])

  const openSearchModal = () => {
    setResults([])
    onOpen()
  }
  useHotkeys(['shift+/', 's'], openSearchModal, { keydown: false, keyup: true })

  const handleInput = async (ev) => {
    const query = ev.target.value
    if (query.length > 1) {
      const res = await searchIndex(query)
      setResults(res)
    }
  }

  const handleLinkClick = (ev) => {
    onClose()
  }

  return (
    <Modal size="full" initialFocusRef={input} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <h1 className="ml-4 -mt-20 !text-headline font-bold text-stone-100">Search</h1>
        <div className="relative -top-40">
          <input
            ref={input}
            className="mx-8 pl-2 font-light text-xl border-b block border-gray-400 text-gray-400 outline-none w-[calc(100vw-6rem)] bg-transparent"
            onChange={handleInput}
          />
          <div className="text-gray-600 m-8 mt-16">
            <ol>
              {results.map((result, i) => (
                <li key={`res-${i}`}>
                  <Link
                    to={result.url}
                    onClick={handleLinkClick}
                    className="hover:text-sky-700 text-sky-800 font-medium py-1 px-2 -my-1 -mx-2 focus:bg-sky-700 focus:text-gray-50 focus:rounded outline-none">
                    {result.title}
                  </Link>
                  <ul className="search-filter text-gray-400 mb-6 font-mono text-sm">
                    {result.result.map((res, j) => (
                      <li key={`res-${i}-${j}`}>{parse(res)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
