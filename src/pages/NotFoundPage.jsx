import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('Page Not Found', 'The page you are looking for does not exist.')

  return (
    <>
      <Nav />
      <main className="bg-dark min-h-screen flex flex-col items-center justify-center px-8 text-center">
        {/* Large decorative 404 */}
        <div className="relative select-none mb-6">
          <p
            className="font-playfair font-black italic text-white/[0.04] leading-none pointer-events-none"
            style={{ fontSize: 'clamp(10rem, 30vw, 22rem)' }}
          >
            404
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-lime" />
              <p className="text-lime text-[0.6rem] font-semibold tracking-[0.4em] uppercase">
                Page Not Found
              </p>
              <div className="w-6 h-px bg-lime" />
            </div>
            <h1
              className="font-playfair font-black italic text-cream leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Lost in the Streets.
            </h1>
          </div>
        </div>

        <p className="text-cream/40 text-[0.85rem] font-light max-w-[320px] leading-[1.8] mb-10">
          The page you're looking for has moved, or never existed. Let's get you back to something good.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/" className="btn-primary">
            Go Home
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link to="/shop" className="btn-ghost">
            Shop Now
          </Link>
        </div>

        {/* Decorative accent */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20">
          <div className="w-12 h-px bg-cream/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-lime" />
          <div className="w-12 h-px bg-cream/40" />
        </div>
      </main>
    </>
  )
}
