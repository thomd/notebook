import { Form, useLocation, useFetcher } from 'react-router-dom'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import { isReadPage } from '../utils'

export function EditButton() {
  const { pathname } = useLocation()

  if (isReadPage(pathname)) {
    return (
      <>
        <Form action={`${pathname}edit`}>
          <button className="mr-5 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">Edit</button>
        </Form>
      </>
    )
  }
}

export function DeleteButton({ pageTitle }) {
  const { pathname } = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (isReadPage(pathname)) {
    return (
      <>
        <button onClick={onOpen} className="mr-8 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">
          Delete
        </button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader />
            <ModalBody>
              Confirm to delete page <b>{pageTitle}</b>
            </ModalBody>
            <ModalFooter>
              <Form method="delete" action={`${pathname}delete`} className="inline" onSubmit={onClose}>
                <button type="submit" className="mt-4 ml-4 py-1 px-3 bg-red-400 hover:bg-red-500 text-white text-base rounded outline-none">
                  Confirm
                </button>
              </Form>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
}

export function Favorite({ page }) {
  const fetcher = useFetcher()
  let favorite = page.favorite
  if (fetcher.formData) {
    favorite = fetcher.formData.get('favorite') === 'true'
  }
  return (
    <fetcher.Form method="post" className="inline ml-4">
      <button name="favorite" value={favorite ? 'false' : 'true'} className="text-gray-400">
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
