import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import rehypeNavigation from 'rehype-navigation'

const [minWidth, maxWidth, defaultWidth] = [0, 800, 350]

export default function Navigation({ content }) {
  const isResized = useRef(false)
  const [width, setWidth] = useState(parseInt(localStorage.getItem('sidebarWidth')) || defaultWidth)

  useEffect(() => {
    localStorage.setItem('sidebarWidth', width)
  }, [width])

  useEffect(() => {
    window.addEventListener('mousemove', (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
      if (!isResized.current) {
        return false
      }
      setWidth((previousWidth) => {
        const newWidth = previousWidth + ev.movementX / 2
        const isWidthInRange = newWidth > minWidth && newWidth < maxWidth
        return isWidthInRange ? newWidth : previousWidth
      })
    })

    window.addEventListener('mouseup', (ev) => {
      isResized.current = false
    })
  }, [])

  return (
    <div className="flex">
      <div style={{ width: `${width / 16}rem` }}>
        <Markdown
          rehypePlugins={[rehypeSlug, [rehypeNavigation, { extract: true, wrapperTag: 'nav', maxDepth: 2, fullMonty: false }]]}
          remarkRehypeOptions={{ allowDangerousHtml: true }}>
          {content}
        </Markdown>
      </div>
      <div
        className="w-2 cursor-col-resize hover:bg-slate-100"
        onMouseDown={(ev) => {
          isResized.current = true
          ev.stopPropagation()
          ev.preventDefault()
          return false
        }}
      />
    </div>
  )
}
