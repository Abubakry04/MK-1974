import { Link } from "react-router-dom";

const pillars = [
  {
    num: "01",
    title: "Performance Fabric",
    desc: "Moisture-wicking, 4-way stretch tech material engineered for real movement.",
  },
  {
    num: "02",
    title: "Precision Cut",
    desc: "Tailored taper — athletic silhouette that never restricts.",
  },
  {
    num: "03",
    title: "Sustainably Made",
    desc: "Recycled fibres sourced from certified ethical factory partners.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-surface">
      {/* Full-bleed lifestyle image */}
      <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        <img
          src="/lifestyle.png"
          alt="MK 1974 lifestyle"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

        {/* Centered overlay tag */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
          <p className="eyebrow mb-2">Est. 2024</p>
          <h2
            className="font-playfair font-black italic text-cream"
            style={{ fontSize: "clamp(2rem,5vw,4rem)" }}
          >
            Our Story
          </h2>
        </div>
      </div>

      {/* Content below image */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-12 py-20 md:py-28 grid md:grid-cols-2 gap-16 md:gap-24">
        {/* Left: body copy */}
        <div>
          <p className="text-cream/55 text-[1rem] font-light leading-[1.9] mb-10">
            MK 1974 was born on the training ground and refined on the street.
            We don't do full kits — we do the gear you wear before, after, and
            in between. Tracksuits that hold their shape. Joggers that move with
            you. Built from premium performance fabrics with a cut that works
            hard and looks sharp.
          </p>
          <Link
            to="/collection"
            className="btn-text text-cream hover:text-lime"
          >
            Explore the Range
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Right: pillars */}
        <div className="flex flex-col gap-8">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="flex gap-6 items-start border-b border-white/[0.06] pb-8 last:border-0 last:pb-0"
            >
              <span className="text-lime text-[0.62rem] font-semibold tracking-[0.3em] mt-1 shrink-0">
                {p.num}
              </span>
              <div>
                <h3 className="text-cream text-[0.88rem] font-medium tracking-[0.1em] uppercase mb-2">
                  {p.title}
                </h3>
                <p className="text-muted text-[0.82rem] font-light leading-[1.7]">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
