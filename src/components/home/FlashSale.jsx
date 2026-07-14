import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ h: 4, m: 45, s: 30 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev
        if (s > 0) s--
        else if (m > 0) { s = 59; m-- }
        else if (h > 0) { m = 59; h--; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-dark py-4 px-8 flex flex-col md:flex-row items-center justify-center gap-4 relative overflow-hidden border-b border-black/5">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:100px_100px] animate-[marqueeScroll_10s_linear_infinite]" />
      <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-cream flex items-center gap-3 relative z-10">
        <span className="w-2 h-2 rounded-full bg-lime animate-pulse shadow-[0_0_8px_#968574]"></span>
        ⚡ Flash Sale — 20% Off All Items
      </span>
      <div className="flex items-center gap-4 relative z-10">
        <div className="flex gap-1.5 text-[0.7rem] font-black tracking-widest text-lime bg-white/5 px-3 py-1.5 rounded-sm backdrop-blur-md">
          <span>{String(timeLeft.h).padStart(2, '0')}H</span> : 
          <span>{String(timeLeft.m).padStart(2, '0')}M</span> : 
          <span>{String(timeLeft.s).padStart(2, '0')}S</span>
        </div>
        <span className="text-[0.65rem] font-black tracking-[0.3em] uppercase text-cream/30 hidden md:inline">|</span>
        <Link to="/shop" className="text-[0.65rem] font-bold tracking-[0.2em] uppercase text-cream hover:text-lime transition-colors underline underline-offset-4 decoration-lime/40 hover:decoration-lime">Shop Now →</Link>
      </div>
    </div>
  )
}
