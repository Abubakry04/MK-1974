import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import usePageMeta from '../hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta(
    'Page Not Found — MK 1974',
    'This page does not exist. Head back to the MK 1974 homepage or browse the full collection.',
    { noindex: true }
  )

  return (
    <>
      <Nav />
      <main className="bg-surface min-h-screen flex flex-col items-center justify-center px-8 text-center text-dark pt-20">

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

        <p className="text-dark/60 text-sm max-w-[360px] leading-relaxed mb-8 font-medium">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Here are some helpful links:
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link to="/" className="btn-primary">Go home</Link>
          <Link to="/shop" className="btn-ghost">Shop all</Link>
        </div>

        {/* Secondary internal links */}
        <nav aria-label="Helpful links" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { label: 'New Arrivals', to: '/shop?sort=newest' },
            { label: 'About MK 1974', to: '/about' },
            { label: 'Contact Us', to: '/contact' },
            { label: 'Track Order', to: '/order-tracking/lookup' },
          ].map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className="text-dark/50 hover:text-dark text-xs font-semibold underline underline-offset-2 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  )
}
