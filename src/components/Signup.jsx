import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Signup() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(`✓ You're on the list`);
    setEmail("");
  };

  return (
    <section className="relative bg-surface2 overflow-hidden">
      {/* Full-bleed product image */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src="/product1.png"
          alt="MK 1974 exclusive drop"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-dark/60" />
        {/* Centered text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="eyebrow mb-4">Exclusive Access</p>
          <h2
            className="font-playfair font-black italic text-cream mb-3"
            style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}
          >
            Drop before the drop.
          </h2>
          <p className="text-cream/45 text-[0.85rem] font-light tracking-[0.06em] max-w-[380px]">
            First access to new collections, limited releases &amp; members-only
            discounts.
          </p>
        </div>
      </div>

      {/* Form strip */}
      <div className="bg-surface border-t border-white/[0.06] px-8 md:px-12 py-10">
        <form
          id="signupForm"
          onSubmit={handleSubmit}
          className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center gap-0"
        >
          <input
            type="email"
            id="emailInput"
            className="flex-1 w-full bg-transparent border border-white/15 border-r-0 text-cream placeholder-muted text-[0.8rem] font-light tracking-[0.08em] px-6 py-4 outline-none focus:border-lime/50 transition-colors duration-200"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-lime text-dark text-[0.65rem] font-semibold tracking-[0.25em] uppercase px-10 py-4 hover:bg-lime-dim transition-colors duration-200 shrink-0 w-full sm:w-auto"
          >
            Join the List
          </button>
        </form>
        <p className="text-muted text-[0.65rem] tracking-[0.15em] uppercase mt-5 text-center max-w-[1440px] mx-auto">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
