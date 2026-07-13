import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[680px] overflow-hidden bg-dark"
    >
      {/* ── Full-bleed hero image ── */}
      <img
        src="/hero.png"
        alt="MK 1974 SS25"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 1.2s ease" }}
      />

      {/* ── Gradient overlays (multi-layer depth) ── */}
      {/* Heavy bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      {/* Left fade for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-dark/20 to-transparent" />
      {/* Top vignette for nav area */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-transparent to-transparent" />

      {/* ── Vertical collection tag — left edge ── */}
      <div className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3">
        <div
          className="text-cream/20 text-[0.5rem] font-medium tracking-[0.45em] uppercase select-none"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Collection No. 12
        </div>
        <div className="w-px h-8 bg-lime/30" />
      </div>

      {/* ── Main content layout ── */}
      <div className="absolute inset-0 flex flex-col justify-end pb-14 md:pb-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1440px] mx-auto w-full flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-6">

          {/* LEFT — Headline block */}
          <div
            className="flex-1"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(.16,1,.3,1) 0.1s, transform 0.9s cubic-bezier(.16,1,.3,1) 0.1s",
            }}
          >
            {/* Season label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-px bg-lime" />
              <p className="text-lime text-[0.58rem] font-semibold tracking-[0.4em] uppercase">
                SS 2025 — New Collection
              </p>
            </div>

            {/* Main headline */}
            <h1
              className="font-playfair font-black italic leading-[0.87] tracking-[-0.02em] text-cream mb-5"
              style={{ fontSize: "clamp(3.8rem, 9.5vw, 9rem)" }}
            >
              Built for
              <br />
              <span
                className="not-italic"
                style={{
                  WebkitTextStroke: "1.5px #968574",
                  color: "transparent",
                }}
              >
                the Street.
              </span>
            </h1>

            {/* Tagline */}
            <p
              className="text-cream/35 text-[0.62rem] font-medium tracking-[0.35em] uppercase"
              style={{ letterSpacing: "0.3em" }}
            >
              Built on purpose. &nbsp;Driven by legacy.
            </p>
          </div>

          {/* RIGHT — Product card + CTA */}
          <div
            className="flex flex-col items-start md:items-end gap-6 shrink-0 md:max-w-[280px]"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(.16,1,.3,1) 0.3s, transform 0.9s cubic-bezier(.16,1,.3,1) 0.3s",
            }}
          >
            {/* Divider line */}
            <div className="hidden md:block w-px h-12 bg-cream/15 self-end" />

            {/* Descriptor */}
            <p className="text-cream/55 text-[0.78rem] font-light tracking-[0.06em] leading-[1.9] md:text-right">
              Premium tracksuits & joggers
              <br />
              engineered for motion.
            </p>

            {/* CTA button */}
            <Link to="/shop" className="btn-primary group">
              Shop Now
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator — right edge ── */}
      <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4">
        <div
          className="text-cream/25 text-[0.5rem] font-medium tracking-[0.4em] uppercase select-none"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll to explore
        </div>
        <div className="w-px h-14 bg-cream/15 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-lime"
            style={{
              height: "45%",
              animation: "scrollLine 2.2s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* ── Subtle corner accent ── */}
      <div className="absolute bottom-8 right-8 md:right-16 hidden md:flex items-center gap-2 opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-lime" />
        <div className="w-6 h-px bg-cream/40" />
      </div>
    </section>
  );
}
