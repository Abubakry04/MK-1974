import useScrollReveal from '../../hooks/useScrollReveal'

const REVIEWS = [
  {
    id: 1,
    name: 'Tunde A.',
    location: 'Lagos',
    rating: 5,
    text: "First brand I've seen from Lagos that actually looks and feels international. The tracksuit quality is no joke — worth every naira.",
    product: 'MK 1974 Tracksuit',
    date: 'Aug 2026',
  },
  {
    id: 2,
    name: 'Amaka O.',
    location: 'Abuja',
    rating: 5,
    text: "Saw it online, ordered the next day. The fit is clean, the fabric is heavy in a good way — this is not your average Lagos streetwear.",
    product: 'Launch Collection',
    date: 'Aug 2026',
  },
  {
    id: 3,
    name: 'Chukwuemeka D.',
    location: 'Port Harcourt',
    rating: 5,
    text: "I've been watching MK 1974 since before they launched. Finally got my hands on a piece and it didn't disappoint. Already ordered again.",
    product: 'MK 1974 Jersey',
    date: 'Aug 2026',
  },
]

export default function Testimonials() {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-14 px-8 md:px-12 bg-surface"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark">What people are saying</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(r => (
            <div key={r.id} className="border-l-2 border-accent pl-5 py-1">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(r.rating)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#8B8074">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </div>

              <p className="text-sm text-dark/75 leading-relaxed mb-4">
                "{r.text}"
              </p>

              <div>
                <p className="text-sm font-semibold text-dark">{r.name}</p>
                <p className="text-xs text-muted">{r.location} · {r.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
