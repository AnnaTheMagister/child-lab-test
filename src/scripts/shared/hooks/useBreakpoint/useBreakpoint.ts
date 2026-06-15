import { useState, useEffect } from 'react'

export type Breakpoint = 'desktop' | 'tablet' | 'phone'

const QUERIES = {
  desktop: '(min-width: 1025px)',
  tablet: '(min-width: 769px)',
} as const

function getActiveBreakpoint(): Breakpoint {
  if (typeof window === 'undefined' || !window.matchMedia) return 'desktop'
  if (window.matchMedia(QUERIES.desktop).matches) return 'desktop'
  if (window.matchMedia(QUERIES.tablet).matches) return 'tablet'
  return 'phone'
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(getActiveBreakpoint)

  useEffect(() => {
    if (!window.matchMedia) return

    const mqlDesktop = window.matchMedia(QUERIES.desktop)
    const mqlTablet = window.matchMedia(QUERIES.tablet)

    const update = () => {
      if (mqlDesktop.matches) setBp('desktop')
      else if (mqlTablet.matches) setBp('tablet')
      else setBp('phone')
    }

    update()
    mqlDesktop.addEventListener('change', update)
    mqlTablet.addEventListener('change', update)

    return () => {
      mqlDesktop.removeEventListener('change', update)
      mqlTablet.removeEventListener('change', update)
    }
  }, [])

  return bp
}
