import { useApp } from '../../context/AppContext'

export default function Newsletter() {
  const { showToast } = useApp()
  const handleSubmit = (e) => {
    e.preventDefault()
    e.target.reset()
    showToast('You\'re on the list! Welcome to MK 1974.')
  }

  return (
    <section id="newsletter" className="bg-surface2 border-t border-black/[0.05] py-20 px-8 md:px-12">
      <div className="max-w-[700px] mx-auto text-center">
        <p className="eyebrow mb-4">Stay in the Loop</p>
        <h2 className="font-playfair font-black italic text-black mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
          Join the MK 1974 Family
        </h2>
        <p className="text-black/50 text-[0.88rem] font-light leading-[1.8] mb-10">
          Be first to know about new drops, exclusive sales, and members-only offers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 bg-surface border border-black/10 text-onlight placeholder-muted text-[0.82rem] px-5 py-3.5 focus:outline-none focus:border-lime/40 focus:ring-1 focus:ring-lime/40 transition-all rounded-sm shadow-sm"
          />
          <button type="submit" className="btn-primary whitespace-nowrap rounded-sm shadow-md hover:shadow-lg">
            Subscribe
          </button>
        </form>
        <p className="text-muted text-[0.65rem] mt-4 tracking-[0.1em]">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
