import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import model from '../../assets/mk.png'

const HERO_IMAGES = [
  model,
  '/lifestyle.png',
  '/hero.png'
]

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="hero" className="relative h-screen min-h-[600px] overflow-hidden bg-surface2">
      <div 
        className="absolute inset-0 flex transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {HERO_IMAGES.map((img, idx) => (
          <div key={img} className="relative w-full h-full shrink-0">
            <img 
              src={img} 
              alt={`MK 1974 Hero ${idx}`} 
              className="w-full h-full object-cover object-[60%_top]"  
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16 md:pb-20 z-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="animate-fade-up">
            <p className="eyebrow mb-5">SS 2025 — New Collection</p>
            <h1 className="font-playfair font-black italic leading-[0.88] tracking-[-0.02em] text-cream" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
              Built for<br />
              <span className="not-italic" style={{ WebkitTextStroke: '1.5px #968574', color: 'transparent' }}>
                the Street.
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6 shrink-0 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <p className="text-cream/50 text-[0.85rem] font-light tracking-[0.08em] leading-[1.8] max-w-[260px] md:text-right">
              Premium tracksuits &amp; joggers<br />engineered for motion.
            </p>
            <Link to="/shop" className="btn-primary group">
              Shop Now
              <svg className="transform transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4">
        <div className="text-white/25 text-[0.55rem] font-medium tracking-[0.35em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll to explore</div>
        <div className="w-[1px] h-16 bg-white/15 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full bg-lime animate-[scrollLine_2s_ease-in-out_infinite]" style={{ height: '40%' }} />
        </div>
      </div>
    </section>
  )
}
