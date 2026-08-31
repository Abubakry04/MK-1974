import { useEffect } from 'react'

const SITE_NAME  = 'MK 1974'
const BASE_URL   = 'https://mk1974.com'
const DEFAULT_OG = `${BASE_URL}/og-image.png`

/**
 * usePageMeta — Sets all on-page SEO signals for a given page.
 *
 * @param {string}  title       - Raw page title. Formatted as "{title} | MK 1974".
 * @param {string}  description - Meta description (≤160 chars recommended).
 * @param {object}  [opts]
 * @param {string}  [opts.canonical]  - Full canonical URL. Defaults to current href.
 * @param {string}  [opts.ogImage]    - Absolute OG image URL. Defaults to site default.
 * @param {string}  [opts.ogType]     - OG type. Defaults to 'website'.
 * @param {boolean} [opts.noindex]    - Set true for private/transactional pages.
 * @param {object}  [opts.jsonLd]     - Optional JSON-LD object injected as <script>.
 */
export default function usePageMeta(title, description, opts = {}) {
  const {
    canonical  = typeof window !== 'undefined' ? window.location.href : BASE_URL,
    ogImage    = DEFAULT_OG,
    ogType     = 'website',
    noindex    = false,
    jsonLd     = null,
  } = opts

  useEffect(() => {
    // ── Helpers ────────────────────────────────────────────────────────────
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [attrName, attrValue] = selector.match(/\[([^=]+)="([^"]+)"\]/)?.slice(1) || []
        if (attrName) el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`)
      if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el) }
      el.setAttribute('href', href)
    }

    const fullTitle = title
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : `${SITE_NAME} — New Lagos Streetwear Brand`

    const desc = description || 'MK 1974 — Premium tracksuits, jerseys and street-ready clothing engineered for motion.'

    // ── Title ──────────────────────────────────────────────────────────────
    document.title = fullTitle

    // ── Meta description ───────────────────────────────────────────────────
    setMeta('meta[name="description"]', 'content', desc)

    // ── Robots ─────────────────────────────────────────────────────────────
    setMeta('meta[name="robots"]', 'content',
      noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    )

    // ── Canonical ──────────────────────────────────────────────────────────
    setLink('canonical', canonical)

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]',       'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', desc)
    setMeta('meta[property="og:url"]',         'content', canonical)
    setMeta('meta[property="og:image"]',       'content', ogImage)
    setMeta('meta[property="og:type"]',        'content', ogType)
    setMeta('meta[property="og:site_name"]',   'content', SITE_NAME)

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]',       'content', fullTitle)
    setMeta('meta[name="twitter:description"]', 'content', desc)
    setMeta('meta[name="twitter:image"]',       'content', ogImage)

    // ── JSON-LD structured data ────────────────────────────────────────────
    const LD_ID = 'page-jsonld'
    let ldScript = document.getElementById(LD_ID)
    if (jsonLd) {
      if (!ldScript) {
        ldScript = document.createElement('script')
        ldScript.type = 'application/ld+json'
        ldScript.id   = LD_ID
        document.head.appendChild(ldScript)
      }
      ldScript.textContent = JSON.stringify(jsonLd)
    } else if (ldScript) {
      ldScript.remove()
    }
  }, [title, description, canonical, ogImage, ogType, noindex, jsonLd])
}
