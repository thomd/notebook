import { useRef } from 'react'
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export function HelpModal({ className }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)

  const openHelpModal = () => {
    onOpen()
  }
  useHotkeys(['h', 'shift+?'], openHelpModal)

  return (
    <div className={className}>
      <Modal isCentered initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="text-gray-600 pb-8" ref={initialRef}>
              <section>
                <h1 className="mb-4 font-bold">Keyboard Shortcuts</h1>
                <ul className="mb-8">
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">E</kbd> Edit Page
                  </li>
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">D</kbd> Delete Page
                  </li>
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Q</kbd> Scroll Page to Top
                  </li>
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">W</kbd> Scroll Page to Bottom
                  </li>
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">esc</kbd> Open Index
                  </li>
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">N</kbd> Toggle Page Navigation
                  </li>
                  <li className="mb-2">
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">/</kbd> Search
                  </li>
                </ul>
              </section>
              <section>
                <h1 className="mb-4 mt-12 font-bold">Tools</h1>
                <ul>
                  <li className="mb-1">
                    <a className="hover:text-sky-700 text-sky-800" href="https://tinyurl.com" target="_blank" rel="noreferrer">
                      URL Shortener
                    </a>
                  </li>
                  <li className="mb-1">
                    <a className="hover:text-sky-700 text-sky-800" href="https://asciiflow.com" target="_blank" rel="noreferrer">
                      ASCII Diagrams
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}
