import { useState } from 'react'
import { Link } from 'react-router-dom'
import TiltCard from '../TiltCard'

const VARIANTS = [
  { id: 0, name: 'Original', filter: 'hue-rotate-0',      bg: '#1a1a24', stripe: '#C38154', accent: '#F2A900', shadow: '#C38154' },
  { id: 1, name: 'Gold',     filter: 'hue-rotate-[60deg]', bg: '#1e1a10', stripe: '#b8a030', accent: '#d4b800', shadow: '#b8a030' },
  { id: 2, name: 'Blue',     filter: 'hue-rotate-[220deg]',bg: '#0f1525', stripe: '#2a4cb8', accent: '#3a6fff', shadow: '#2a4cb8' },
  { id: 3, name: 'Green',    filter: 'hue-rotate-[120deg]',bg: '#0f1e12', stripe: '#2a7a40', accent: '#38a855', shadow: '#2a7a40' },
  { id: 4, name: 'Purple',   filter: 'hue-rotate-[280deg]',bg: '#1a0e24', stripe: '#7a2ab8', accent: '#9b4dff', shadow: '#7a2ab8' },
  { id: 5, name: 'Carbon',   filter: 'grayscale',           bg: '#111111', stripe: '#444444', accent: '#aaaaaa', shadow: '#555555' },
]

export default function HeroSection() {
  const [activeVariant, setActiveVariant] = useState(0)
  const v = VARIANTS[activeVariant]

  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        backgroundColor: v.bg,
        transition: 'background-color 0.7s cubic-bezier(.16,1,.3,1)',
        /* Full screen on all sizes */
        height: '100svh',
        minHeight: '600px',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }

        /* ── Background watermark text ── */
        .hero-title-bg {
          font-size: clamp(7rem, 28vw, 25rem);
          color: rgba(255,255,255,0.03);
          line-height: 0.8;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }

        /* ── Stripe mask ── */
        .hero-stripes-mask {
          mask-image: radial-gradient(ellipse 60% 80% at center, transparent 40%, black 65%);
          -webkit-mask-image: radial-gradient(ellipse 60% 80% at center, transparent 40%, black 65%);
        }

        /* ── Float animation ── */
        @keyframes float {
          0%   { transform: translateY(0px) rotate(0deg) scale(1); }
          25%  { transform: translateY(-10px) rotate(0.4deg) scale(1.005); }
          50%  { transform: translateY(-20px) rotate(0deg) scale(1.01); }
          75%  { transform: translateY(-10px) rotate(-0.4deg) scale(1.005); }
          100% { transform: translateY(0px) rotate(0deg) scale(1); }
        }

        /* ── Mobile swatch scroll ── */
        .swatch-scroll::-webkit-scrollbar { display: none; }
        .swatch-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Fade up ── */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-up { animation: heroFadeUp 0.8s cubic-bezier(.16,1,.3,1) forwards; }
      `}</style>

      {/* ── Watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <span className="font-bebas hero-title-bg tracking-tight">MK 1974</span>
      </div>

      {/* ── Decorative stripes ── */}
      <div className="absolute inset-0 flex justify-center items-center gap-4 sm:gap-6 z-0 hero-stripes-mask pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-full w-10 sm:w-16 lg:w-28"
            style={{ backgroundColor: v.stripe, transition: 'background-color 0.7s cubic-bezier(.16,1,.3,1)' }}
          />
        ))}
      </div>

      {/* ════════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
      ════════════════════════════════ */}
      <div className="lg:hidden relative h-full flex flex-col z-10">

        {/* Jersey image — top 55% of screen */}
        <div
          className="relative flex-shrink-0"
          style={{ height: '55%' }}
        >
          <img
            src="/hero_jersey.png"
            alt="Premium Jersey"
            loading="eager"
            fetchPriority="high"
            className={`absolute inset-0 w-full h-full object-contain ${v.filter} transition-all duration-700`}
            style={{ animation: 'float 6s ease-in-out infinite' }}
          />
          {/* Gradient so text below reads clearly */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${v.bg})` }}
          />
        </div>

        {/* Text block — bottom portion */}
        <div className="flex-1 flex flex-col justify-between px-6 pb-6" style={{ zIndex: 2 }}>

          {/* Headline + subtitle */}
          <div className="hero-fade-up">
            {/* Eyebrow */}
            <p
              className="text-[0.58rem] font-bold tracking-[0.45em] uppercase mb-2"
              style={{ color: v.accent, transition: 'color 0.5s ease' }}
            >
              SS 2025 — {v.name}
            </p>

            <h1
              className="font-bebas text-white leading-[0.85] mb-3"
              style={{
                fontSize: 'clamp(3.2rem, 16vw, 5.5rem)',
                textShadow: `2px 2px 0px ${v.shadow}, 5px 5px 12px rgba(0,0,0,0.5)`,
                transition: 'text-shadow 0.7s cubic-bezier(.16,1,.3,1)',
              }}
            >
              PREMIUM<br />JERSEY
            </h1>

            <p className="text-white/40 text-[0.75rem] leading-[1.7] max-w-[280px] mb-5">
              Engineered for the streets. Premium materials for the modern era.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 mb-6">
              <Link
                to="/shop"
                className="px-6 py-2.5 rounded-full text-black font-bold text-[0.78rem] tracking-wide transition-all duration-500 active:scale-95"
                style={{
                  backgroundColor: v.accent,
                  boxShadow: `0 4px 20px ${v.accent}55`,
                  transition: 'background-color 0.6s ease, box-shadow 0.6s ease',
                }}
              >
                Shop Now
              </Link>
              <Link
                to="/about"
                className="px-6 py-2.5 rounded-full text-white font-semibold text-[0.78rem] border transition-all duration-300 active:scale-95"
                style={{ borderColor: `${v.accent}50` }}
              >
                Our Story
              </Link>
            </div>
          </div>

          {/* ── Colour swatch strip ── */}
          <div>
            <p className="text-white/30 text-[0.55rem] tracking-[0.35em] uppercase mb-3">Select Colour</p>
            <div className="swatch-scroll flex gap-3 overflow-x-auto pb-1">
              {VARIANTS.map((variant) => {
                const isActive = activeVariant === variant.id
                return (
                  <button
                    key={variant.id}
                    onClick={() => setActiveVariant(variant.id)}
                    aria-label={`Select ${variant.name}`}
                    title={variant.name}
                    className="flex-shrink-0 flex flex-col items-center gap-1.5"
                  >
                    {/* Swatch circle */}
                    <div
                      className="rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        width: isActive ? 52 : 44,
                        height: isActive ? 52 : 44,
                        border: `2px solid ${isActive ? variant.accent : 'rgba(255,255,255,0.12)'}`,
                        boxShadow: isActive ? `0 0 16px ${variant.accent}66` : 'none',
                        transition: 'all 0.35s cubic-bezier(.16,1,.3,1)',
                      }}
                    >
                      <img
                        src="/hero_jersey.png"
                        alt={variant.name}
                        className={`w-[160%] h-[160%] object-cover object-center -translate-x-[18%] -translate-y-[10%] ${variant.filter}`}
                      />
                    </div>
                    {/* Label */}
                    <span
                      className="text-[0.5rem] font-semibold tracking-[0.2em] uppercase transition-all duration-300"
                      style={{ color: isActive ? variant.accent : 'rgba(255,255,255,0.3)' }}
                    >
                      {variant.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════
          DESKTOP LAYOUT  (hidden below lg)
      ════════════════════════════════ */}
      <div className="hidden lg:flex relative max-w-[1440px] mx-auto w-full h-full items-center justify-between px-16 py-20 gap-4 z-10">

        {/* LEFT: Text */}
        <div className="flex-1 flex flex-col items-start justify-center text-left animate-fade-up">
          <p
            className="text-[0.6rem] font-bold tracking-[0.45em] uppercase mb-4"
            style={{ color: v.accent, transition: 'color 0.5s ease' }}
          >
            SS 2025 — {v.name}
          </p>
          <h1
            className="font-bebas text-white tracking-wide leading-[0.88] mb-5 hover:scale-105 transition-transform duration-500"
            style={{
              fontSize: 'clamp(4.5rem, 10vw, 8rem)',
              textShadow: `3px 3px 0px ${v.shadow}, 6px 6px 0px rgba(0,0,0,0.3), 9px 9px 15px rgba(0,0,0,0.5)`,
              transition: 'text-shadow 0.7s cubic-bezier(.16,1,.3,1)',
            }}
          >
            PREMIUM<br />JERSEY
          </h1>
          <p className="text-gray-400 text-sm max-w-[320px] mb-8 leading-relaxed">
            Engineered for the streets. Premium materials and modern urban aesthetics combine to create our most advanced jersey collection yet.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-3 rounded-full text-black font-semibold text-sm transition-all duration-500 hover:scale-105"
              style={{ backgroundColor: v.accent, boxShadow: `0 4px 20px ${v.accent}55` }}
            >
              Buy Now
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 rounded-full text-white font-semibold text-sm border hover:scale-105 transition-all duration-300"
              style={{ borderColor: `${v.accent}60` }}
            >
              More &gt;
            </Link>
          </div>
        </div>

        {/* CENTER: Jersey */}
        <div
          className="w-[42%] h-[700px] flex items-center justify-center"
        >
          <TiltCard className="w-full h-full" maxRotation={15} scale={1.05}>
            <img
              src="/hero_jersey.png"
              alt="Premium Jersey"
              loading="eager"
              fetchPriority="high"
              className={`w-full h-full object-contain ${v.filter} transition-all duration-700 ease-in-out`}
              style={{ animation: 'float 6s ease-in-out infinite' }}
            />
          </TiltCard>
        </div>

        {/* RIGHT: Variant thumbnails */}
        <div
          className="flex-1 flex justify-end items-center"
        >
          <div className="grid grid-cols-2 gap-5">
            {VARIANTS.map((variant) => {
              const isActive = activeVariant === variant.id
              return (
                <button
                  key={variant.id}
                  onClick={() => setActiveVariant(variant.id)}
                  aria-label={`Select ${variant.name}`}
                  title={variant.name}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden transition-all duration-300"
                    style={{
                      border: `2px solid ${isActive ? variant.accent : 'rgba(255,255,255,0.15)'}`,
                      boxShadow: isActive ? `0 0 20px ${variant.accent}66` : 'none',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.35s cubic-bezier(.16,1,.3,1)',
                    }}
                  >
                    <img
                      src="/hero_jersey.png"
                      alt={variant.name}
                      className={`w-[160%] h-[160%] object-cover object-center -translate-x-[18%] -translate-y-[10%] ${variant.filter}`}
                    />
                  </div>
                  <span
                    className="text-[0.52rem] font-bold tracking-[0.25em] uppercase transition-all duration-300"
                    style={{ color: isActive ? variant.accent : 'rgba(255,255,255,0.3)' }}
                  >
                    {variant.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
