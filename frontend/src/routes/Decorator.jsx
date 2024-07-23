import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SearchModal } from '../components/Search'
import { Footer } from '../components/Footer'
import { useHashEditPageLink, useScrollIntoView } from '../hooks/scroll'

export default function Decorator() {
  const [currentPage, setCurrentPage] = useState()
  useHashEditPageLink()
  useScrollIntoView()

  return (
    <>
      <SearchModal />
      <div className="contentarea">
        <Outlet context={[currentPage, setCurrentPage]} />
      </div>
      <div className="footer">
        <Footer filename={currentPage?.filename} />
      </div>
    </>
  )
}
