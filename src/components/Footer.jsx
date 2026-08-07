import { Link } from "react-router-dom";
import logo from "../assets/mk2.png";

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
    <footer className="bg-dark border-t border-white/[0.06]">
      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="block mb-4">
            <img
              src={logo}
              alt="MK 1974"
              className="h-10 w-auto object-contain"
              style={{ filter: 'invert(1) brightness(100)' }}
            />
          </Link>
          <p className="text-muted text-sm font-light leading-relaxed mb-6 max-w-[200px]">
            New Lagos streetwear.<br />Launched August 11, 2026.
          </p>
          <div className="flex gap-3">
            {SocialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-muted hover:text-cream border border-white/10 hover:border-white/30 w-9 h-9 flex items-center justify-center transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-widest uppercase mb-5">Shop</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "New Arrivals", to: "/shop?sort=newest" },
              { label: "Best Sellers", to: "/shop?sort=best-selling" },
              { label: "Tracksuits", to: "/shop?category=tracksuits" },
              { label: "Joggers", to: "/shop?category=joggers" },
              { label: "Hoodies", to: "/shop?category=hoodies" },
              { label: "Accessories", to: "/shop?category=accessories" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted hover:text-cream text-sm font-light transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-widest uppercase mb-5">Info</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "About MK 1974", to: "/about" },
              { label: "Contact Us", to: "/contact" },
              { label: "Track Your Order", to: "/profile" },
              { label: "Size Guide", to: "/contact#faqs" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted hover:text-cream text-sm font-light transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-cream text-xs font-semibold tracking-widest uppercase mb-5">Support</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "FAQ", to: "/contact" },
              { label: "Returns & Exchanges", to: "/contact" },
              { label: "Shipping Info", to: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-muted hover:text-cream text-sm font-light transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="mailto:hello@mk1974.com" className="text-muted hover:text-cream text-sm font-light transition-colors duration-200">
                hello@mk1974.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05] px-8 md:px-12 py-5 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-muted text-xs">
        <p>© 2026 MK 1974. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/contact" className="hover:text-cream transition-colors">Privacy</Link>
          <Link to="/contact" className="hover:text-cream transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-cream transition-colors">Return Policy</Link>
        </div>
      </div>
    </footer>
  );
}
