import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta('Page Not Found', 'The page you are looking for does not exist.')

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen flex flex-col items-center justify-center px-8 text-center text-dark">
        {/* Large decorative 404 */}
        <div className="relative select-none mb-6">
          <p
            className="font-playfair font-black italic text-black/[0.04] leading-none pointer-events-none"
            style={{ fontSize: 'clamp(10rem, 30vw, 22rem)' }}
          >
            404
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-dark text-3xl md:text-4xl font-extrabold">
              Page not found
            </h1>
          </div>
        </div>

        <p className="text-dark/60 text-sm max-w-[300px] leading-relaxed mb-8 font-medium">
          The page you're looking for doesn't exist.
        </p>

        <div className="flex items-center gap-4">
          <Link to="/" className="btn-primary">Go home</Link>
          <Link to="/shop" className="btn-ghost">Shop</Link>
        </div>
      </main>
    </>
  )
}
