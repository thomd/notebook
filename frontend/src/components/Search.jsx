import React, { useState, useRef } from "react"
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export function Search() {
    return (
        <div id="search">TODO: Search</div>
    );
}

export default function SearchModal() {
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

