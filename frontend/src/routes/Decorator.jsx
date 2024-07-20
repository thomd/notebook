import React, { useState } from 'react'
import { Outlet, useLoaderData } from 'react-router-dom'
import { SearchModal } from '../components/Search'
import { FavoritesMenu } from '../components/Favorites'
import { NewPageForm } from '../components/NewPage'
import { Footer } from '../components/Footer'
import { EditButton, DeleteButton } from '../components/Actions'
import { getPages } from '../pages'
import { useHashEditPageLink, useScrollIntoView } from '../hooks/scroll'

export async function loader({ request }) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const pages = await getPages(q)
  return { pages, q }
}

export default function Decorator() {
  const { pages, q } = useLoaderData()
  const [currentPage, setCurrentPage] = useState()
  useHashEditPageLink()
  useScrollIntoView()

  return (
    <>
      <SearchModal />
      <div className="contentarea p-4">
        <Outlet context={[currentPage, setCurrentPage]} />
      </div>
      <div className="footer p-4">
        <Footer filename={currentPage?.filename} />
      </div>
    </>
  )
}
