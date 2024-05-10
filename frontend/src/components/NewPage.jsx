import { useState, useRef, useEffect } from "react"
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input } from '@chakra-ui/react'

export function NewButton() {
  return (
    <>
      <Form method="post">
        <button type="submit" className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">New Page</button>
      </Form>
    </>
  );
}

// https://v1.chakra-ui.com/docs/components/overlay/modal
export function NewModal() {
  const SearchOverlay = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const [search, openSearch] = useState(<SearchOverlay />)
  return (
    <Modal isCentered initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      {search}
      <ModalContent>
        <ModalHeader>Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <Input ref={initialRef} placeholder='Search' />
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}


