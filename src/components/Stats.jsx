import { useEffect, useRef, useState } from 'react'

const stats = [
  { target: 12, suffix: '', label: 'Collections Dropped' },
  { target: 48, suffix: 'K+', label: 'Pieces Sold' },
  { target: 97, suffix: '%', label: '5-Star Reviews' },
  { target: 34, suffix: '', label: 'Countries Shipped' },
]

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1600
        const step = target / (duration / 16)
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + step, target)
          setCount(Math.floor(current))
          if (current >= target) clearInterval(timer)
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref} className="block font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2.5rem,4vw,3.5rem)' }}>
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="bg-surface border-y border-white/[0.05] py-16">
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/[0.06]">
        {stats.map(s => (
          <div key={s.label} className="md:px-10 first:pl-0 last:pr-0">
            <Counter target={s.target} suffix={s.suffix} />
            <p className="text-muted text-[0.62rem] font-medium tracking-[0.2em] uppercase mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
