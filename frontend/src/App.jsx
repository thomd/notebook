import React from "react"
import { ChakraProvider, Heading } from '@chakra-ui/react'
import Search from './components/Search'

function App() {
  return (
    <ChakraProvider>
      <Heading>I'm a Heading</Heading>
      <Search />
    </ChakraProvider>
  )
}

export default App;
