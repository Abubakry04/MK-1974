const items = [
  { img: '/lifestyle.png', alt: 'Trail ready shot', caption: 'Trail Ready', label: '001', tall: true },
  { img: '/product2.png', alt: 'Volt jacket close up', caption: 'Volt Jacket', label: '002', tall: false },
  { img: '/product3.png', alt: 'Shadow taper jogger', caption: 'Shadow Taper', label: '003', tall: false },
  { img: '/hero.png', alt: 'Apex tracksuit full look', caption: 'Apex Set', label: '004', wide: true },
]

export default function Lookbook() {
  return (
    <section id="lookbook" className="bg-dark py-24 md:py-32 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="eyebrow mb-3">Visual Stories</p>
            <h2 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)' }}>
              Lookbook
            </h2>
          </div>
          <p className="text-muted text-[0.7rem] font-light tracking-[0.15em] hidden md:block">
            Wear it. Live it.
          </p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4">
          {/* Large tall left */}
          <div className="col-span-2 md:col-span-5 md:row-span-2 relative overflow-hidden group" style={{ aspectRatio: undefined }}>
            <div className="h-[60vw] md:h-full min-h-[400px] relative">
              <img src={items[0].img} alt={items[0].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-end gap-4">
                <span className="text-lime text-[0.55rem] font-semibold tracking-[0.3em]">{items[0].label}</span>
                <span className="text-cream text-[0.8rem] font-light tracking-[0.15em] uppercase">{items[0].caption}</span>
              </div>
            </div>
          </div>

          {/* Top right */}
          <div className="col-span-1 md:col-span-4 relative overflow-hidden group aspect-[3/4]">
            <img src={items[1].img} alt={items[1].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-end gap-3">
              <span className="text-lime text-[0.55rem] font-semibold tracking-[0.3em]">{items[1].label}</span>
              <span className="text-cream text-[0.75rem] font-light tracking-[0.12em] uppercase">{items[1].caption}</span>
            </div>
          </div>

          {/* Bottom right top */}
          <div className="col-span-1 md:col-span-3 relative overflow-hidden group aspect-[3/4]">
            <img src={items[2].img} alt={items[2].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-end gap-3">
              <span className="text-lime text-[0.55rem] font-semibold tracking-[0.3em]">{items[2].label}</span>
              <span className="text-cream text-[0.75rem] font-light tracking-[0.12em] uppercase">{items[2].caption}</span>
            </div>
          </div>

          {/* Wide bottom */}
          <div className="col-span-2 md:col-span-7 relative overflow-hidden group" style={{ height: '300px' }}>
            <img src={items[3].img} alt={items[3].alt} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-end gap-4">
              <span className="text-lime text-[0.55rem] font-semibold tracking-[0.3em]">{items[3].label}</span>
              <span className="text-cream text-[0.8rem] font-light tracking-[0.15em] uppercase">{items[3].caption}</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
