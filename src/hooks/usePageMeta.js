import { useEffect } from 'react'

/**
 * usePageMeta — sets document.title and meta[name="description"]
 * on every page for basic on-page SEO.
 *
 * @param {string} title       — page title (appended with " | MK 1974")
 * @param {string} description — meta description content
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    // Title
    document.title = title ? `${title} | MK 1974` : 'MK 1974 — Built for the Street'

    // Description
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute(
      'content',
      description ||
        'MK 1974 — Premium tracksuits, jerseys and street-ready clothing engineered for motion.'
    )
  }, [title, description])
}
