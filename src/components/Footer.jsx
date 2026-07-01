import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="contact" className="bg-surface border-t border-white/[0.05]">
      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-20 grid grid-cols-2 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="block font-playfair italic font-black text-cream text-[1.8rem] tracking-tight mb-4">
            MK 1974
          </Link>
          <p className="text-muted text-[0.78rem] font-light leading-[1.8] mb-8 max-w-[220px]">
            Built for the Street.<br />Made for Motion.
          </p>
          <div className="flex gap-4">
            {[
              { label: "IG", href: "https://instagram.com" },
              { label: "TK", href: "#" },
              { label: "FB", href: "#" },
              { label: "X", href: "#" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-muted hover:text-lime text-[0.62rem] font-semibold tracking-[0.25em] border border-white/10 hover:border-lime w-9 h-9 flex items-center justify-center transition-all duration-200"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-cream text-[0.62rem] font-semibold tracking-[0.3em] uppercase mb-6">Shop</h4>
          <ul className="flex flex-col gap-3.5">
            {[
              { label: "New Arrivals", to: "/shop?sort=newest" },
              { label: "Best Sellers", to: "/shop?sort=best-selling" },
              { label: "Tracksuits", to: "/shop?category=tracksuits" },
              { label: "Joggers", to: "/shop?category=joggers" },
              { label: "Hoodies", to: "/shop?category=hoodies" },
              { label: "Accessories", to: "/shop?category=accessories" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted hover:text-cream text-[0.8rem] font-light tracking-[0.05em] transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-cream text-[0.62rem] font-semibold tracking-[0.3em] uppercase mb-6">Info</h4>
          <ul className="flex flex-col gap-3.5">
            {[
              { label: "About MK 1974", to: "/about" },
              { label: "Contact Us", to: "/contact" },
              { label: "Track Your Order", to: "/profile" },
              { label: "Size Guide", to: "/contact#faqs" },
              { label: "Sustainability", to: "/about" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted hover:text-cream text-[0.8rem] font-light tracking-[0.05em] transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-cream text-[0.62rem] font-semibold tracking-[0.3em] uppercase mb-6">Support</h4>
          <ul className="flex flex-col gap-3.5">
            {[
              { label: "FAQ", to: "/contact" },
              { label: "Returns & Exchanges", to: "/contact" },
              { label: "Shipping Info", to: "/contact" },
              { label: "Privacy Policy", to: "#" },
              { label: "Terms of Service", to: "#" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted hover:text-cream text-[0.8rem] font-light tracking-[0.05em] transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="mailto:hello@mk1974.com" className="text-muted hover:text-lime text-[0.8rem] font-light tracking-[0.05em] transition-colors duration-200">
                hello@mk1974.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05] px-8 md:px-12 py-5 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-muted text-[0.65rem] tracking-[0.15em] uppercase">
        <p>© 2025 MK 1974. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cream transition-colors">Privacy</a>
          <a href="#" className="hover:text-cream transition-colors">Terms</a>
          <a href="#" className="hover:text-cream transition-colors">Return Policy</a>
        </div>
      </div>
    </footer>
  );
}
