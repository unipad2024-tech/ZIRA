"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2, Database, Shield, ArrowUpRight, ChevronRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────
   Step result type
───────────────────────────────────────────────────────────────────────── */
interface StepResult {
  step: string;
  ok: boolean;
  msg: string;
}

export default function SetupPage() {
  const [serviceKey, setServiceKey] = useState("");
  const [managementToken, setManagementToken] = useState("");
  const [showService, setShowService] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<StepResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const run = async () => {
    if (!serviceKey && !managementToken) {
      setError("أدخل مفتاح الخدمة أو رمز الإدارة على الأقل");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceRoleKey: serviceKey || undefined,
          managementToken: managementToken || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "حدث خطأ غير متوقع");
      } else {
        setResults(data.steps);
        setDone(data.steps.every((s: StepResult) => s.ok));
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const allOk = results?.every((s) => s.ok) ?? false;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0A0804 0%, #100C10 50%, #080608 100%)",
        fontFamily: "var(--font-ui, system-ui)",
      }}
    >
      {/* ── Grain overlay ───────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}
      >
        <Link href="/" className="text-xs font-black uppercase tracking-[0.32em]"
          style={{ color: "rgba(232,201,122,0.85)", fontFamily: "var(--font-display, Georgia)" }}>
          ZIRA
        </Link>
        <span className="text-[10px] uppercase tracking-[0.24em]"
          style={{ color: "rgba(201,168,76,0.40)", fontFamily: "var(--font-accent, Georgia)", fontStyle: "italic" }}>
          Database Setup
        </span>
      </nav>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-[520px]">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="h-px w-8" style={{ background: "rgba(201,168,76,0.45)" }} />
              <span className="text-[10px] uppercase tracking-[0.26em]"
                style={{ color: "rgba(201,168,76,0.55)", fontStyle: "italic", fontFamily: "var(--font-accent, Georgia)" }}>
                One-time Setup
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display, Georgia)",
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "rgba(245,237,214,0.94)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              Initialize<br />the Database
            </h1>
            <p className="mt-3 text-sm leading-relaxed"
              style={{ color: "rgba(191,168,130,0.50)", fontStyle: "italic" }}>
              يقوم هذا بإنشاء جميع الجداول وسياسات الأمان والبيانات الأولية في Supabase.
            </p>
          </div>

          {/* ── Card ──────────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-7 space-y-6"
            style={{
              background: "rgba(16,10,8,0.85)",
              border: "1px solid rgba(201,168,76,0.14)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.50), inset 0 1px 0 rgba(201,168,76,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Service Role Key */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.55)" }} />
                <label className="text-[11px] uppercase tracking-[0.20em] font-semibold"
                  style={{ color: "rgba(201,168,76,0.65)" }}>
                  Service Role Key
                </label>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(61,122,100,0.15)", color: "rgba(61,122,100,0.85)", border: "1px solid rgba(61,122,100,0.25)" }}>
                  مطلوب
                </span>
              </div>
              <p className="text-[10px] mb-2.5" style={{ color: "rgba(191,168,130,0.38)" }}>
                Supabase Dashboard → Settings → API → service_role
              </p>
              <div className="relative">
                <input
                  type={showService ? "text" : "password"}
                  value={serviceKey}
                  onChange={e => setServiceKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full rounded-xl text-xs pr-10 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    color: "rgba(245,237,214,0.80)",
                    padding: "0.75rem 2.5rem 0.75rem 0.9rem",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)")}
                />
                <button
                  type="button"
                  onClick={() => setShowService(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(201,168,76,0.40)" }}
                >
                  {showService ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "rgba(201,168,76,0.08)" }} />

            {/* Management Token */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-3.5 h-3.5" style={{ color: "rgba(201,168,76,0.55)" }} />
                <label className="text-[11px] uppercase tracking-[0.20em] font-semibold"
                  style={{ color: "rgba(201,168,76,0.65)" }}>
                  Management Token
                </label>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(58,95,149,0.15)", color: "rgba(58,95,149,0.85)", border: "1px solid rgba(58,95,149,0.25)" }}>
                  للمخطط
                </span>
              </div>
              <p className="text-[10px] mb-2.5" style={{ color: "rgba(191,168,130,0.38)" }}>
                supabase.com/dashboard/account/tokens → Generate new token
              </p>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={managementToken}
                  onChange={e => setManagementToken(e.target.value)}
                  placeholder="sbp_..."
                  className="w-full rounded-xl text-xs pr-10 outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(201,168,76,0.18)",
                    color: "rgba(245,237,214,0.80)",
                    padding: "0.75rem 2.5rem 0.75rem 0.9rem",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)")}
                />
                <button
                  type="button"
                  onClick={() => setShowToken(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(201,168,76,0.40)" }}
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{ background: "rgba(181,42,42,0.10)", border: "1px solid rgba(181,42,42,0.25)" }}>
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#B52A2A" }} />
                <p className="text-xs leading-relaxed" style={{ color: "rgba(245,160,130,0.85)" }}>{error}</p>
              </div>
            )}

            {/* Run button */}
            <button
              onClick={run}
              disabled={loading || done}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl font-bold text-xs uppercase tracking-[0.18em] transition-all duration-300"
              style={{
                padding: "0.9rem",
                background: done
                  ? "rgba(61,122,100,0.20)"
                  : loading
                  ? "rgba(201,168,76,0.40)"
                  : "rgba(232,201,122,1)",
                color: done ? "rgba(61,122,100,0.85)" : loading ? "rgba(10,8,4,0.70)" : "#0A0804",
                border: done ? "1px solid rgba(61,122,100,0.30)" : "none",
                cursor: loading || done ? "not-allowed" : "pointer",
                boxShadow: done ? "none" : loading ? "none" : "0 8px 32px rgba(201,168,76,0.22)",
              }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> جاري التهيئة…</>
              ) : done ? (
                <><CheckCircle className="w-4 h-4" /> اكتمل الإعداد</>
              ) : (
                <>تهيئة قاعدة البيانات <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          {/* ── Results ────────────────────────────────────────────────── */}
          {results && (
            <div className="mt-5 rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(201,168,76,0.12)" }}>
              {results.map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 px-5 py-4"
                  style={{
                    background: step.ok ? "rgba(61,122,100,0.07)" : "rgba(181,42,42,0.07)",
                    borderBottom: i < results.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
                  }}
                >
                  {step.ok
                    ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "rgba(61,122,100,0.85)" }} />
                    : <XCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "rgba(181,42,42,0.85)" }} />
                  }
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold mb-0.5"
                      style={{ color: step.ok ? "rgba(61,122,100,0.90)" : "rgba(245,160,130,0.85)" }}>
                      {step.step}
                    </p>
                    <p className="text-[10px] break-all leading-relaxed"
                      style={{ color: "rgba(191,168,130,0.45)" }}>
                      {step.msg}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Done CTA ───────────────────────────────────────────────── */}
          {allOk && (
            <div className="mt-5 rounded-2xl p-5 text-center"
              style={{
                background: "rgba(61,122,100,0.08)",
                border: "1px solid rgba(61,122,100,0.22)",
              }}>
              <p className="text-sm font-semibold mb-1"
                style={{ color: "rgba(61,122,100,0.90)", fontFamily: "var(--font-display, Georgia)" }}>
                قاعدة البيانات جاهزة
              </p>
              <p className="text-[11px] mb-4" style={{ color: "rgba(191,168,130,0.50)" }}>
                جميع الجداول والسياسات والبيانات الأولية تم إنشاؤها بنجاح
              </p>
              <Link href="/register"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] rounded-full transition-all duration-200"
                style={{
                  background: "rgba(232,201,122,1)",
                  color: "#0A0804",
                  padding: "0.65rem 1.6rem",
                }}
              >
                إنشاء حساب <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* ── Guide ──────────────────────────────────────────────────── */}
          <div className="mt-8 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "rgba(201,168,76,0.35)", fontStyle: "italic" }}>
              كيفية الحصول على المفاتيح
            </p>
            {[
              {
                n: "01",
                title: "Service Role Key",
                desc: "supabase.com → Dashboard → Settings → API → service_role (secret)",
              },
              {
                n: "02",
                title: "Management Token",
                desc: "supabase.com/dashboard/account/tokens → Generate new token → Copy",
              },
              {
                n: "03",
                title: "Run Setup",
                desc: "الصق كلا المفتاحين أعلاه واضغط على \"تهيئة قاعدة البيانات\"",
              },
            ].map((item) => (
              <div key={item.n} className="flex gap-3.5 py-3 px-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.07)" }}>
                <span className="text-[9px] font-bold shrink-0 mt-0.5 uppercase tracking-[0.20em]"
                  style={{ color: "rgba(201,168,76,0.40)" }}>{item.n}</span>
                <div>
                  <p className="text-xs font-semibold mb-0.5"
                    style={{ color: "rgba(245,237,214,0.70)" }}>{item.title}</p>
                  <p className="text-[10px] leading-relaxed"
                    style={{ color: "rgba(191,168,130,0.38)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
