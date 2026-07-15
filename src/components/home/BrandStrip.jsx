export default function BrandStrip() {
  const items = ['Free delivery Over ₦75', 'Premium Quality Since 1974', 'Easy Returns Within 30 Days', 'Sustainably Sourced Materials', 'Free delivery Over ₦75', 'Premium Quality Since 1974']
  return (
    <div className="bg-surface border-y border-black/[0.07] overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {items.concat(items).map((item, i) => (
          <span key={i} className="text-[0.62rem] font-medium tracking-[0.3em] uppercase mx-10" style={{ color: 'rgba(26,26,26,0.45)' }}>
            {item} <span className="text-lime mx-4 animate-pulse">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
