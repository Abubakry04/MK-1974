import { useState, useEffect } from 'react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-20 md:bottom-8 right-6 z-[120] p-3 rounded-full bg-white text-dark border border-black/15 shadow-xl hover:bg-dark hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
