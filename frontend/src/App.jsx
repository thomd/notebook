import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Decorator from './pages/Decorator'
import Error from './Error'
import Index, { loader as indexLoader } from './pages/Index'
import Page, { loader as pageLoader, action as pageAction } from './pages/Page'
import PageEdit, { action as pageEditAction } from './pages/PageEdit'
import { action as pageDeleteAction } from './pages/PageDelete'
import { action as newPageAction } from './pages/PageNew'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Decorator />,
    errorElement: <Error />,
    children: [
      {
        errorElement: <Error />,
        children: [
          {
            index: true,
            element: <Index />,
            loader: indexLoader,
          },
          {
            path: 'pages/:pageId',
            element: <Page />,
            loader: pageLoader,
            action: pageAction,
          },
          {
            path: 'pages/:pageId/edit/:start/:end',
            element: <PageEdit />,
            loader: pageLoader,
            action: pageEditAction,
          },
          {
            path: 'pages/:pageId/edit',
            element: <PageEdit />,
            loader: pageLoader,
            action: pageEditAction,
          },
          {
            path: 'new',
            action: newPageAction,
          },
          {
            path: 'pages/:pageId/delete',
            action: pageDeleteAction,
            errorElement: <div>There was an error deleting the page.</div>,
          },
        ],
      },
    ],
  },
])

function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  )
}

export default App
