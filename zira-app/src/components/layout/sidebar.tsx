"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Timer, Sprout, Users, Bot,
  BookOpen, Microscope, Gavel, ShoppingBag,
  Trophy, User, LogOut, Coins, ChevronLeft,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useUserStore } from "@/store/user-store";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/app/dashboard",   label: "الرئيسية",     icon: LayoutDashboard },
  { href: "/app/timer",       label: "المؤقت",       icon: Timer },
  { href: "/app/farm",        label: "المزرعة",      icon: Sprout },
  { href: "/app/sessions",    label: "الجلسات",      icon: Users },
  { href: "/app/ai",          label: "المساعد الذكي", icon: Bot },
  { href: "/app/flashcards",  label: "البطاقات",     icon: BookOpen },
  { href: "/app/feed",        label: "الاكتشاف",     icon: Microscope },
  { href: "/app/auction",     label: "المزاد",       icon: Gavel },
  { href: "/app/shop",        label: "المتجر",       icon: ShoppingBag },
  { href: "/app/leaderboard", label: "المتصدرين",    icon: Trophy },
  { href: "/app/profile",     label: "الملف",        icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, coins } = useUserStore();

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    useUserStore.getState().reset();
    toast.success("تم تسجيل الخروج");
    router.push("/login");
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar shrink-0">

      {/* Logo */}
      <div
        className="p-5"
        style={{ borderBottom: "1px solid var(--b1)" }}
      >
        <div className="flex items-center gap-3">
          {/* Emblem */}
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center animate-glow-pulse shrink-0"
            style={{ background: "rgba(201,168,76,0.10)", border: "1px solid rgba(201,168,76,0.35)" }}
          >
            <span
              className="text-lg font-black"
              style={{ fontFamily: "var(--font-display)", color: "var(--gold)" }}
            >
              ز
            </span>
          </div>
          <div>
            <p
              className="text-lg font-black leading-none"
              style={{
                fontFamily: "var(--font-display)",
                background: "linear-gradient(135deg, var(--parchment-dk), var(--gold-hi), var(--gold))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              زيرا
            </p>
            <p
              className="text-[9px] mt-0.5 italic"
              style={{ color: "var(--tx-4)", fontFamily: "var(--font-accent)" }}
            >
              منصة الدراسة
            </p>
          </div>
        </div>
      </div>

      {/* Coins widget */}
      {user && (
        <div
          className="mx-3 mt-3 px-3 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{
            background: "rgba(201,168,76,0.07)",
            border: "1px solid var(--b1)",
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--gold)" }}
          >
            <Coins className="w-3.5 h-3.5" style={{ color: "var(--black)" }} />
          </div>
          <div className="flex-1">
            <p className="text-[9px]" style={{ color: "var(--tx-4)" }}>عملاتك</p>
            <p className="text-sm font-bold" style={{ color: "var(--gold)" }}>
              {coins.toLocaleString("ar")}
            </p>
          </div>
          {user.subscription === "premium" && (
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                color: "var(--premium)",
                background: "rgba(155,89,182,0.15)",
                border: "1px solid rgba(155,89,182,0.3)",
              }}
            >
              برميم
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="mx-4 my-3 divider-gold opacity-30" />

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
              )}
              style={
                isActive
                  ? {
                      background: "rgba(201,168,76,0.10)",
                      border: "1px solid var(--b1)",
                      color: "var(--gold)",
                      boxShadow: "var(--glow-gold-sm)",
                    }
                  : {
                      border: "1px solid transparent",
                      color: "var(--tx-3)",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--tx-2)";
                  e.currentTarget.style.background = "rgba(201,168,76,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--tx-3)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <ChevronLeft className="w-3 h-3 mr-auto opacity-40" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 my-3 divider-gold opacity-30" />

      {/* User + Logout */}
      <div className="p-3 space-y-1">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--gold-lo), var(--gold))",
                color: "var(--black)",
              }}
            >
              {user.username?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--tx)" }}>
                {user.username}
              </p>
              <p className="text-[10px] truncate" style={{ color: "var(--tx-4)" }}>
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150"
          style={{ color: "var(--tx-3)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--crimson-hi)";
            e.currentTarget.style.background = "rgba(181,42,42,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--tx-3)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
