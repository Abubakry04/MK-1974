import { Link } from "react-router-dom";
import logo from "../assets/mk2.png";

const SocialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/mk1974plus?igsh=a2xqeG1maGptbW9z",
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
    href: "https://www.tiktok.com/@mk.1974_?_r=1&_t=ZS-98rG2CMCCST",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.01a8.16 8.16 0 0 0 4.78 1.52V7.08a4.85 4.85 0 0 1-1.01-.39z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/MK1974PLUS",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Snapchat",
    href: "https://www.snapchat.com/add/mk1974plus?share_id=mok9oDssTgM&locale=en-GB",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.001 2c-3.57 0-5.83 2.53-6.19 5.37-.12.92.05 1.76.22 2.5-.32.18-.75.46-1.12.78-.45.39-.77.83-.75 1.34.03.74.65.98 1.25 1.18.23.08.47.16.65.28.1.07.16.16.14.3-.06.37-.47 1.63-1.07 2.37-.36.44-.76.78-1.22 1.01-.4.2-.82.35-1.04.75-.15.28-.08.61.16.81.39.32.96.47 1.54.54.91.1 1.83.05 2.76-.05.47-.05.95-.12 1.41-.09.68.04 1.35.34 2.03.58.85.3 1.76.43 2.68.43.92 0 1.83-.13 2.68-.43.68-.24 1.35-.54 2.03-.58.46-.03.94.04 1.41.09.93.1 1.85.15 2.76.05.58-.07 1.15-.22 1.54-.54.24-.2.31-.53.16-.81-.22-.4-.64-.55-1.04-.75-.46-.23-.86-.57-1.22-1.01-.6-.74-1.01-2-1.07-2.37-.02-.14.04-.23.14-.3.18-.12.42-.2.65-.28.6-.2 1.22-.44 1.25-1.18.02-.51-.3-.95-.75-1.34-.37-.32-.8-.6-1.12-.78.17-.74.34-1.58.22-2.5C17.831 4.53 15.571 2 12.001 2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface2 border-t border-black/10 text-dark">
      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 py-10 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="block mb-4">
            <img
              src={logo}
              alt="MK 1974"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-dark/60 text-sm font-normal leading-relaxed mb-6 max-w-[200px]">
            New Sport Fashion Wear.<br />Launched August 17, 2026.
          </p>
          <div className="flex gap-3">
            {SocialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-dark/70 hover:text-dark border border-black/15 hover:border-black/40 bg-white/50 rounded w-9 h-9 flex items-center justify-center transition-colors duration-200"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-dark text-xs font-bold tracking-widest uppercase mb-5">Shop</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "New Arrivals", to: "/shop?sort=newest" },
              { label: "Best Sellers", to: "/shop?sort=best-selling" },
              // { label: "Tracksuits", to: "/shop?category=tracksuits" },
              // { label: "Joggers", to: "/shop?category=joggers" },
              // { label: "Hoodies", to: "/shop?category=hoodies" },
              // { label: "Accessories", to: "/shop?category=accessories" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-dark text-xs font-bold tracking-widest uppercase mb-5">Info</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "About MK 1974", to: "/about" },
              { label: "Contact Us", to: "/contact" },
              { label: "Track Your Order", to: "/profile" },
              { label: "Size Guide", to: "/contact#faqs" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-dark text-xs font-bold tracking-widest uppercase mb-5">Support</h4>
          <ul className="flex flex-col gap-3">
            {[
              { label: "FAQ", to: "/contact" },
              // { label: "Returns & Exchanges", to: "/contact" },
              { label: "Shipping Info", to: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-200">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="mailto:hello@mk1974.com" className="text-dark/60 hover:text-dark text-sm font-medium transition-colors duration-200">
                hello@mk1974.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/10 px-8 md:px-12 py-5 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-dark/60 text-xs font-medium">
        <p>© 2026 MK 1974. All rights reserved.</p>
        <div className="flex items-center gap-5">
          <Link to="/privacy-policy" className="hover:text-dark transition-colors">Privacy Policy</Link>
          {/* <Link to="/contact" className="hover:text-dark transition-colors">Terms</Link>
          <Link to="/contact" className="hover:text-dark transition-colors">Return Policy</Link> */}
        </div>
      </div>
    </footer>
  );
}
