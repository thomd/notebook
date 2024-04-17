import React, { useState, useRef } from "react"
import { ChakraProvider, Heading, useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

function App() {
  const SearchOverlay = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(10px) hue-rotate(90deg)'
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)
  const [search, openSearch] = useState(<SearchOverlay />)
  useHotkeys('shift+/', () => {
    openSearch(<SearchOverlay />)
    onOpen()
  })
  return (
    <ChakraProvider>
      <Heading>I'm a Heading</Heading>
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
    </ChakraProvider>
  )
}

export default App;
