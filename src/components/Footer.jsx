import { Link } from "react-router-dom";

const SocialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.78 1.52V7.08a4.85 4.85 0 0 1-1.01-.39z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark border-t border-white/[0.06]">
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
          <div className="flex gap-3">
            {SocialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-muted hover:text-lime border border-white/10 hover:border-lime w-9 h-9 flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                {s.icon}
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
              { label: "Privacy Policy", to: "/contact" },
              { label: "Terms of Service", to: "/contact" },
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
        <p>© 2026 MK 1974. All rights reserved.</p>
        {/* <div className="flex items-center gap-6">
          <Link to="/contact" className="hover:text-cream transition-colors">Privacy</Link>
          <Link to="/contact" className="hover:text-cream transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-cream transition-colors">Return Policy</Link>
        </div> */}
      </div>
    </footer>
  );
}
