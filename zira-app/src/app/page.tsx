"use client";

import Link from "next/link";
import { LayoutGrid, ScanLine, Timer, Users, Bot, Trophy, BookOpen, Sprout } from "lucide-react";
import { RenaissanceCursor } from "@/components/renaissance/cursor";
import { FilmGrain } from "@/components/renaissance/grain";
import { GoldParticles } from "@/components/renaissance/particles";

/* ─────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <>
      <RenaissanceCursor />
      <FilmGrain opacity={0.055} />
      <GoldParticles count={22} />

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-baroque">

        {/* Slow breathing scale */}
        <div className="absolute inset-0 animate-bg-breathe" />

        {/* Heavy vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 75% 70% at 50% 38%, transparent 20%, rgba(0,0,0,0.60) 65%, rgba(0,0,0,0.92) 100%)"
        }} />

        {/* Horizontal gold shimmer line — top */}
        <div className="absolute top-0 inset-x-0 h-px" style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.55) 30%, rgba(232,201,122,0.80) 50%, rgba(201,168,76,0.55) 70%, transparent 100%)"
        }} />

        {/* Bottom oil-black fade */}
        <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none" style={{
          background: "linear-gradient(0deg, #050302 0%, transparent 100%)"
        }} />

        {/* ── NAVBAR ────────────────────────────────────────────────── */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-14 py-7">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(201,168,76,0.12)",
                border: "1px solid rgba(201,168,76,0.45)",
                boxShadow: "0 0 14px rgba(201,168,76,0.18)",
              }}
            >
              <span className="text-base font-black" style={{
                fontFamily: "var(--font-display)",
                color: "var(--gold-hi)",
              }}>ز</span>
            </div>
            <span className="hidden sm:block font-bold text-base tracking-wide" style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, var(--parchment-dk), var(--gold-hi))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>زيرا</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-9">
            {["المميزات","الأسعار","المجتمع"].map(l => (
              <a key={l} href="#features" className="text-sm font-light tracking-wide transition-colors duration-200"
                style={{ color: "rgba(245,237,214,0.45)", fontFamily: "var(--font-ui)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(245,237,214,0.85)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,237,214,0.45)")}
              >{l}</a>
            ))}
            <Link href="/login" className="text-sm font-medium transition-all duration-200 px-4 py-1.5 rounded-full"
              style={{
                color: "rgba(245,237,214,0.70)",
                border: "1px solid rgba(201,168,76,0.25)",
                fontFamily: "var(--font-ui)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.55)";
                e.currentTarget.style.color = "var(--gold-hi)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
                e.currentTarget.style.color = "rgba(245,237,214,0.70)";
              }}
            >دخول</Link>
          </div>

          <LayoutGrid className="w-[18px] h-[18px]" style={{ color: "rgba(201,168,76,0.45)" }} />
        </nav>

        {/* ── HERO TEXT ─────────────────────────────────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5"
          style={{ marginTop: "-3rem" }}>

          {/* Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 mb-12 animate-fade-up"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.28)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--gold)" }} />
            <span className="text-xs tracking-widest" style={{
              color: "rgba(232,201,122,0.80)",
              fontFamily: "var(--font-accent)",
              fontStyle: "italic",
              letterSpacing: "0.18em",
            }}>منصة الدراسة الاجتماعية</span>
            <ScanLine className="w-3.5 h-3.5 opacity-50" style={{ color: "var(--gold)" }} />
          </div>

          {/* Big heading */}
          <h1 className="animate-fade-up delay-100" style={{ lineHeight: 0.95 }}>
            <span className="block" style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 9vw, 7rem)",
              fontWeight: 300,
              color: "rgba(245,237,214,0.75)",
              letterSpacing: "0.01em",
            }}>تفوّق،</span>

            <span className="block title-gold" style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4.5rem, 15vw, 11rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
              filter: "drop-shadow(0 0 40px rgba(201,168,76,0.35))",
            }}>مستمر.</span>
          </h1>

          {/* Divider ornament */}
          <div className="flex items-center gap-4 mt-8 mb-6 animate-fade-up delay-200">
            <div className="h-px w-16 opacity-40" style={{ background: "linear-gradient(90deg, transparent, var(--gold))" }} />
            <span className="text-xs opacity-50" style={{ color: "var(--gold)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>✦</span>
            <div className="h-px w-16 opacity-40" style={{ background: "linear-gradient(90deg, var(--gold), transparent)" }} />
          </div>

          {/* Tagline */}
          <p className="animate-fade-up delay-200" style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            fontSize: "clamp(0.85rem, 2vw, 1.05rem)",
            color: "rgba(191,168,130,0.55)",
            letterSpacing: "0.18em",
          }}>ادرس · تنافس · تقدّم</p>

          {/* CTA buttons */}
          <div className="flex items-center gap-4 mt-10 flex-wrap justify-center animate-fade-up delay-300">
            <Link href="/register"
              className="group inline-flex items-center gap-2.5 rounded-full font-bold transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, var(--gold-hi), var(--gold), var(--gold-lo))",
                padding: "0.9rem 2.8rem",
                color: "#0A0804",
                fontFamily: "var(--font-ui)",
                fontSize: "0.95rem",
                boxShadow: "0 0 0 1px rgba(201,168,76,0.3), 0 8px 32px rgba(201,168,76,0.30), 0 2px 0 rgba(0,0,0,0.4)",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(232,201,122,0.6), 0 12px 48px rgba(201,168,76,0.55), 0 2px 0 rgba(0,0,0,0.4)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 0 0 1px rgba(201,168,76,0.3), 0 8px 32px rgba(201,168,76,0.30), 0 2px 0 rgba(0,0,0,0.4)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ابدأ مجاناً
            </Link>

            <Link href="/login"
              className="inline-flex items-center gap-2 rounded-full transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(245,237,214,0.18)",
                padding: "0.9rem 2.2rem",
                color: "rgba(245,237,214,0.60)",
                fontFamily: "var(--font-ui)",
                fontSize: "0.95rem",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.40)";
                e.currentTarget.style.color = "rgba(245,237,214,0.90)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(245,237,214,0.18)";
                e.currentTarget.style.color = "rgba(245,237,214,0.60)";
              }}
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8 animate-fade-up delay-500">
          <div className="flex flex-col items-center gap-2 opacity-35">
            <span style={{
              fontFamily: "var(--font-accent)",
              fontSize: "0.55rem",
              fontStyle: "italic",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--parchment-dk)",
            }}>scroll</span>
            <div className="w-px h-10 overflow-hidden relative" style={{ background: "rgba(201,168,76,0.12)" }}>
              <div className="absolute inset-x-0 top-0 h-full" style={{
                background: "linear-gradient(180deg, var(--gold), transparent)",
                animation: "scroll-line 2s ease-in-out infinite",
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════ */}
      <section id="features" className="relative py-32 px-5" style={{
        background: "linear-gradient(180deg, #050302 0%, #090610 40%, #080508 100%)"
      }}>
        {/* Top gold rule */}
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <div className="w-[360px] h-px" style={{
            background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.50), transparent)"
          }} />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <p className="eyebrow justify-center mb-5">ما الذي يجعلك تتفوق</p>
          <h2 className="title-gold mb-4" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            fontWeight: 800,
          }}>كل ما تحتاجه في مكان واحد</h2>
          <p className="mb-16 text-sm" style={{
            color: "var(--tx-3)",
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            letterSpacing: "0.08em",
          }}>منصة متكاملة تجمع بين المتعة والإنتاجية والتنافس</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════════════════ */}
      <section className="relative py-32 px-5 text-center overflow-hidden" style={{
        background: "#060408"
      }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)"
        }} />

        <div className="relative z-10 max-w-lg mx-auto">
          <p className="eyebrow justify-center mb-5">انضم اليوم</p>

          <h2 className="title-gold mb-5" style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
          }}>رحلتك تبدأ<br/>بخطوة واحدة</h2>

          <p className="mb-12 text-sm" style={{
            color: "var(--tx-3)",
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            letterSpacing: "0.10em",
          }}>سجّل مجاناً وابدأ الدراسة مع آلاف الطلاب</p>

          <Link href="/register"
            className="inline-flex items-center gap-2.5 rounded-full font-bold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, var(--gold-hi), var(--gold), var(--gold-lo))",
              padding: "1rem 3.2rem",
              color: "#0A0804",
              fontFamily: "var(--font-ui)",
              fontSize: "1rem",
              boxShadow: "0 0 48px rgba(201,168,76,0.30), 0 2px 0 rgba(0,0,0,0.5)",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 0 64px rgba(201,168,76,0.55), 0 2px 0 rgba(0,0,0,0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 0 48px rgba(201,168,76,0.30), 0 2px 0 rgba(0,0,0,0.5)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ✦ إنشاء حساب مجاني
          </Link>

          <div className="mt-16 divider-gold max-w-[200px] mx-auto" />
          <p className="mt-6 text-xs" style={{
            fontFamily: "var(--font-accent)",
            fontStyle: "italic",
            color: "var(--tx-4)",
            letterSpacing: "0.10em",
          }}>"العلم نور يضيء ظلمات الجهل"</p>
        </div>
      </section>
    </>
  );
}

/* ─── Feature Card ─────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon, label, desc, delay
}: { icon: React.ElementType; label: string; desc: string; delay: number }) {
  return (
    <div
      className="glass-card frame rounded-2xl p-6 text-right animate-fade-up group transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--b2)";
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--glow-gold-sm)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: "rgba(201,168,76,0.10)",
          border: "1px solid rgba(201,168,76,0.22)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: "var(--gold)" }} />
      </div>
      <h3 className="font-semibold mb-2" style={{ color: "var(--tx)", fontFamily: "var(--font-ui)", fontSize: "0.95rem" }}>
        {label}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--tx-3)", fontFamily: "var(--font-ui)" }}>
        {desc}
      </p>
    </div>
  );
}

const FEATURES = [
  { icon: Timer,    label: "مؤقت التركيز",   desc: "احصل على عملات ذهبية مع كل جلسة دراسة مكتملة" },
  { icon: Users,    label: "جلسات جماعية",   desc: "ادرس مع أصدقائك في الوقت الفعلي واضرب المضاعف" },
  { icon: Bot,      label: "مساعد الذكاء",   desc: "زيرا AI يجيب على أسئلتك العلمية فوراً بالعربي" },
  { icon: Trophy,   label: "لوحة المتصدرين", desc: "تنافس مع الطلاب وتصدّر القائمة كل أسبوع" },
  { icon: BookOpen, label: "البطاقات",        desc: "أنشئ بطاقات دراسية واستذكر بأسلوب علمي فعّال" },
  { icon: Sprout,   label: "المزرعة",         desc: "حوّل دراستك إلى مزرعة حية تنمو مع تقدمك" },
];
