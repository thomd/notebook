import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export function HelpModal({ className }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useHotkeys(['h', 'shift+?'], () => {
    onOpen()
  })

  return (
    <div className={className}>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Help</ModalHeader>
          <ModalCloseButton style={{ boxShadow: 'none' }} />
          <ModalBody>
            <div className="text-gray-600 pb-8">
              <section>
                <h1 className="mb-4 font-bold">Keyboard Shortcuts</h1>
                <ul className="mb-8">
                  <li className="mb-2">
                    Edit Page with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">E</kbd>
                  </li>
                  <li className="mb-2">
                    Delete Page with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">D</kbd>
                  </li>
                  <li className="mb-2">
                    Scroll Page to Top with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Q</kbd>
                  </li>
                  <li className="mb-2">
                    Scroll Page to Bottom with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">W</kbd>
                  </li>
                  <li className="mb-2">
                    Open Index Page with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">I</kbd> or{' '}
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">esc</kbd>
                  </li>
                  <li className="mb-2">
                    Toggle Page Navigation with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">N</kbd>
                  </li>
                  <li className="mb-2">
                    Search with <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">S</kbd> or{' '}
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">/</kbd>
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
              <section>
                <h1 className="mb-4 mt-12 font-bold">KaTeX</h1>
                <ul>
                  <li className="mb-1">
                    <a className="hover:text-sky-700 text-sky-800" href="https://katex.org/docs/supported.html" target="_blank" rel="noreferrer">
                      Supported Functions
                    </a>
                  </li>
                  <li className="mb-1">
                    <a className="hover:text-sky-700 text-sky-800" href="https://github.com/KaTeX/KaTeX/wiki/Package-Emulation" target="_blank" rel="noreferrer">
                      Package Emulation
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
