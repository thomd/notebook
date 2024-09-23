import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import parse from 'html-react-parser'
import { search } from '../search'

export function SearchModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
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
    <Modal size="full" initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Input ref={initialRef} placeholder="Search" style={{ boxShadow: 'none' }} onChange={handleInput} />
          </FormControl>
          <div className="text-gray-600 m-8">
            <ol>
              {results.map((result, i) => (
                <li key={`res-${i}`}>
                  <Link to={result.url} onClick={handleLinkClick} className="hover:text-sky-700 text-sky-800 font-medium">
                    {result.title}
                  </Link>
                  <ul className="search-filter text-gray-400 mb-4 font-mono text-sm">
                    {result.result.map((res, j) => (
                      <li key={`res-${i}-${j}`}>{parse(res)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
