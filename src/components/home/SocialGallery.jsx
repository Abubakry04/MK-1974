export default function SocialGallery() {
  const imgs = ['/product1.png', '/product2.png', '/product3.png', '/hero.png', '/product1.png', '/product2.png']
  return (
    <section className="bg-surface py-16 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">@mk1974official</p>
          <h2 className="font-playfair font-black italic text-2xl" style={{ color: '#1A1A1A' }}>Follow Us on Instagram</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {imgs.map((img, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden bg-surface2 block rounded-sm shadow-sm">
              <img src={img} alt="Instagram" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors duration-300 flex items-center justify-center">
                <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="1.5"/><path fill="none" stroke="white" strokeWidth="1.5" d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2"/></svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
