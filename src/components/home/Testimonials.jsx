import { useState, useEffect, useRef } from 'react'
import { TESTIMONIALS } from '../../data/products'
import useScrollReveal from '../../hooks/useScrollReveal'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)
  const { ref, isVisible } = useScrollReveal()
  const total = TESTIMONIALS.length

  const prev = () => setCurrent(c => (c - 1 + total) % total)
  const next = () => setCurrent(c => (c + 1) % total)

  // Auto-advance every 5s, pause on hover
  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % total), 5000)
    return () => clearInterval(timerRef.current)
  }, [paused, total])

  // 3-up visible on md, 1-up on mobile
  const visible = [
    TESTIMONIALS[current % total],
    TESTIMONIALS[(current + 1) % total],
    TESTIMONIALS[(current + 2) % total],
  ]

  return (
    <section
      id="testimonials"
      ref={ref}
      className="bg-surface2 py-20 px-8 md:px-12 overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)',
      }}
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-6">
          <div>
            <p className="eyebrow mb-3">Real Reviews</p>
            <h2
              className="font-playfair font-black italic text-black"
              style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}
            >
              What Our Customers Say
            </h2>
          </div>
          {/* Arrow controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-11 h-11 border border-black/15 text-black/50 hover:border-black/40 hover:text-black flex items-center justify-center transition-all duration-200 hover:-translate-x-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="w-11 h-11 border border-black/15 text-black/50 hover:border-black/40 hover:text-black flex items-center justify-center transition-all duration-200 hover:translate-x-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {visible.map((t, idx) => (
            <div
              key={`${current}-${idx}`}
              className="bg-white border border-black/[0.06] p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-500"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                animation: 'testimonialIn 0.45s cubic-bezier(.16,1,.3,1) forwards',
                animationDelay: `${idx * 60}ms`,
              }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#968574" stroke="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-[0.88rem] font-light leading-[1.8] mb-6 italic"
                style={{ color: 'rgba(26,26,26,0.75)' }}
              >
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between border-t border-black/[0.05] pt-5">
                <div>
                  <p className="font-semibold text-[0.78rem]" style={{ color: '#1A1A1A' }}>{t.name}</p>
                  <p className="text-muted text-[0.7rem] mt-0.5">{t.location} · {t.product}</p>
                </div>
                <span className="text-muted text-[0.65rem] tracking-[0.1em]">{t.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current % total
                  ? 'w-6 h-2 bg-lime'
                  : 'w-2 h-2 bg-black/20 hover:bg-black/40'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonialIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
