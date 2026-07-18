import { useEffect, useState } from 'react'

const COARSE_POINTER_QUERY = '(pointer: coarse)'

// Phones and most tablets have a coarse pointer. Desktops with a mouse have
// a fine pointer. We branch on this rather than user agent so the result
// stays correct on hybrid devices (e.g. detachable laptops).
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(COARSE_POINTER_QUERY).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(COARSE_POINTER_QUERY)
    const update = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  return isMobile
}
