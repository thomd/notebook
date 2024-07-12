import React, { useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { Search } from '../components/Search'
import Navigation from '../components/Navigation'
import { NewPageForm } from '../components/NewPage'
import { EditButton, DeleteButton } from '../components/Actions'
import { getPages } from '../pages'
import { useScrollToTop, useHashEditPageLink, useScrollIntoView } from '../hooks/scroll'

export async function loader({ request }) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const pages = await getPages(q)
  return { pages, q }
}

export default function Decorator() {
  const { pages, q } = useLoaderData()
  const [pageTitle, setPageTitle] = useState()

  useScrollToTop()
  useHashEditPageLink()
  useScrollIntoView()

  return (
    <>
      <div className="menu-wrapper header flex flex-nowrap justify-between items-center">
        <Search q={q} />
        <EditButton />
        <DeleteButton pageTitle={pageTitle} />
        <NewPageForm />
      </div>
      <div className="navigation">
        <Navigation pages={pages} />
      </div>
      <div className="content">
        <Outlet context={[pageTitle, setPageTitle]} />
      </div>
      <div className="footer">
        <a className="text-sm text-gray-400" href="https://github.com/thomd/notebook-notes">
          https://github.com/thomd/notebook-notes
        </a>
      </div>
    </>
  )
}
