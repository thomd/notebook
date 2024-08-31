import { useRef } from 'react'
import { useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

export function HelpModal({ className }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = useRef(null)

  const openHelpModal = () => {
    onOpen()
  }
  useHotkeys(['h'], openHelpModal)

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
                    <kbd className="px-1.5 py-0.5 font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">H</kbd> Help
                  </li>
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
                </ul>
              </section>
              <section>
                <h1 className="mb-4 mt-12 font-bold">Tools</h1>
                <ul className="mb-8">
                  <li className="mb-1">
                    Star: ★ <code className="bg-gray-200 py-[1px] px-1">&amp;#x2605;</code>
                  </li>
                  <li className="mb-1">Dot ●, ○ </li>
                  <li className="mb-1">
                    Command: ⌘ <code className="bg-gray-200 py-[1px] px-1">&amp;#8984;</code>
                  </li>
                  <li className="mb-1">Shift: ⇧</li>
                  <li className="mb-1"> Option: ⌥ </li>
                  <li className="mb-1">Control: ⌃</li>
                  <li className="mb-1">Caps Lock: ⇪</li>
                </ul>
                <ul>
                  <li className="mb-1">
                    <a className="text-[#3f8c08]" href="https://tinyurl.com">
                      URL Shortener
                    </a>
                  </li>
                  <li className="mb-1">
                    <a className="text-[#3f8c08]" href="https://asciiflow.com">
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
