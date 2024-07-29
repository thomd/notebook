import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SearchModal } from '../components/Search'
import { HelpModal } from '../components/Help'
import { useHashEditPageLink, useScrollIntoView } from '../hooks/scroll'

export default function Decorator() {
  const [currentPage, setCurrentPage] = useState()
  useHashEditPageLink()
  useScrollIntoView()

  return (
    <>
      <SearchModal />
      <HelpModal />
      <Outlet context={[currentPage, setCurrentPage]} />
    </>
  )
}
