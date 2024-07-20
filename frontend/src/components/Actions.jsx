import { Form, useLocation, useFetcher } from 'react-router-dom'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'

export function EditButton({ className }) {
  const { pathname } = useLocation()

  return (
    <>
      <Form className={className} action={`${pathname}edit`}>
        <button className="px-3 bg-white hover:text-gray-500 text-gray-400 text-base rounded outline">Edit</button>
      </Form>
    </>
  )
}

export function DeleteButton({ pageTitle, className }) {
  const { pathname } = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div className={className}>
      <button onClick={onOpen} className="px-3 bg-white hover:text-gray-500 text-gray-400 text-base rounded outline">
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
      <button name="favorite" value={favorite ? 'false' : 'true'} className="text-gray-400">
        {favorite ? '★' : '☆'}
      </button>
    </fetcher.Form>
  )
}
