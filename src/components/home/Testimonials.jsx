import { TESTIMONIALS } from '../../data/products'

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface2 py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Real Reviews</p>
          <h2 className="font-playfair font-black italic text-black" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-surface2 border border-black/[0.08] p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#968574" stroke="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <p className="text-[0.88rem] font-light leading-[1.8] mb-6 italic" style={{ color: 'rgba(26,26,26,0.75)' }}>"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[0.78rem]" style={{ color: '#1A1A1A' }}>{t.name}</p>
                  <p className="text-muted text-[0.7rem]">{t.location} · {t.product}</p>
                </div>
                <span className="text-muted text-[0.65rem]">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
