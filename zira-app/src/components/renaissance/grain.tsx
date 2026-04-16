"use client";

/* Animated film grain overlay — cinematic tactile feel */
export function FilmGrain({ opacity = 0.045 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] select-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* SVG feTurbulence noise — shifts every 0.5s via animation */}
      <svg
        className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2"
        style={{ animation: "grain-shift 0.5s steps(1) infinite" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
