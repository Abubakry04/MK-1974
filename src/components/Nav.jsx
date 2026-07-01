import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Nav() {
  const { cartCount, setCartOpen, setSearchOpen, user, wishlist } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isHome = location.pathname === "/";
  const transparent = isHome && !scrolled;

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Collections", to: "/shop?sort=newest" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          transparent
            ? "bg-transparent"
            : "bg-dark/96 backdrop-blur-xl border-b border-white/[0.05]"
        }`}
      >
        <div className="relative flex items-center justify-between h-[68px] px-8 md:px-12 max-w-[1440px] mx-auto">
          {/* Left nav links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.slice(0, 2).map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`text-[0.65rem] font-medium tracking-[0.25em] uppercase transition-colors duration-200 ${
                    location.pathname === l.to
                      ? "text-lime"
                      : "text-cream/60 hover:text-cream"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Center logo */}
          <Link
            to="/"
            id="nav-logo"
            className="absolute left-1/2 -translate-x-1/2 font-playfair italic text-[1.6rem] font-black tracking-tight text-cream hover:text-lime transition-colors duration-300"
          >
            MK 1974
          </Link>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.slice(2).map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-[0.65rem] font-medium tracking-[0.25em] uppercase transition-colors duration-200 ${
                  location.pathname === l.to
                    ? "text-lime"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {/* Search */}
            <button
              id="searchBtn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="text-cream/60 hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              to={user ? "/profile" : "/auth"}
              id="wishlistBtn"
              aria-label="Wishlist"
              className="relative text-cream/60 hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-lime text-dark text-[0.48rem] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to={user ? "/profile" : "/auth"}
              id="profileBtn"
              aria-label="Account"
              className="text-cream/60 hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            {/* Cart */}
            <button
              id="cartBtn"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 text-cream/60 hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="text-[0.65rem] tracking-[0.2em] uppercase font-medium">
                Bag
                {cartCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center bg-lime text-dark text-[0.52rem] font-black w-4 h-4 rounded-full">
                    {cartCount}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setSearchOpen(true)} className="text-cream/70">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
              className="relative text-cream/70"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-lime text-dark text-[0.48rem] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="hamburger"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex flex-col gap-[5px] py-1"
            >
              <span className={`block w-5 h-[1px] bg-cream transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
              <span className={`block w-5 h-[1px] bg-cream transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-[1px] bg-cream transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen" : "max-h-0"}`}>
          <div className="bg-dark border-t border-white/[0.05] px-8 py-8">
            <ul className="flex flex-col gap-1 mb-8">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`block py-3 text-[0.7rem] font-medium tracking-[0.3em] uppercase transition-colors ${
                      location.pathname === l.to ? "text-lime" : "text-cream/70 hover:text-cream"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 pt-6 border-t border-white/[0.05]">
              <Link to={user ? "/profile" : "/auth"} className="flex items-center gap-3 text-cream/60 text-[0.7rem] tracking-[0.2em] uppercase">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {user ? `Hi, ${user.firstName}` : 'Sign In / Register'}
              </Link>
              <Link to={user ? "/profile" : "/auth"} className="flex items-center gap-3 text-cream/60 text-[0.7rem] tracking-[0.2em] uppercase">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
