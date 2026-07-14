import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import logo from "../assets/mk2.png";

export default function Nav() {
  const { cartCount, setCartOpen, setSearchOpen, user, wishlist } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const prevY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      // Hide on scroll down past 120px, show on scroll up
      if (y > 120 && y > prevY.current + 4) setHidden(true);
      else if (y < prevY.current - 4) setHidden(false);
      prevY.current = y;
      setScrolled(y > 60);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setHidden(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  const leftLinks = [
    { label: "Home",  to: "/" },
    { label: "Shop",  to: "/shop" },
  ];
  const rightLinks = [
    // { label: "Collections", to: "/shop?sort=newest" },
    { label: "About",       to: "/about" },
    { label: "Contact",     to: "/contact" },
  ];

  const linkClass = (to) => {
    const active = location.pathname === to || location.search && (to.includes("?") && location.search === to.split("?")[1] ? `?${location.search}` : "") === to;
    const isActive = location.pathname === to.split("?")[0] && (to.includes("?") ? location.search === `?${to.split("?")[1]}` : true);
    return `text-[0.62rem] font-medium tracking-[0.28em] uppercase transition-all duration-200 ${
      isActive
        ? "text-lime"
        : transparent
          ? "text-cream/70 hover:text-cream"
          : "text-cream/60 hover:text-cream"
    }`;
  };

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          transparent
            ? "bg-transparent"
            : "bg-dark/80 backdrop-blur-md border-b border-white/[0.04] shadow-sm"
        }`}
      >
        {/* ── Top bar ── */}
        <div className="relative flex items-center justify-between h-[70px] px-6 md:px-12 max-w-[1440px] mx-auto">

          {/* LEFT links */}
          <ul className="hidden md:flex items-center gap-8">
            {leftLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={linkClass(l.to)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CENTER — brand wordmark / logo */}
          <Link
            to="/"
            id="nav-logo"
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 select-none flex items-center justify-center ${
              transparent
                ? "opacity-90 hover:opacity-100"
                : "opacity-100 hover:opacity-70"
            }`}
          >
            <img 
              src={logo} 
              alt="MK 1974" 
              className="h-12 w-auto object-contain filter invert brightness-0 contrast-200 sepia-0 hue-rotate-0 saturate-0" 
              style={{ filter: "invert(1) brightness(100)" }}
            />
          </Link>

          {/* RIGHT links + icons */}
          <div className="hidden md:flex items-center gap-7">
            {rightLinks.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                {l.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="w-px h-4 bg-cream/15" />

            {/* Search */}
            <button
              id="searchBtn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className={`transition-colors duration-200 ${transparent ? "text-cream/60 hover:text-cream" : "text-cream/50 hover:text-cream"}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              to={user ? "/profile" : "/auth"}
              id="wishlistBtn"
              aria-label="Wishlist"
              className={`relative transition-colors duration-200 ${transparent ? "text-cream/60 hover:text-cream" : "text-cream/50 hover:text-cream"}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-lime text-white text-[0.44rem] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link
              to={user ? "/profile" : "/auth"}
              id="profileBtn"
              aria-label="Account"
              className={`transition-colors duration-200 ${transparent ? "text-cream/60 hover:text-cream" : "text-cream/50 hover:text-cream"}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart / Bag */}
            <button
              id="cartBtn"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className={`relative flex items-center gap-2 transition-colors duration-200 ${transparent ? "text-cream/60 hover:text-cream" : "text-cream/50 hover:text-cream"}`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="text-[0.62rem] tracking-[0.22em] uppercase font-medium">
                Bag
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 left-3 bg-lime text-white text-[0.44rem] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* ── Mobile right controls ── */}
          <div className="flex md:hidden items-center gap-5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-cream/70 hover:text-cream transition-colors"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            <button
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="relative text-cream/70 hover:text-cream transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime text-white text-[0.44rem] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              id="hamburger"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex flex-col justify-center gap-[5px] w-6 h-6"
            >
              <span className={`block w-full h-[1px] bg-cream transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block w-full h-[1px] bg-cream transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-full h-[1px] bg-cream transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Thin accent line under nav when scrolled */}
        <div
          className="h-px w-full transition-opacity duration-500 bg-gradient-to-r from-transparent via-lime to-transparent"
          style={{
            opacity: scrolled && !transparent ? 0.35 : 0,
          }}
        />
      </nav>

      {/* ── Full-screen mobile menu ── */}
      <div
        className={`fixed inset-0 z-[99] bg-dark flex flex-col transition-all duration-500 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top padding for nav */}
        <div className="h-[70px] shrink-0" />

        <div className="flex-1 flex flex-col justify-between px-8 py-10 overflow-y-auto">
          {/* Nav links */}
          <ul className="flex flex-col gap-1">
            {[...leftLinks, ...rightLinks].map((l, i) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`flex items-center justify-between py-4 border-b border-white/[0.06] text-[0.75rem] font-medium tracking-[0.3em] uppercase transition-colors ${
                    location.pathname === l.to.split("?")[0]
                      ? "text-lime"
                      : "text-cream/60 hover:text-cream"
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms" }}
                >
                  {l.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>

          {/* Account + wishlist */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col gap-4">
            <Link
              to={user ? "/profile" : "/auth"}
              className="flex items-center gap-3 text-cream/50 text-[0.7rem] tracking-[0.22em] uppercase hover:text-cream transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              {user ? `Hi, ${user.firstName}` : "Sign In / Register"}
            </Link>
            <Link
              to={user ? "/profile" : "/auth"}
              className="flex items-center gap-3 text-cream/50 text-[0.7rem] tracking-[0.22em] uppercase hover:text-cream transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
