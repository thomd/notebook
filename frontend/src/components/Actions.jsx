import { useRef, useState } from 'react'
import { Form, useLocation, useFetcher, useNavigate } from 'react-router-dom'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, Input } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'
import { whiteCircle, blackCircle } from '../components/Favorites'
import parse from 'html-react-parser'

export function EditButton({ className }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useHotkeys('e', () => {
    navigate(`${pathname}edit`)
  })

  return (
    <>
      <Form className={className} action={`${pathname}edit`}>
        <button className="px-3 bg-white hover:text-sky-700 text-sky-800 text-lg">Edit</button>
      </Form>
    </>
  )
}

export function DeleteButton({ pageTitle, className }) {
  const { pathname } = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const inputRef = useRef()
  const [disabled, setDisabled] = useState(true)

  const openDeleteModal = () => {
    onOpen()
  }
  useHotkeys('d', openDeleteModal, { keydown: false, keyup: true })

  return (
    <div className={className}>
      <button onClick={onOpen} className="px-3 bg-white hover:text-sky-700 text-sky-800 text-lg">
        Delete
      </button>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef}>
        <ModalOverlay />
        <ModalContent ref={inputRef}>
          <ModalCloseButton />
          <ModalHeader />
          <ModalBody>
            Enter page title <b>{pageTitle}</b> to confirm deletion
            <FormControl className="mt-4">
              <Input placeholder="Page Title" onChange={(ev) => setDisabled(ev.target.value !== pageTitle)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Form method="delete" action={`${pathname}delete`} className="inline" onSubmit={onClose}>
              <button
                disabled={disabled}
                type="submit"
                className="mt-4 ml-4 py-1 px-3 bg-red-400 hover:bg-red-500 disabled:bg-gray-400 text-white text-base rounded outline-none">
                Confirm
              </button>
            </Form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export function Favorite({ page, className }) {
  const fetcher = useFetcher()
  let favorite = page.favorite
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }

  return (
    <fetcher.Form method="post" className={`${className} inline`}>
      {favorite ? (
        <button name="favorite" value="false" className="text-lg text-orange-600">
          {parse(blackCircle)}
        </button>
      ) : (
        <button name="favorite" value="true" className="text-lg text-gray-300">
          {parse(whiteCircle)}
        </button>
      )}
    </fetcher.Form>
  )
}
