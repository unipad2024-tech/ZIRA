"use client";

import Link from "next/link";
import { LayoutGrid, ScanLine, ArrowRight, Timer, Users, Bot, Trophy, BookOpen, Sprout } from "lucide-react";
import { RenaissanceCursor } from "@/components/renaissance/cursor";
import { FilmGrain } from "@/components/renaissance/grain";
import { GoldParticles } from "@/components/renaissance/particles";

/* ────────────────────────────────────────────────────────────────
   Caravaggio — The Calling of Saint Matthew (1600)
   Chiaroscuro spotlight: figures in shadow, divine light from right
   Perfect backdrop for "study. dominate."
──────────────────────────────────────────────────────────────── */
const HERO_PAINTING =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/The_Calling_of_Saint_Matthew-Caravaggio_%281599-1600%29.jpg/1280px-The_Calling_of_Saint_Matthew-Caravaggio_%281599-1600%29.jpg";

const FEATURES = [
  { icon: Timer,    en: "Focus Timer",      ar: "مؤقت التركيز",   desc: "Earn gold coins for every study session you complete." },
  { icon: Users,    en: "Group Sessions",   ar: "جلسات جماعية",   desc: "Study with friends live — multiply your coin rewards." },
  { icon: Bot,      en: "AI Tutor",         ar: "المساعد الذكي",   desc: "Zira AI answers your science questions instantly in Arabic." },
  { icon: Trophy,   en: "Leaderboard",      ar: "المتصدرين",       desc: "Compete weekly and rise to the top of the rankings." },
  { icon: BookOpen, en: "Flashcards",       ar: "البطاقات",        desc: "Build decks and review with science-backed spaced repetition." },
  { icon: Sprout,   en: "Study Farm",       ar: "مزرعة الدراسة",   desc: "Your farm grows with every hour you invest in learning." },
];

export default function LandingPage() {
  return (
    <>
      <RenaissanceCursor />
      <FilmGrain opacity={0.06} />
      <GoldParticles count={18} />

      {/* ══ HERO ════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">

        {/* ── Real painting background ── */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${HERO_PAINTING}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* CSS fallback + tone overlay layers (stack on top of painting) */}
        <div className="absolute inset-0" style={{
          background: [
            /* Warm sepia tint to unify painting */
            "linear-gradient(0deg, rgba(12,7,2,0.35) 0%, rgba(12,7,2,0.35) 100%)",
          ].join(","),
          mixBlendMode: "multiply",
        }} />

        {/* Dark vignette — crushes edges, lifts centre */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 75% at 50% 42%, transparent 20%, rgba(3,2,1,0.55) 60%, rgba(3,2,1,0.92) 100%)",
        }} />

        {/* Top gold line */}
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.7) 30%, rgba(232,201,122,0.9) 50%, rgba(201,168,76,0.7) 70%, transparent)",
        }} />

        {/* Bottom oil fade */}
        <div className="absolute bottom-0 inset-x-0 h-72 pointer-events-none" style={{
          background: "linear-gradient(0deg, #050302 0%, rgba(5,3,2,0.70) 50%, transparent 100%)",
        }} />

        {/* ── NAVBAR ────────────────────────────────────────────────── */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-14 py-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.50)", boxShadow: "0 0 16px rgba(201,168,76,0.20)" }}
            >
              <span className="text-base font-black" style={{ fontFamily: "var(--font-display)", color: "var(--gold-hi)" }}>Z</span>
            </div>
            <span className="hidden sm:block font-bold tracking-[0.15em] text-sm uppercase" style={{
              fontFamily: "var(--font-display)",
              color: "rgba(232,201,122,0.85)",
              letterSpacing: "0.18em",
            }}>ZIRA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {["Features","Pricing","Community"].map(l => (
              <a key={l} href="#features"
                className="text-xs font-light uppercase tracking-widest transition-colors duration-200"
                style={{ color: "rgba(245,237,214,0.40)", letterSpacing: "0.18em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,237,214,0.85)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,237,214,0.40)")}
              >{l}</a>
            ))}
            <Link href="/login"
              className="text-xs font-medium uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200"
              style={{ color: "rgba(245,237,214,0.65)", border: "1px solid rgba(201,168,76,0.22)", letterSpacing: "0.14em" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.55)"; e.currentTarget.style.color = "var(--gold-hi)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.22)"; e.currentTarget.style.color = "rgba(245,237,214,0.65)"; }}
            >Sign In</Link>
          </div>

          <LayoutGrid className="w-[18px] h-[18px]" style={{ color: "rgba(201,168,76,0.40)" }} />
        </nav>

        {/* ── HERO TEXT ─────────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5" style={{ marginTop: "-4rem" }}>

          {/* Pill */}
          <div className="inline-flex items-center gap-3 rounded-full px-4 py-1.5 mb-12 animate-fade-up"
            style={{
              background: "rgba(201,168,76,0.07)",
              border: "1px solid rgba(201,168,76,0.30)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--gold)" }} />
            <span style={{
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              fontSize: "0.72rem",
              color: "rgba(232,201,122,0.75)",
              letterSpacing: "0.20em",
            }}>منصة الدراسة الاجتماعية · The Social Study Platform</span>
            <ScanLine className="w-3.5 h-3.5 opacity-40" style={{ color: "var(--gold)" }} />
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100" style={{ lineHeight: 0.90, userSelect: "none" }}>
            {/* LEARN */}
            <span className="block" style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 8.5vw, 6.5rem)",
              fontWeight: 300,
              color: "rgba(245,237,214,0.65)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}>Learn,</span>

            {/* DOMINATE */}
            <span className="block" style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem, 16vw, 12rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              lineHeight: 0.85,
              background: "linear-gradient(160deg, var(--parchment) 0%, var(--gold-hi) 35%, var(--gold) 60%, var(--gold-lo) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 50px rgba(201,168,76,0.30))",
            }}>Dominate.</span>
          </h1>

          {/* Ornament line */}
          <div className="flex items-center gap-4 mt-8 mb-5 animate-fade-up delay-200">
            <div className="h-px w-20 opacity-35" style={{ background: "linear-gradient(90deg,transparent,var(--gold))" }} />
            <span style={{ color: "var(--gold)", fontFamily: "var(--font-accent)", opacity: 0.45, fontSize: "0.75rem" }}>✦</span>
            <div className="h-px w-20 opacity-35" style={{ background: "linear-gradient(90deg,var(--gold),transparent)" }} />
          </div>

          {/* Tagline */}
          <p className="animate-fade-up delay-200" style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            fontSize: "clamp(0.80rem, 1.8vw, 1rem)",
            color: "rgba(191,168,130,0.50)",
            letterSpacing: "0.20em",
          }}>
            Study · Compete · Transcend &nbsp;·&nbsp; ادرس · تنافس · تقدّم
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mt-10 flex-wrap justify-center animate-fade-up delay-300">
            <Link href="/register"
              className="group inline-flex items-center gap-2.5 rounded-full font-bold uppercase tracking-widest transition-all duration-300"
              style={{
                background: "linear-gradient(135deg,var(--gold-hi),var(--gold),var(--gold-lo))",
                padding: "0.95rem 3rem",
                color: "#0A0804",
                fontFamily: "var(--font-ui)",
                fontSize: "0.78rem",
                letterSpacing: "0.18em",
                boxShadow: "0 0 0 1px rgba(201,168,76,0.35), 0 8px 40px rgba(201,168,76,0.32), 0 2px 0 rgba(0,0,0,0.45)",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(232,201,122,0.65), 0 12px 60px rgba(201,168,76,0.58), 0 2px 0 rgba(0,0,0,0.45)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,168,76,0.35), 0 8px 40px rgba(201,168,76,0.32), 0 2px 0 rgba(0,0,0,0.45)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Get Started <ArrowRight className="w-3.5 h-3.5 opacity-70" />
            </Link>

            <Link href="/login"
              className="inline-flex items-center gap-2 rounded-full uppercase tracking-widest transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(245,237,214,0.16)",
                padding: "0.95rem 2.2rem",
                color: "rgba(245,237,214,0.55)",
                fontFamily: "var(--font-ui)",
                fontSize: "0.78rem",
                letterSpacing: "0.14em",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.38)"; e.currentTarget.style.color = "rgba(245,237,214,0.88)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(245,237,214,0.16)"; e.currentTarget.style.color = "rgba(245,237,214,0.55)"; }}
            >Sign In</Link>
          </div>

          {/* Painting credit */}
          <p className="mt-12 animate-fade-up delay-400" style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            fontSize: "0.58rem",
            color: "rgba(245,237,214,0.20)",
            letterSpacing: "0.15em",
          }}>
            Caravaggio — The Calling of Saint Matthew, 1600
          </p>
        </div>

        {/* Scroll */}
        <div className="relative z-10 flex justify-center pb-8 animate-fade-up delay-500">
          <div className="flex flex-col items-center gap-2 opacity-25">
            <span style={{ fontFamily: "var(--font-accent)", fontSize: "0.52rem", fontStyle: "italic", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--parchment-dk)" }}>scroll</span>
            <div className="w-px h-10 overflow-hidden" style={{ background: "rgba(201,168,76,0.15)" }}>
              <div className="absolute inset-x-0 top-0 h-full" style={{ background: "linear-gradient(180deg, var(--gold), transparent)", animation: "scroll-line 2s ease-in-out infinite" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-32 px-5" style={{
        background: "linear-gradient(180deg,#050302 0%,#080510 45%,#060408 100%)"
      }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-px" style={{
          background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.55), transparent)"
        }} />

        <div className="max-w-5xl mx-auto text-center">
          <p className="eyebrow justify-center mb-5">Built for serious students</p>
          <h2 className="mb-3" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--parchment-dk), var(--parchment), var(--gold-hi))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Everything you need to excel</h2>
          <p className="mb-16 text-sm" style={{ color: "var(--tx-3)", fontFamily: "var(--font-accent)", fontStyle: "italic", letterSpacing: "0.08em" }}>
            كل ما تحتاجه في مكان واحد
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="glass-card frame rounded-2xl p-6 text-right animate-fade-up group transition-all duration-300 cursor-none"
                style={{ animationDelay: `${i * 70}ms` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b2)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--glow-gold-sm)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.20)" }}
                >
                  <f.icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
                </div>
                <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--parchment)", fontFamily: "var(--font-display)" }}>{f.en}</h3>
                  <span className="text-xs" style={{ color: "var(--tx-3)", fontFamily: "var(--font-ui)" }}>· {f.ar}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--tx-3)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════════ */}
      <section className="relative py-32 px-5 text-center overflow-hidden" style={{ background: "#040205" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(201,168,76,0.055) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-lg mx-auto">
          <p className="eyebrow justify-center mb-6">Begin your ascent</p>

          <h2 className="mb-4" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            background: "linear-gradient(160deg, var(--parchment), var(--gold-hi), var(--gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Your journey<br/>starts now.</h2>

          <p className="mb-12 text-sm" style={{ color: "var(--tx-3)", fontFamily: "var(--font-accent)", fontStyle: "italic", letterSpacing: "0.10em" }}>
            سجّل مجاناً وابدأ مع آلاف الطلاب
          </p>

          <Link href="/register"
            className="inline-flex items-center gap-2.5 rounded-full font-bold uppercase tracking-[0.18em] transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--gold-hi), var(--gold), var(--gold-lo))",
              padding: "1.05rem 3.5rem",
              color: "#0A0804",
              fontFamily: "var(--font-ui)",
              fontSize: "0.80rem",
              boxShadow: "0 0 60px rgba(201,168,76,0.28), 0 2px 0 rgba(0,0,0,0.5)",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 80px rgba(201,168,76,0.55), 0 2px 0 rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 60px rgba(201,168,76,0.28), 0 2px 0 rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >✦ &nbsp;Create Free Account</Link>

          <div className="mt-16 divider-gold max-w-[180px] mx-auto" />
          <p className="mt-5 text-xs" style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", color: "var(--tx-4)", letterSpacing: "0.10em" }}>
            "العلم نور يضيء ظلمات الجهل"
          </p>
        </div>
      </section>
    </>
  );
}
