import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Timer, Sprout, Users, Trophy, Flame, Coins, Clock, Star, ArrowLeft, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "الرئيسية" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: challengesRaw } = await supabase
    .from("user_challenges")
    .select("*, challenge:challenges(*)")
    .eq("user_id", user.id)
    .eq("completed", false)
    .limit(3);

  const challenges = challengesRaw as unknown as Array<{
    id: string;
    progress_minutes: number;
    challenge: { title_ar: string; description_ar: string; requirement_minutes: number; reward_coins: number } | null;
  }> | null;

  const { data: achievementsRaw } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })
    .limit(4);

  const achievements = achievementsRaw as unknown as Array<{
    id: string;
    achievement: { name_ar: string; icon: string; badge: string } | null;
  }> | null;

  const { data: topUsers } = await supabase
    .from("profiles")
    .select("id, username, total_study_minutes, streak, coins")
    .order("total_study_minutes", { ascending: false })
    .limit(5) as unknown as { data: Array<{ id: string; username: string; total_study_minutes: number; streak: number; coins: number; subscription?: string }> | null };

  const p = profile ?? { username: "مستخدم", coins: 0, streak: 0, total_study_minutes: 0, subscription: "free" };
  const hours = Math.floor((p.total_study_minutes ?? 0) / 60);
  const greeting = new Date().getHours() < 12 ? "صباح الخير" : new Date().getHours() < 18 ? "مساء الخير" : "مساء النور";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[var(--text-muted)] text-sm">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-0.5">
            {p.username}
          </h1>
        </div>
        {p.subscription === "premium" && (
          <Badge variant="purple" size="md">⭐ برميم</Badge>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Coins className="w-5 h-5" />} label="العملات" value={p.coins?.toLocaleString("ar") ?? "0"} color="gold" />
        <StatCard icon={<Flame className="w-5 h-5" />} label="السلسلة" value={`${p.streak ?? 0} يوم`} color="red" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="ساعات الدراسة" value={`${hours} ساعة`} color="blue" />
        <StatCard icon={<Star className="w-5 h-5" />} label="الدقائق الكلية" value={`${(p.total_study_minutes ?? 0).toLocaleString("ar")}`} color="purple" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-semibold text-[var(--text)] mb-3">ماذا تريد أن تفعل؟</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`relative rounded-2xl p-4 border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group ${action.bg} ${action.border}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${action.hoverBg}`} />
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center mb-3`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <p className="font-semibold text-[var(--text)] text-sm">{action.label}</p>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Challenges */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text)]">التحديات النشطة</h2>
            <Link href="/app/dashboard" className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] flex items-center gap-1">
              الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          {challenges && challenges.length > 0 ? (
            <div className="space-y-3">
              {challenges.map((uc) => {
                const c = uc.challenge;
                if (!c) return null;
                const progress = Math.min(100, Math.round((uc.progress_minutes / c.requirement_minutes) * 100));
                return (
                  <div key={uc.id} className="bg-[var(--bg-surface2)] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[var(--text)]">{c.title_ar}</p>
                      <Badge variant="gold" size="sm">+{c.reward_coins} 🪙</Badge>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--bg-surface3)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">{uc.progress_minutes} / {c.requirement_minutes} دقيقة</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon="🎯" text="لا توجد تحديات نشطة حالياً" />
          )}
        </div>

        {/* Leaderboard mini */}
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text)]">المتصدرون</h2>
            <Link href="/app/leaderboard" className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] flex items-center gap-1">
              الكل <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {topUsers?.map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 p-2.5 rounded-xl ${u.id === user.id ? "bg-[var(--gold-glow2)] border border-[rgba(245,166,35,0.15)]" : "hover:bg-[var(--bg-surface2)]"} transition-colors`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? "bg-[var(--gold)] text-[#0B0B12]" :
                  i === 1 ? "bg-zinc-400 text-[#0B0B12]" :
                  i === 2 ? "bg-amber-700 text-white" :
                  "bg-[var(--bg-surface3)] text-[var(--text-muted)]"
                }`}>{i + 1}</span>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--orange)] flex items-center justify-center text-[#0B0B12] font-bold text-xs">
                  {u.username[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">{u.username}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{Math.floor(u.total_study_minutes / 60)} ساعة</p>
                </div>
                <div className="flex items-center gap-1 text-[var(--gold)] text-xs font-medium">
                  <Flame className="w-3 h-3" />
                  {u.streak}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent achievements */}
      {achievements && achievements.length > 0 && (
        <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4">إنجازاتك الأخيرة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {achievements.map((ua) => {
              const a = ua.achievement;
              if (!a) return null;
              return (
                <div key={ua.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-surface2)] border border-[var(--border)]">
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-xs font-medium text-[var(--text)] text-center">{a.name_ar}</p>
                  <Badge
                    variant={a.badge === "gold" ? "gold" : a.badge === "silver" ? "surface" : "surface"}
                    size="sm"
                  >
                    {a.badge === "gold" ? "🥇 ذهبي" : a.badge === "silver" ? "🥈 فضي" : "🥉 برونزي"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily tip */}
      <div className="rounded-2xl bg-gradient-to-r from-[var(--bg-surface2)] to-[var(--bg-surface3)] border border-[var(--border)] p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--purple-glow)] border border-[rgba(168,85,247,0.3)] flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-[var(--purple)]" />
        </div>
        <div>
          <p className="text-xs text-[var(--purple)] font-semibold mb-0.5">نصيحة اليوم</p>
          <p className="text-sm text-[var(--text)]">ابدأ بأصعب مادة أولاً — عقلك يكون في أفضل حالاته في بداية الجلسة.</p>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    gold: "text-[var(--gold)] bg-[var(--gold-glow)]",
    red: "text-[var(--red)] bg-[var(--red-glow)]",
    blue: "text-[var(--blue)] bg-[var(--blue-glow)]",
    purple: "text-[var(--purple)] bg-[var(--purple-glow)]",
  };
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3">
      <div className={`p-2.5 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-[10px] text-[var(--text-muted)]">{label}</p>
        <p className="text-base font-bold text-[var(--text)] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2">
      <span className="text-3xl">{icon}</span>
      <p className="text-sm text-[var(--text-muted)]">{text}</p>
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    href: "/app/timer",
    label: "ابدأ الدراسة",
    desc: "شغّل مؤقت التركيز",
    icon: Timer,
    bg: "bg-[var(--bg-surface)]",
    border: "border-[var(--border)]",
    hoverBg: "bg-[var(--red-glow)]",
    iconBg: "bg-[var(--red-glow)]",
    iconColor: "text-[var(--red)]",
  },
  {
    href: "/app/sessions",
    label: "جلسة جماعية",
    desc: "ادرس مع أصدقائك",
    icon: Users,
    bg: "bg-[var(--bg-surface)]",
    border: "border-[var(--border)]",
    hoverBg: "bg-[var(--blue-glow)]",
    iconBg: "bg-[var(--blue-glow)]",
    iconColor: "text-[var(--blue)]",
  },
  {
    href: "/app/farm",
    label: "مزرعتي",
    desc: "طوّر مزرعتك",
    icon: Sprout,
    bg: "bg-[var(--bg-surface)]",
    border: "border-[var(--border)]",
    hoverBg: "bg-[var(--green-glow)]",
    iconBg: "bg-[var(--green-glow)]",
    iconColor: "text-[var(--green)]",
  },
  {
    href: "/app/flashcards",
    label: "البطاقات",
    desc: "راجع دروسك",
    icon: Star,
    bg: "bg-[var(--bg-surface)]",
    border: "border-[var(--border)]",
    hoverBg: "bg-[var(--gold-glow)]",
    iconBg: "bg-[var(--gold-glow)]",
    iconColor: "text-[var(--gold)]",
  },
];
