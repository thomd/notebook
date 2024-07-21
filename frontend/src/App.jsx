import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Decorator, { loader as decoratorLoader } from './routes/Decorator'
import Error from './Error'
import Index, { loader as indexLoader } from './routes/Index'
import Page, { loader as pageLoader, action as pageAction } from './routes/Page'
import Category, { loader as categoryLoader, action as categoryAction } from './routes/Category'
import PageEdit, { action as pageEditAction } from './routes/PageEdit'
import { action as pageDeleteAction } from './routes/PageDelete'
import { action as newPageAction } from './routes/PageNew'
//import { useScrollHeader } from './hooks/scroll'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Decorator />,
    errorElement: <Error />,
    loader: decoratorLoader,
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
            path: 'categories/:categoryId',
            element: <Category />,
            loader: categoryLoader,
            action: categoryAction,
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
  //useScrollHeader()

  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  )
}

export default App
