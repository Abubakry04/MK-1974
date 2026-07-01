export default function Marquee() {
  const items = ['TRACKSUITS', 'JOGGERS', 'PERFORMANCE FLEECE', 'STREET READY', 'SS 2025', 'FREE SHIPPING OVER £75', 'LIMITED DROPS']
  const doubled = [...items, ...items]

  return (
    <div className="border-y border-white/[0.06] py-4 overflow-hidden bg-surface" aria-hidden="true">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8 mx-8">
            <span className="text-[0.62rem] font-medium tracking-[0.35em] uppercase text-muted-light">
              {item}
            </span>
            <span className="text-lime text-[0.5rem]">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
