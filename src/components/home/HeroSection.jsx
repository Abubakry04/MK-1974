import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  const [activeVariant, setActiveVariant] = useState(0)

  // 6 variants for the thumbnails on the right
  const variants = [
    { id: 0, filter: 'hue-rotate-0', name: 'Original' },
    { id: 1, filter: 'hue-rotate-[60deg]', name: 'Gold' },
    { id: 2, filter: 'hue-rotate-[220deg]', name: 'Blue' },
    { id: 3, filter: 'hue-rotate-[120deg]', name: 'Green' },
    { id: 4, filter: 'hue-rotate-[280deg]', name: 'Purple' },
    { id: 5, filter: 'grayscale', name: 'Carbon' },
  ]

  return (
    <section id="hero" className="relative h-screen min-h-[600px] overflow-hidden" style={{ backgroundColor: '#1a1a24' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .hero-title-bg {
          font-size: clamp(8rem, 25vw, 25rem);
          color: rgba(255, 255, 255, 0.03);
          line-height: 0.8;
          white-space: nowrap;
          pointer-events: none;
        }
        .hero-stripes-mask {
          mask-image: radial-gradient(ellipse 60% 80% at center, transparent 40%, black 65%);
          -webkit-mask-image: radial-gradient(ellipse 60% 80% at center, transparent 40%, black 65%);
        }
        .hover-scale { transition: transform 0.3s ease; }
        .hover-scale:hover { transform: scale(1.1); }
      `}</style>

      {/* HUGE BACKGROUND TEXT */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <h1 className="font-bebas hero-title-bg tracking-tight">MK 1974</h1>
      </div>

      {/* VERTICAL STRIPES */}
      <div className="absolute inset-0 flex justify-center items-center gap-4 sm:gap-6 z-0 hero-stripes-mask pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-full w-12 sm:w-20 lg:w-28" style={{ backgroundColor: '#C38154' }} />
        ))}
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="relative max-w-[1440px] mx-auto w-full h-full min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 lg:px-16 py-24 pt-32 lg:py-20 gap-12 lg:gap-4">
        
        {/* LEFT: Text & Buttons */}
        <div className="w-full lg:flex-1 flex flex-col items-center lg:items-start justify-center text-center lg:text-left order-2 lg:order-1 animate-fade-up z-20">
          <h1 className="font-bebas text-white tracking-wide leading-[0.9] mb-4" style={{ fontSize: 'clamp(4rem, 10vw, 7rem)' }}>
            PREMIUM<br />JERSEY
          </h1>
          <p className="text-gray-400 font-inter text-sm md:text-base max-w-[320px] mb-8 leading-relaxed mx-auto lg:mx-0">
            Engineered for the streets. Premium materials and modern urban aesthetics combine to create our most advanced jersey collection yet.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/shop" className="px-8 py-3 rounded-full text-black font-semibold text-sm transition-transform hover:scale-105" style={{ backgroundColor: '#F2A900' }}>
              Buy Now
            </Link>
            <Link to="/about" className="px-8 py-3 rounded-full text-white font-semibold text-sm border border-gray-500 hover:border-white transition-colors">
              More &gt;
            </Link>
          </div>
        </div>

        {/* CENTER: Floating Image */}
        <div className="w-full lg:w-[45%] h-[350px] sm:h-[450px] lg:h-[700px] relative order-1 lg:order-2 flex items-center justify-center" style={{ mixBlendMode: 'lighten' }}>
          <img 
            src="/hero_jersey.png" 
            alt="Premium Jersey" 
            className={`w-full h-full object-contain ${variants[activeVariant].filter} transition-all duration-700 ease-in-out`}
            style={{ 
              animation: 'float 6s ease-in-out infinite' 
            }} 
          />
        </div>

        {/* RIGHT: Thumbnail Variants */}
        <div className="w-full lg:flex-1 flex justify-center lg:justify-end items-center order-3 relative z-20" style={{ mixBlendMode: 'lighten' }}>
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-4 lg:gap-6">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVariant(v.id)}
                className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all ${
                  activeVariant === v.id ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-gray-700 hover:border-gray-400'
                }`}
                style={{ backgroundColor: '#1a1a24' }}
              >
                <img 
                  src="/hero_jersey.png" 
                  alt={v.name} 
                  className={`w-[150%] h-[150%] object-cover object-center ${v.filter}`}
                />
              </button>
            ))}
          </div>
        </div>

      </div>
      
      {/* CSS Animation for Floating */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  )
}
