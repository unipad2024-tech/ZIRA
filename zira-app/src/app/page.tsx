"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ScanLine } from "lucide-react";
import { FilmGrain } from "@/components/renaissance/grain";
import { GoldParticles } from "@/components/renaissance/particles";

/* ─────────────────────────────────────────────────────────────────
   Met Museum Open Access — verified 200 OK
   Caravaggio, The Denial of Saint Peter, ca. 1610
   Dark chiaroscuro: three figures by candlelight
───────────────────────────────────────────────────────────────── */
const HERO =
  "https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg";

const SECONDARY = [
  {
    img: "https://images.metmuseum.org/CRDImages/ep/original/DP-30758-001.jpg",
    title: "Focus Timer",
    sub: "Earn coins every session",
    credit: "Rembrandt — Aristotle with Homer",
  },
  {
    img: "https://images.metmuseum.org/CRDImages/ep/original/DP-13139-001.jpg",
    title: "Study Farm",
    sub: "Your farm grows as you learn",
    credit: "David — Death of Socrates",
  },
  {
    img: "https://images.metmuseum.org/CRDImages/ep/original/DP-17778-001.jpg",
    title: "Leaderboard",
    sub: "Rise above the competition",
    credit: "Sebastiano del Piombo",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <FilmGrain opacity={0.055} />
      <GoldParticles count={12} />

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-bleed Caravaggio, text bottom-anchored
          Inspired by Sotheby's / Louvre editorial
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex flex-col overflow-hidden">

        {/* Painting */}
        <img
          src={HERO}
          alt="Caravaggio — The Denial of Saint Peter, ca. 1610"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 20%", filter: "sepia(0.12) contrast(1.02) brightness(0.90)" }}
        />

        {/* Top gradient — protect nav legibility */}
        <div className="absolute top-0 inset-x-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(4,3,2,0.60) 0%, transparent 100%)" }}
        />

        {/* Bottom gradient — text zone */}
        <div className="absolute bottom-0 inset-x-0 h-[55%] pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(4,3,2,0.94) 0%, rgba(4,3,2,0.82) 30%, rgba(4,3,2,0.40) 65%, transparent 100%)" }}
        />

        {/* ── NAV ────────────────────────────────────────────── */}
        <nav
          className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-500"
          style={scrolled ? { background: "rgba(4,3,2,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,168,76,0.12)" } : {}}
        >
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.32em]"
              style={{ fontFamily: "var(--font-display)", color: "rgba(232,201,122,0.90)", letterSpacing: "0.30em" }}>
              ZIRA
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10">
            {[["Features","#features"],["Pricing","#pricing"],["Community","#community"]].map(([l,h]) => (
              <a key={l} href={h}
                className="text-[11px] uppercase tracking-[0.20em] transition-colors duration-200"
                style={{ color: "rgba(245,237,214,0.38)", fontFamily: "var(--font-ui)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,237,214,0.80)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,237,214,0.38)")}
              >{l}</a>
            ))}
          </div>

          <Link href="/login"
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-all duration-200"
            style={{ color: "rgba(245,237,214,0.50)", fontFamily: "var(--font-ui)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(232,201,122,0.90)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,237,214,0.50)")}
          >
            Sign In <ArrowUpRight className="w-3 h-3" />
          </Link>
        </nav>

        {/* ── HERO TEXT — bottom anchored, editorial ────────── */}
        <div className="relative z-10 mt-auto px-6 md:px-12 pb-10">

          {/* Eyebrow rule */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-[48px]"
              style={{ background: "rgba(201,168,76,0.50)" }}
            />
            <div className="flex items-center gap-2.5">
              <ScanLine className="w-3 h-3" style={{ color: "rgba(201,168,76,0.55)" }} />
              <span className="text-[10px] uppercase tracking-[0.28em]"
                style={{ color: "rgba(201,168,76,0.65)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                The Social Study Platform · 2024
              </span>
            </div>
          </div>

          {/* Main title — left-anchored, massive */}
          <div className="max-w-3xl">
            <h1 style={{ lineHeight: 0.88, userSelect: "none" }}>
              <span className="block"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3.2rem, 9.5vw, 8rem)",
                  fontWeight: 300,
                  color: "rgba(245,237,214,0.55)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>The Art of</span>
              <span className="block"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(4.5rem, 14vw, 11rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "rgba(245,237,214,0.96)",
                  textShadow: "0 2px 40px rgba(0,0,0,0.8)",
                }}>Learning.</span>
            </h1>

            {/* Bottom row — tagline + CTAs side by side */}
            <div className="flex items-end justify-between gap-6 mt-8 flex-wrap">
              <div>
                <p className="text-sm mb-1"
                  style={{ color: "rgba(191,168,130,0.55)", fontFamily: "var(--font-accent)", fontStyle: "italic", letterSpacing: "0.08em" }}>
                  Study with thousands of students.
                </p>
                <p className="text-xs"
                  style={{ color: "rgba(191,168,130,0.32)", fontFamily: "var(--font-accent)", fontStyle: "italic", letterSpacing: "0.06em" }}>
                  Caravaggio — The Denial of Saint Peter, ca. 1610 · The Metropolitan Museum of Art
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/register"
                  className="inline-flex items-center gap-2 uppercase tracking-[0.16em] font-bold text-[11px] rounded-full transition-all duration-300"
                  style={{
                    background: "rgba(245,237,214,0.96)",
                    color: "#0A0804",
                    padding: "0.8rem 2rem",
                    fontFamily: "var(--font-ui)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.50)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,201,122,1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,237,214,0.96)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Get Started <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <Link href="/login"
                  className="inline-flex items-center gap-1.5 uppercase tracking-[0.14em] text-[11px] rounded-full transition-all duration-300"
                  style={{
                    border: "1px solid rgba(245,237,214,0.20)",
                    color: "rgba(245,237,214,0.55)",
                    padding: "0.8rem 1.8rem",
                    fontFamily: "var(--font-ui)",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)"; e.currentTarget.style.color = "rgba(232,201,122,0.90)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,214,0.20)"; e.currentTarget.style.color = "rgba(245,237,214,0.55)"; }}
                >Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURE STRIP — three paintings
      ══════════════════════════════════════════════════════════════ */}
      <section id="features"
        style={{ background: "#040302" }}
      >
        {/* Thin gold rule */}
        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.40) 20%, rgba(201,168,76,0.40) 80%, transparent)" }} />

        {/* Label row */}
        <div className="flex items-center justify-between px-6 md:px-12 py-8">
          <p className="text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "rgba(201,168,76,0.55)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
            Why Zira
          </p>
          <p className="text-[10px] uppercase tracking-[0.28em] hidden md:block"
            style={{ color: "rgba(245,237,214,0.20)", fontFamily: "var(--font-ui)" }}>
            Six features · One platform
          </p>
        </div>

        {/* Three painting cards */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {SECONDARY.map((item, i) => (
            <div key={i} className="group relative overflow-hidden aspect-[4/5] md:aspect-auto md:h-[60vh]"
              style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
            >
              <img
                src={item.img}
                alt={item.credit}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ filter: "sepia(0.14) contrast(1.06) brightness(0.82)" }}
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(0deg, rgba(4,3,2,0.88) 0%, rgba(4,3,2,0.18) 50%, transparent 100%)"
              }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[9px] uppercase tracking-[0.22em] mb-3"
                  style={{ color: "rgba(201,168,76,0.55)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                  {item.credit}
                </p>
                <h3 className="font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                    color: "rgba(245,237,214,0.95)",
                    letterSpacing: "0.01em",
                  }}>{item.title}</h3>
                <p className="text-xs"
                  style={{ color: "rgba(191,168,130,0.55)", fontFamily: "var(--font-ui)" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Gold rule */}
        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.30) 30%, rgba(201,168,76,0.30) 70%, transparent)" }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════════════════════════ */}
      <section className="px-6 md:px-12 py-24" style={{ background: "#040302" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between mb-14 gap-4 flex-wrap">
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "rgba(245,237,214,0.90)",
              letterSpacing: "-0.01em",
            }}>Built for those<br />who mean business.</h2>
            <p className="text-sm max-w-xs text-right"
              style={{ color: "rgba(191,168,130,0.45)", fontFamily: "var(--font-accent)", fontStyle: "italic", lineHeight: 1.7 }}>
              منصة متكاملة تجمع<br/>المتعة والإنتاجية والتنافس
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ background: "rgba(201,168,76,0.08)" }}
          >
            {FEATURES_GRID.map((f, i) => (
              <div key={i} className="group p-7 transition-all duration-300"
                style={{ background: "#040302" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(20,12,6,1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "#040302")}
              >
                <p className="text-[9px] uppercase tracking-[0.22em] mb-5"
                  style={{ color: "rgba(201,168,76,0.50)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                  0{i + 1}
                </p>
                <h3 className="font-bold mb-2"
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "rgba(245,237,214,0.88)", letterSpacing: "0.01em" }}>
                  {f.en}
                </h3>
                <p className="text-[11px] mb-3"
                  style={{ color: "rgba(201,168,76,0.45)", fontFamily: "var(--font-ui)" }}>
                  {f.ar}
                </p>
                <p className="text-xs leading-relaxed"
                  style={{ color: "rgba(191,168,130,0.45)", fontFamily: "var(--font-ui)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: "#040302" }}>
        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.30) 30%, rgba(201,168,76,0.30) 70%, transparent)" }} />

        <div className="px-6 md:px-12 py-24 flex items-end justify-between gap-10 flex-wrap">
          <div>
            <p className="text-[10px] uppercase tracking-[0.26em] mb-6"
              style={{ color: "rgba(201,168,76,0.50)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
              Begin your ascent
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 8vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "rgba(245,237,214,0.94)",
              lineHeight: 0.92,
            }}>Start.<br/>Now.</h2>
          </div>

          <div className="flex flex-col gap-4 items-start md:items-end">
            <p className="text-sm"
              style={{ color: "rgba(191,168,130,0.45)", fontFamily: "var(--font-accent)", fontStyle: "italic", maxWidth: "240px", textAlign: "right" }}>
              سجّل مجاناً وانضم لآلاف<br/>الطلاب الذين يتفوقون كل يوم.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-2 uppercase tracking-[0.18em] font-black text-[11px] rounded-full transition-all duration-300"
              style={{
                background: "rgba(232,201,122,1)",
                color: "#040302",
                padding: "1rem 2.8rem",
                fontFamily: "var(--font-ui)",
                boxShadow: "0 0 48px rgba(201,168,76,0.25)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 72px rgba(201,168,76,0.50)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 48px rgba(201,168,76,0.25)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Create Account <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.18) 30%, rgba(201,168,76,0.18) 70%, transparent)" }} />

        <div className="px-6 md:px-12 py-5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(245,237,214,0.18)", fontFamily: "var(--font-ui)" }}>
            © 2024 Zira
          </span>
          <span className="text-[10px]"
            style={{ color: "rgba(245,237,214,0.15)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
            "العلم نور يضيء ظلمات الجهل"
          </span>
        </div>
      </section>
    </>
  );
}

const FEATURES_GRID = [
  { en: "Focus Timer",      ar: "مؤقت التركيز",    desc: "Study in blocks. Earn gold coins for every session you complete." },
  { en: "Group Sessions",   ar: "جلسات جماعية",    desc: "Study live with friends. Your multiplier grows with your group." },
  { en: "AI Tutor",         ar: "المساعد الذكي",    desc: "Ask Zira AI anything — science, math, history — answered in Arabic." },
  { en: "Leaderboard",      ar: "لوحة المتصدرين",   desc: "Weekly rankings. Compete by study hours, streak, and coins." },
  { en: "Flashcards",       ar: "البطاقات الدراسية", desc: "Build decks and review with spaced repetition that actually works." },
  { en: "Study Farm",       ar: "مزرعة الدراسة",    desc: "Your farm grows with your study hours. A living record of effort." },
];
