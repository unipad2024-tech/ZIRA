import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Timer, Sprout, Users, Trophy, Flame, Coins, Clock, Star, ArrowUpRight, Zap, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Zira" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user.id).single();

  const { data: challengesRaw } = await supabase
    .from("user_challenges")
    .select("*, challenge:challenges(*)")
    .eq("user_id", user.id).eq("completed", false).limit(3);

  const challenges = challengesRaw as unknown as Array<{
    id: string; progress_minutes: number;
    challenge: { title_ar: string; requirement_minutes: number; reward_coins: number } | null;
  }> | null;

  const { data: achievementsRaw } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false }).limit(4);

  const achievements = achievementsRaw as unknown as Array<{
    id: string;
    achievement: { name_ar: string; icon: string; badge: string } | null;
  }> | null;

  const { data: topUsers } = await supabase
    .from("profiles")
    .select("id, username, total_study_minutes, streak, coins")
    .order("total_study_minutes", { ascending: false })
    .limit(5) as unknown as {
      data: Array<{ id: string; username: string; total_study_minutes: number; streak: number; coins: number }> | null
    };

  const p = profile ?? { username: "Scholar", coins: 0, streak: 0, total_study_minutes: 0, subscription: "free" };
  const hours = Math.floor((p.total_study_minutes ?? 0) / 60);
  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.20em] mb-1.5"
            style={{ color: "var(--tx-3)", fontFamily: "var(--font-ui)" }}>
            {greeting}
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 800,
            color: "var(--tx)",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}>
            {p.username}
          </h1>
        </div>
        {p.subscription === "premium" && (
          <Badge variant="gold" size="md">⭐ Premium</Badge>
        )}
      </div>

      {/* Gold rule */}
      <div className="divider-gold opacity-30" />

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Coins",        value: (p.coins ?? 0).toLocaleString(), icon: <Coins className="w-4 h-4" />,  color: "gold"   },
          { label: "Day Streak",   value: `${p.streak ?? 0}`,              icon: <Flame className="w-4 h-4" />,  color: "red"    },
          { label: "Study Hours",  value: `${hours}h`,                      icon: <Clock className="w-4 h-4" />,  color: "blue"   },
          { label: "Total Minutes",value: (p.total_study_minutes ?? 0).toLocaleString(), icon: <Star className="w-4 h-4" />, color: "purple" },
        ].map(s => <StatBlock key={s.label} {...s} />)}
      </div>

      {/* ── Quick Actions ────────────────────────────────────────────── */}
      <div>
        <SectionLabel label="Quick Actions" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {QUICK_ACTIONS.map(a => (
            <Link key={a.href} href={a.href}
              className="group relative rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "rgba(20,14,10,0.80)",
                border: "1px solid rgba(201,168,76,0.10)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.28)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.10)"; }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: a.iconBg, border: `1px solid ${a.iconBorder}` }}
              >
                <a.icon className="w-4 h-4" style={{ color: a.iconColor }} />
              </div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--tx)", fontFamily: "var(--font-ui)" }}>{a.label}</p>
              <p className="text-xs" style={{ color: "var(--tx-3)" }}>{a.desc}</p>
              <ArrowUpRight className="absolute top-4 right-4 w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity"
                style={{ color: "var(--gold)" }} />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* ── Active Challenges ────────────────────────────────────── */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(14,10,8,0.80)", border: "1px solid rgba(201,168,76,0.10)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <SectionLabel label="Active Challenges" />
            <Link href="/app/dashboard" className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: "var(--tx-3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--tx-3)")}
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {challenges && challenges.length > 0 ? (
            <div className="space-y-3">
              {challenges.map(uc => {
                const c = uc.challenge;
                if (!c) return null;
                const pct = Math.min(100, Math.round((uc.progress_minutes / c.requirement_minutes) * 100));
                return (
                  <div key={uc.id} className="rounded-xl p-3.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-sm font-medium" style={{ color: "var(--tx)" }}>{c.title_ar}</p>
                      <span className="text-xs font-semibold" style={{ color: "var(--gold)" }}>+{c.reward_coins} coins</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--gold-lo), var(--gold))" }}
                      />
                    </div>
                    <p className="text-[10px] mt-1.5" style={{ color: "var(--tx-4)" }}>
                      {uc.progress_minutes} / {c.requirement_minutes} min · {pct}%
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon="🎯" text="No active challenges" sub="Complete sessions to unlock them" />
          )}
        </div>

        {/* ── Leaderboard ──────────────────────────────────────────── */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(14,10,8,0.80)", border: "1px solid rgba(201,168,76,0.10)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <SectionLabel label="Leaderboard" />
            <Link href="/app/leaderboard" className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: "var(--tx-3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--tx-3)")}
            >
              Full rankings <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-1">
            {topUsers?.map((u, i) => (
              <div key={u.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                style={u.id === user.id
                  ? { background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }
                  : { border: "1px solid transparent" }
                }
              >
                <span className="text-xs font-bold w-5 text-center shrink-0"
                  style={{ color: i === 0 ? "var(--gold)" : i === 1 ? "rgba(200,200,200,0.7)" : i === 2 ? "rgba(180,110,40,0.8)" : "var(--tx-4)" }}>
                  {i + 1}
                </span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--gold-lo), var(--gold))", color: "var(--black)" }}>
                  {u.username[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--tx)" }}>{u.username}</p>
                  <p className="text-[10px]" style={{ color: "var(--tx-4)" }}>{Math.floor(u.total_study_minutes / 60)}h studied</p>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--tx-3)" }}>
                  <Flame className="w-3 h-3" style={{ color: "var(--crimson-hi)" }} />
                  {u.streak}d
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Achievements ──────────────────────────────────────── */}
      {achievements && achievements.length > 0 && (
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(14,10,8,0.80)", border: "1px solid rgba(201,168,76,0.10)" }}
        >
          <SectionLabel label="Recent Achievements" className="mb-5" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map(ua => {
              const a = ua.achievement;
              if (!a) return null;
              return (
                <div key={ua.id} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-xs font-medium" style={{ color: "var(--tx)" }}>{a.name_ar}</p>
                  <Badge variant={a.badge === "gold" ? "gold" : "surface"} size="sm">
                    {a.badge === "gold" ? "Gold" : a.badge === "silver" ? "Silver" : "Bronze"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Daily Tip ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 rounded-2xl p-5"
        style={{ background: "rgba(155,89,182,0.07)", border: "1px solid rgba(155,89,182,0.18)" }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(155,89,182,0.12)", border: "1px solid rgba(155,89,182,0.25)" }}
        >
          <Zap className="w-5 h-5" style={{ color: "var(--premium)" }} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] mb-1 font-semibold" style={{ color: "var(--premium)" }}>
            Today's Tip
          </p>
          <p className="text-sm" style={{ color: "var(--tx)" }}>
            Tackle your hardest subject first — your brain performs best at the start of a session.
          </p>
        </div>
      </div>

    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */

function SectionLabel({ label, className = "" }: { label: string; className?: string }) {
  return (
    <p className={`text-[10px] uppercase tracking-[0.22em] ${className}`}
      style={{ color: "var(--tx-3)", fontFamily: "var(--font-ui)" }}>
      {label}
    </p>
  );
}

function StatBlock({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  const c: Record<string, { text: string; bg: string; border: string }> = {
    gold:   { text: "var(--gold)",        bg: "rgba(201,168,76,0.10)",  border: "rgba(201,168,76,0.22)" },
    red:    { text: "var(--crimson-hi)",  bg: "rgba(181,42,42,0.10)",   border: "rgba(181,42,42,0.22)"  },
    blue:   { text: "var(--azure)",       bg: "rgba(58,95,149,0.10)",   border: "rgba(58,95,149,0.22)"  },
    purple: { text: "var(--premium)",     bg: "rgba(155,89,182,0.10)",  border: "rgba(155,89,182,0.22)" },
  };
  const s = c[color];
  return (
    <div className="rounded-2xl p-5 flex items-center gap-3.5"
      style={{ background: "rgba(14,10,8,0.80)", border: "1px solid rgba(201,168,76,0.10)" }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: s.bg, border: `1px solid ${s.border}` }}>
        <span style={{ color: s.text }}>{icon}</span>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--tx-4)" }}>{label}</p>
        <p className="text-xl font-bold mt-0.5" style={{ color: "var(--tx)", fontFamily: "var(--font-display)" }}>{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, sub }: { icon: string; text: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
      <span className="text-3xl opacity-40">{icon}</span>
      <p className="text-sm font-medium" style={{ color: "var(--tx-3)" }}>{text}</p>
      <p className="text-xs" style={{ color: "var(--tx-4)" }}>{sub}</p>
    </div>
  );
}

const QUICK_ACTIONS = [
  { href: "/app/timer",      label: "Study Now",      desc: "Start a focus session",  icon: Timer,   iconBg: "rgba(181,42,42,0.10)",   iconBorder: "rgba(181,42,42,0.22)",   iconColor: "var(--crimson-hi)" },
  { href: "/app/sessions",   label: "Group Session",  desc: "Study with friends",     icon: Users,   iconBg: "rgba(58,95,149,0.10)",   iconBorder: "rgba(58,95,149,0.22)",   iconColor: "var(--azure)"      },
  { href: "/app/farm",       label: "My Farm",        desc: "Grow your collection",   icon: Sprout,  iconBg: "rgba(61,122,100,0.10)",  iconBorder: "rgba(61,122,100,0.22)",  iconColor: "var(--verdigris-hi)"},
  { href: "/app/flashcards", label: "Flashcards",     desc: "Review your decks",      icon: BookOpen,iconBg: "rgba(201,168,76,0.10)",  iconBorder: "rgba(201,168,76,0.22)",  iconColor: "var(--gold)"       },
];
