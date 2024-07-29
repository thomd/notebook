import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0)
    //document.body.classList.remove('scroll-up', 'scroll-down')
  }, [])
}

export function useHashEditPageLink() {
  useEffect(() => {
    document.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'A' && ev.target.attributes.href.value.startsWith('edit')) {
        const hash = ev.target.previousSibling.id
        ev.target.attributes.href.value += ev.target.attributes.href.value.includes('#') ? '' : '#' + hash
      }
    })
  }, [])
}

export function useScrollIntoView() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.substring(1))
      target?.parentNode?.scrollIntoView({ behavior: 'auto' })
    }
  }, [pathname, hash])
}

export function useScrollHeader() {
  useEffect(() => {
    let lastScroll = 0
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset
      if (currentScroll <= 0) {
        document.body.classList.remove('scroll-up')
        return
      }
      if (currentScroll > lastScroll && !document.body.classList.contains('scroll-down')) {
        document.body.classList.remove('scroll-up')
        document.body.classList.add('scroll-down')
      } else if (currentScroll < lastScroll && document.body.classList.contains('scroll-down')) {
        document.body.classList.remove('scroll-down')
        document.body.classList.add('scroll-up')
        //setTimeout(() => {
        //document.body.classList.remove('scroll-up')
        //document.body.classList.add('scroll-down')
        //}, 2000)
      }
      lastScroll = currentScroll
    })
  })
}
