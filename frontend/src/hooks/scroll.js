import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ScrollMirror from 'scrollmirror'

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

export function useScrollMirror() {
  useEffect(() => {
    new ScrollMirror(document.querySelectorAll('.scroll-mirror'))
  }, [])
}
