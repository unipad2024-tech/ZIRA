"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Timer, Sprout, Users, Trophy } from "lucide-react";

const MOBILE_NAV = [
  { href: "/app/dashboard",   label: "الرئيسية", icon: LayoutDashboard },
  { href: "/app/timer",       label: "المؤقت",   icon: Timer },
  { href: "/app/farm",        label: "المزرعة",  icon: Sprout },
  { href: "/app/sessions",    label: "الجلسات",  icon: Users },
  { href: "/app/leaderboard", label: "المتصدرين",icon: Trophy },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex md:hidden safe-area-pb"
      style={{
        background: "rgba(13,9,10,0.90)",
        backdropFilter: "blur(20px) saturate(1.3)",
        WebkitBackdropFilter: "blur(20px) saturate(1.3)",
        borderTop: "1px solid var(--b1)",
      }}
    >
      {MOBILE_NAV.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-all duration-150"
            style={{ color: isActive ? "var(--gold)" : "var(--tx-3)" }}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
