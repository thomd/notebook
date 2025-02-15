import { useEffect, useRef } from 'react'
import { useLoaderData, useOutletContext, useNavigate } from 'react-router-dom'
import { getPages, getPage, patchPage } from '../services/pages'
import { Favorite } from '../components/Actions'
import Breadcrumb from '../components/Breadcrumb'
import Navigation from '../components/Navigation'
import { FavoritesMenu } from '../components/Favorites'
import { EditButton, DeleteButton } from '../components/Actions'
import MarkdownViewer from '../components/Markdown'
import { Footer } from '../components/Footer'
import { useHotkeys } from 'react-hotkeys-hook'
import { ScrollRestoration } from 'react-router-dom'
import useLocalStorageState from 'use-local-storage-state'

export async function loader({ params }) {
  const pages = await getPages()
  const page = await getPage(params)
  if (!page) {
    throw new Response('', { status: 404, statusText: 'Page Not Found' })
  }
  return { pages, page }
}

export async function action({ request, params }) {
  let formData = await request.formData()
  return patchPage(params, {
    favorite: formData.get('favorite') === 'true',
  })
}

const [collapsedWidth, minWidth, maxWidth, defaultWidth] = [32, 120, 500, 320]

export default function Page() {
  const [currentPage, setCurrentPage] = useOutletContext() // eslint-disable-line no-unused-vars
  const { pages, page } = useLoaderData()
  const navigate = useNavigate()

  useHotkeys('q', () => {
    window.scrollTo(0, 0)
  })

  useHotkeys('w', () => {
    window.scrollTo(0, document.body.scrollHeight)
  })

  useHotkeys('n', () => {
    if (collapsed) {
      showNavigation()
    } else {
      setCollapsed(true)
      setWidth(collapsedWidth)
    }
  })

  useHotkeys(['i', 'escape'], () => {
    navigate('/')
  })

  useEffect(() => {
    setCurrentPage(page)
  })

  const resizing = useRef(false)
  const [width, setWidth] = useLocalStorageState('notebook-sidebar-width', { defaultValue: defaultWidth })
  const [collapsed, setCollapsed] = useLocalStorageState('notebook-sidebar-collapsed', { defaultValue: false })

  const showNavigation = () => {
    setCollapsed(false)
    setWidth(defaultWidth)
  }

  const startNavigationResize = (ev) => {
    if (collapsed === true) {
      resizing.current = false
      showNavigation()
    } else {
      resizing.current = true
      ev.stopPropagation()
      ev.preventDefault()
    }
    return false
  }

  useEffect(() => {
    window.addEventListener('mousemove', (ev) => {
      if (!resizing.current) {
        return false
      }
      ev.stopPropagation()
      ev.preventDefault()
      const currentWidth = ev.clientX
      if (currentWidth < minWidth) {
        setCollapsed(true)
        setWidth(collapsedWidth)
      } else if (currentWidth > maxWidth) {
        setWidth(maxWidth)
      } else {
        setWidth(currentWidth)
      }
    })

    window.addEventListener('mouseup', (ev) => {
      resizing.current = false
    })
  }, [setWidth, setCollapsed])

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: `${width}px 4px 1fr` }}>
      <Navigation content={page.content} showNavigation={showNavigation} collapsed={collapsed} />
      <ResizeHandle startNavigationResize={startNavigationResize} />
      <div className="grid grid-rows-page z-10">
        <Header pages={pages} page={page} currentPage={currentPage} className="px-8" />
        <MarkdownViewer content={page.content} className="px-8 mb-12" preview={false} />
        <Footer filename={page?.filename} className="p-8" />
      </div>
    </div>
  )
}

function ResizeHandle({ startNavigationResize }) {
  return <div className="cursor-col-resize hover:bg-gray-300 hover:z-20" onMouseDown={startNavigationResize} />
}

function Header({ pages, page, currentPage, className }) {
  return (
    <div className={`${className} flex flex-nowrap justify-between items-center`}>
      <div className="flex flex-nowrap">
        <ScrollRestoration />
        <Breadcrumb pages={pages} page={page} />
        <Favorite page={page} className="ml-5" />
      </div>
      <div className="flex flex-nowrap">
        <FavoritesMenu pages={pages} className="mr-8" />
        <EditButton className="mr-5" />
        <DeleteButton pageTitle={currentPage?.title} />
      </div>
    </div>
  )
}
