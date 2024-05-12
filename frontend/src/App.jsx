import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Decorator, { loader as decoratorLoader } from './routes/Decorator'
import Error from './Error'
import Index from './routes/Index'
import Page, { loader as pageLoader, action as pageAction } from './routes/Page'
import PageEdit, { action as pageEditAction } from './routes/PageEdit'
import { action as pageDeleteAction } from './routes/PageDelete'
import { action as newPageAction } from './routes/PageNew'

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
            element: <Index />
          },
          {
            path: 'pages/:pageId',
            element: <Page />,
            loader: pageLoader,
            action: pageAction,
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
        ]
      }
    ]
  },
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App;
