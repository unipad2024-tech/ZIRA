/* Slowly rotating concentric rings — placed behind hero */
export function ConcentricRings({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
      {[400, 550, 700, 850, 1000].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border"
          style={{
            width:  size, height: size,
            borderColor: `rgba(201,168,76,${0.06 - i * 0.008})`,
            animation: `spin-slow ${60 + i * 15}s linear infinite ${i % 2 ? "reverse" : ""}`,
          }}
        />
      ))}
    </div>
  );
}

export function ScrollIndicator() {
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <span
        className="font-[family-name:var(--font-cormorant)] text-[0.6rem] italic tracking-[0.3em] uppercase"
        style={{ color: "var(--gold-lo)" }}
      >
        scroll
      </span>
      <div
        className="w-px h-12 overflow-hidden relative"
        style={{ background: "rgba(201,168,76,0.15)" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-full"
          style={{
            background: "linear-gradient(180deg, var(--gold), transparent)",
            animation: "scroll-line 2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
