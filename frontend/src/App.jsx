import * as React from 'react'
import { ChakraProvider, Heading } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Heading>I'm a Heading</Heading>
    </ChakraProvider>
  )
}

export default App;
