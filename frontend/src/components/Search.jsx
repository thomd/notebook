import { useState, useRef, useEffect } from "react"
import { Form, useNavigation, useSubmit } from "react-router-dom";
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, Input } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export function Search({ q }) {
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <Form className="relative">
      <input
        id="q"
        className={"block w-52 border-0 py-1 pr-2 pl-8 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none" + (searching ? " loading" : "")}
        placeholder="Search"
        type="search"
        name="q"
        defaultValue={q}
        onChange={(event) => {
          const isFirstSearch = q == null;
          submit(event.currentTarget.form, {
            replace: !isFirstSearch,
          });
        }}
      />
      <div className="search-spinner" hidden={!searching} />
    </Form>
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

