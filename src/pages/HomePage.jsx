import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import { PRODUCTS, TESTIMONIALS, CATEGORIES } from '../data/products'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] overflow-hidden">
      <img src="/hero.png" alt="MK 1974 SS25" className="absolute inset-0 w-full h-full object-cover object-[60%_top]" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/50 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16 md:pb-20">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="animate-fade-up">
            <p className="eyebrow mb-5">SS 2025 — New Collection</p>
            <h1 className="font-playfair font-black italic leading-[0.88] tracking-[-0.02em] text-cream" style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}>
              Built for<br />
              <span className="not-italic" style={{ WebkitTextStroke: '1.5px #c8f542', color: 'transparent' }}>
                the Street.
              </span>
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-6 shrink-0 animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <p className="text-cream/50 text-[0.85rem] font-light tracking-[0.08em] leading-[1.8] max-w-[260px] md:text-right">
              Premium tracksuits &amp; joggers<br />engineered for motion.
            </p>
            <Link to="/shop" className="btn-primary">
              Shop Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

// ─── Flash Sale Banner ─────────────────────────────────────────────────────────
function FlashSale() {
  return (
    <div className="bg-lime text-dark py-3 px-8 flex items-center justify-center gap-4">
      <span className="text-[0.6rem] font-black tracking-[0.3em] uppercase">⚡ Flash Sale — 20% Off All Tracksuits</span>
      <span className="text-[0.6rem] font-black tracking-[0.3em] uppercase">|</span>
      <Link to="/shop" className="text-[0.6rem] font-black tracking-[0.3em] uppercase underline">Shop Now →</Link>
    </div>
  )
}

// ─── Featured Categories ───────────────────────────────────────────────────────
function FeaturedCategories() {
  const cats = [
    { label: 'Men', image: '/product2.png', to: '/shop?category=men' },
    { label: 'Women', image: '/product1.png', to: '/shop?category=women' },
    { label: 'Tracksuits', image: '/hero.png', to: '/shop?category=tracksuits' },
    { label: 'Accessories', image: '/product3.png', to: '/shop?category=accessories' },
  ]

  return (
    <section className="bg-dark py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-12">
          <p className="eyebrow mb-3">Browse By</p>
          <h2 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Featured Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cats.map(cat => (
            <Link key={cat.label} to={cat.to} id={`cat-${cat.label.toLowerCase()}`} className="group relative aspect-[3/4] overflow-hidden bg-surface2 block">
              <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-cream text-[0.75rem] font-semibold tracking-[0.25em] uppercase">{cat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── New Arrivals ──────────────────────────────────────────────────────────────
function NewArrivals() {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const newProducts = PRODUCTS.filter(p => p.newArrival).slice(0, 4)

  return (
    <section id="new-arrivals" className="bg-surface py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Just Dropped</p>
            <h2 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>New Arrivals</h2>
          </div>
          <Link to="/shop?sort=newest" className="btn-text text-cream/60 hover:text-lime">
            View All New Arrivals
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {newProducts.map(p => (
            <article key={p.id} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4">
                <Link to={`/product/${p.slug}`}>
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                {p.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="text-[0.55rem] font-semibold tracking-[0.25em] uppercase text-dark bg-lime px-2.5 py-1">{p.badge}</span>
                  </div>
                )}
                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 ${isWishlisted(p.id) ? 'text-lime' : 'text-cream/40 hover:text-cream'}`}
                  aria-label="Wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                {/* Quick Add */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => addToCart(p, p.sizes[2] || p.sizes[0], p.colors[0].name)}
                    className="w-full bg-dark/90 backdrop-blur-sm text-cream text-[0.6rem] font-semibold tracking-[0.25em] uppercase py-4 hover:bg-lime hover:text-dark transition-colors duration-200"
                  >
                    Quick Add — £{p.price}
                  </button>
                </div>
              </div>
              <Link to={`/product/${p.slug}`}>
                <h3 className="text-cream text-[0.85rem] font-medium tracking-[0.04em] mb-1">{p.name}</h3>
                <p className="text-muted text-[0.72rem] mb-2">{p.colors[0].name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-cream text-[0.85rem]">£{p.price}</span>
                  {p.originalPrice && <span className="text-muted text-[0.72rem] line-through">£{p.originalPrice}</span>}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Best Sellers ──────────────────────────────────────────────────────────────
function BestSellers() {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const bestSellers = PRODUCTS.filter(p => p.badge === 'Bestseller').slice(0, 3)

  return (
    <section id="best-sellers" className="bg-dark py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Fan Favourites</p>
            <h2 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>Best Sellers</h2>
          </div>
          <Link to="/shop?sort=best-selling" className="btn-text text-cream/60 hover:text-lime">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((p, i) => (
            <article key={p.id} className={`group cursor-pointer ${i === 1 ? 'md:-mt-8' : ''}`}>
              <div className="relative overflow-hidden aspect-[3/4] bg-surface2 mb-4">
                <Link to={`/product/${p.slug}`}>
                  <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <div className="absolute top-4 left-4 flex gap-2">
                  {p.badge && <span className="text-[0.55rem] font-black tracking-[0.25em] uppercase text-dark bg-lime px-2.5 py-1">{p.badge}</span>}
                </div>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all ${isWishlisted(p.id) ? 'text-lime' : 'text-cream/40 hover:text-cream'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(p.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    onClick={() => addToCart(p, p.sizes[2] || p.sizes[0], p.colors[0].name)}
                    className="w-full bg-dark/90 text-cream text-[0.6rem] font-semibold tracking-[0.25em] uppercase py-4 hover:bg-lime hover:text-dark transition-colors duration-200"
                  >
                    Add to Bag — £{p.price}
                  </button>
                </div>
              </div>
              <Link to={`/product/${p.slug}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-cream text-[0.88rem] font-medium mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < Math.floor(p.rating) ? '#c8f542' : 'none'} stroke="#c8f542" strokeWidth="1.5">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                      ))}
                      <span className="text-muted text-[0.65rem] ml-1">({p.reviews})</span>
                    </div>
                  </div>
                  <span className="text-lime font-medium text-[0.9rem]">£{p.price}</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Brand Strip ───────────────────────────────────────────────────────────────
function BrandStrip() {
  const items = ['Free UK Delivery Over £75', 'Premium Quality Since 1974', 'Easy Returns Within 30 Days', 'Sustainably Sourced Materials', 'Free UK Delivery Over £75', 'Premium Quality Since 1974']
  return (
    <div className="bg-surface border-y border-white/[0.05] overflow-hidden py-4">
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {items.concat(items).map((item, i) => (
          <span key={i} className="text-[0.62rem] font-medium tracking-[0.3em] uppercase text-cream/40 mx-10">
            {item} <span className="text-lime mx-4">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Testimonials ──────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface py-20 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">Real Reviews</p>
          <h2 className="font-playfair font-black italic text-cream" style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-dark border border-white/[0.06] p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#c8f542" stroke="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <p className="text-cream/80 text-[0.88rem] font-light leading-[1.8] mb-6 italic">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cream text-[0.78rem] font-semibold">{t.name}</p>
                  <p className="text-muted text-[0.7rem]">{t.location} · {t.product}</p>
                </div>
                <span className="text-muted text-[0.65rem]">{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Newsletter ────────────────────────────────────────────────────────────────
function Newsletter() {
  const { showToast } = useApp()
  const handleSubmit = (e) => {
    e.preventDefault()
    e.target.reset()
    showToast('You\'re on the list! Welcome to MK 1974.')
  }

  return (
    <section id="newsletter" className="bg-dark border-t border-white/[0.05] py-20 px-8 md:px-12">
      <div className="max-w-[700px] mx-auto text-center">
        <p className="eyebrow mb-4">Stay in the Loop</p>
        <h2 className="font-playfair font-black italic text-cream mb-4" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
          Join the MK 1974 Family
        </h2>
        <p className="text-cream/50 text-[0.88rem] font-light leading-[1.8] mb-10">
          Be first to know about new drops, exclusive sales, and members-only offers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto">
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 bg-surface border border-white/10 text-cream placeholder-muted text-[0.82rem] px-5 py-3.5 focus:outline-none focus:border-lime/40 transition-colors"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
        <p className="text-muted text-[0.65rem] mt-4 tracking-[0.1em]">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}

// ─── Social Gallery ────────────────────────────────────────────────────────────
function SocialGallery() {
  const imgs = ['/product1.png', '/product2.png', '/product3.png', '/hero.png', '/product1.png', '/product2.png']
  return (
    <section className="bg-surface py-16 px-8 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">@mk1974official</p>
          <h2 className="font-playfair font-black italic text-cream text-2xl">Follow Us on Instagram</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {imgs.map((img, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden bg-surface2">
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

// ─── HomePage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <HeroSection />
        <FlashSale />
        <FeaturedCategories />
        <BrandStrip />
        <NewArrivals />
        <BestSellers />
        <Testimonials />
        <Newsletter />
        <SocialGallery />
      </main>
      <Footer />
    </>
  )
}
