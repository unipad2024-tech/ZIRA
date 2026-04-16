"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RenaissanceCursor } from "@/components/renaissance/cursor";
import { GoldParticles } from "@/components/renaissance/particles";
import { FilmGrain } from "@/components/renaissance/grain";
import { ConcentricRings } from "@/components/renaissance/rings";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error("حدث خطأ", { description: error.message });
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  return (
    <>
      <RenaissanceCursor />
      <FilmGrain opacity={0.04} />
      <GoldParticles count={15} />

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-renaissance">

        <div className="absolute inset-0 animate-bg-breathe" />

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)" }}
        />

        <ConcentricRings className="opacity-30" />

        <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(0deg, var(--c0) 0%, transparent 100%)" }}
        />

        <div className="relative z-10 w-full max-w-[400px] px-4">

          {/* Logo */}
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="relative w-16 h-16 mb-1">
                <div className="absolute inset-0 rounded-2xl animate-glow-pulse"
                  style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.4)" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-[family-name:var(--font-playfair)] font-black text-gold">ز</span>
                </div>
              </div>
              <h1 className="title-gold text-5xl font-[family-name:var(--font-playfair)] font-black tracking-tight">
                زيرا
              </h1>
            </div>
          </div>

          {/* Glass card */}
          <div
            className="glass-card frame-gold rounded-2xl p-8 animate-fade-up delay-200"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), var(--glow-gold-sm)" }}
          >
            {sent ? (
              <div className="text-center space-y-5 py-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full animate-glow-pulse"
                    style={{ background: "rgba(61,122,100,0.15)", border: "1px solid rgba(61,122,100,0.4)" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7" style={{ color: "var(--verdigris-hi)" }} />
                  </div>
                </div>

                <div className="divider-gold" />

                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-parchment mb-2">
                    تم الإرسال
                  </h2>
                  <p className="text-sm" style={{ color: "var(--tx-3)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                    تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="inline-block text-sm font-semibold transition-all"
                  style={{ color: "var(--gold)" }}
                >
                  العودة لتسجيل الدخول
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-parchment">
                    نسيت كلمة المرور؟
                  </h2>
                  <p className="text-ghost-r text-sm mt-1" style={{ fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                    أدخل بريدك وسنرسل لك رابط الاسترداد
                  </p>
                </div>

                <div className="divider-gold mb-6" />

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="البريد الإلكتروني"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    required
                  />
                  <Button type="submit" size="lg" className="w-full" loading={loading}>
                    إرسال رابط الاسترداد
                  </Button>
                </form>

                <div className="divider-gold mt-6 mb-4" />

                <div className="text-center">
                  <Link href="/login" className="text-sm transition-all" style={{ color: "var(--tx-3)" }}>
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </>
            )}
          </div>

          <p
            className="text-center mt-8 text-xs animate-fade-up delay-400"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tx-4)",
              letterSpacing: "0.05em",
            }}
          >
            "الذاكرة كنز العقل"
          </p>
        </div>
      </div>
    </>
  );
}
