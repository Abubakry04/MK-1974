import { useApp } from '../../context/AppContext'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function Newsletter() {
  const { showToast } = useApp()
  const { ref, isVisible } = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    e.target.reset()
    showToast("You're on the list.")
  }

  return (
    <section
      id="newsletter"
      ref={ref}
      className="py-14 px-8 md:px-12 bg-dark"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="max-w-[700px] mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-cream mb-2">
          Be the first to know
        </h2>
        <p className="text-cream/50 text-sm mb-8">
          New drops, restocks and early access. MK 1974 just launched — don't miss what's next.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-[440px] mx-auto">
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 bg-white/5 border border-white/15 text-cream placeholder-cream/30 text-sm px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button type="submit" className="bg-cream text-dark text-sm font-semibold px-6 py-3 hover:bg-accent hover:text-white transition-colors whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}
