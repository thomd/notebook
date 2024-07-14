import React, { useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { Search } from '../components/Search'
import Favorites from '../components/Favorites'
import { NewPageForm } from '../components/NewPage'
import { Footer } from '../components/Footer'
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
  const [currentPage, setCurrentPage] = useState()

  useScrollToTop()
  useHashEditPageLink()
  useScrollIntoView()

  return (
    <>
      <div className="menu-wrapper header flex flex-nowrap justify-between items-center">
        <Search q={q} />
        <div className="flex flex-nowrap">
          <EditButton />
          <DeleteButton pageTitle={currentPage?.title} />
          <NewPageForm />
        </div>
      </div>
      <div className="navigation">
        <Favorites pages={pages} />
      </div>
      <div className="content">
        <Outlet context={[currentPage, setCurrentPage]} />
      </div>
      <div className="footer">
        <Footer filename={currentPage?.filename} />
      </div>
    </>
  )
}
