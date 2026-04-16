"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RenaissanceCursor } from "@/components/renaissance/cursor";
import { GoldParticles } from "@/components/renaissance/particles";
import { FilmGrain } from "@/components/renaissance/grain";
import { ConcentricRings } from "@/components/renaissance/rings";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const schema = z.object({
  email:    z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور أقل من 6 أحرف"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      toast.error("فشل تسجيل الدخول", { description: "تحقق من بريدك وكلمة المرور" });
      setLoading(false);
      return;
    }
    toast.success("أهلاً بعودتك ✦");
    router.push("/app/dashboard");
    router.refresh();
  };

  return (
    <>
      <RenaissanceCursor />
      <FilmGrain opacity={0.04} />
      <GoldParticles count={20} />

      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-renaissance">

        {/* Breathing background */}
        <div className="absolute inset-0 animate-bg-breathe" />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)" }}
        />

        {/* Concentric rings behind content */}
        <ConcentricRings className="opacity-40" />

        {/* Bottom dark fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(0deg, var(--c0) 0%, transparent 100%)" }}
        />

        {/* CONTENT */}
        <div className="relative z-10 w-full max-w-[420px] px-4">

          {/* Logo */}
          <div className="text-center mb-10 animate-fade-up">
            <div className="inline-flex flex-col items-center gap-2">
              {/* Ornate emblem */}
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
              <p className="eyebrow mt-1">منصة الدراسة الاجتماعية</p>
            </div>
          </div>

          {/* Glass card */}
          <div
            className="glass-card frame-gold rounded-2xl p-8 animate-fade-up delay-200"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), var(--glow-gold-sm)" }}
          >
            <div className="mb-6">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-parchment">
                تسجيل الدخول
              </h2>
              <p className="text-ghost-r text-sm mt-1" style={{ fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                أدخل بياناتك للمتابعة
              </p>
            </div>

            <div className="divider-gold mb-6" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="البريد الإلكتروني"
                type="email" dir="ltr"
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="كلمة المرور"
                type={showPass ? "text" : "password"} dir="ltr"
                placeholder="••••••••"
                icon={
                  <button type="button" onClick={() => setShowPass(!showPass)} className="cursor-none">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="flex justify-end">
                <Link href="/forgot-password"
                  className="text-xs font-[family-name:var(--font-cormorant)] italic tracking-wide"
                  style={{ color: "var(--tx-3)" }}
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
                دخول
              </Button>
            </form>

            <div className="divider-gold my-6" />

            <p className="text-center text-sm" style={{ color: "var(--tx-3)" }}>
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-gold font-semibold hover:text-shimmer transition-all">
                إنشاء حساب
              </Link>
            </p>
          </div>

          {/* Bottom quote */}
          <p
            className="text-center mt-8 text-xs animate-fade-up delay-400"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tx-4)",
              letterSpacing: "0.05em",
            }}
          >
            "العلم نور يضيء ظلمات الجهل"
          </p>
        </div>
      </div>
    </>
  );
}
