import { useEffect, useRef, useState } from 'react'

/**
 * useScrollReveal — attaches an IntersectionObserver to a ref.
 * Returns { ref, isVisible } where isVisible flips true once the
 * element enters the viewport (and stays true).
 */
export default function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // only fire once
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px', ...options }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, isVisible }
}
