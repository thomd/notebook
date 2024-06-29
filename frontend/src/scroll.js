import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export function useScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.body.classList.remove('scroll-up', 'scroll-down')
  }, [pathname])
}

export const scrollMenu = () => {
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
    }
    lastScroll = currentScroll
  })
}
