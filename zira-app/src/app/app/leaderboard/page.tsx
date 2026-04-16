import { createClient } from "@/lib/supabase/server";
import { Trophy, Flame, Clock, Coins, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "المتصدرون" };

type UserRow = { id: string; username: string; total_study_minutes: number; streak: number; coins: number; subscription?: string };

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: byMinutes } = await supabase
    .from("profiles")
    .select("id, username, total_study_minutes, streak, coins, subscription")
    .order("total_study_minutes", { ascending: false })
    .limit(20) as unknown as { data: UserRow[] | null };

  const { data: byStreak } = await supabase
    .from("profiles")
    .select("id, username, total_study_minutes, streak, coins")
    .order("streak", { ascending: false })
    .limit(20) as unknown as { data: UserRow[] | null };

  const { data: byCoins } = await supabase
    .from("profiles")
    .select("id, username, total_study_minutes, streak, coins")
    .order("coins", { ascending: false })
    .limit(20) as unknown as { data: UserRow[] | null };

  const myRank = byMinutes?.findIndex((p: UserRow) => p.id === user?.id) ?? -1;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--gold-glow)] border border-[rgba(245,166,35,0.3)] mb-3">
          <Trophy className="w-8 h-8 text-[var(--gold)]" />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)]">المتصدرون</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">
          {myRank >= 0 ? `مرتبتك: #${myRank + 1} 🎯` : "سجّل دراسة لتظهر في القائمة"}
        </p>
      </div>

      {/* Top 3 podium */}
      {byMinutes && byMinutes.length >= 3 && (
        <div className="flex items-end justify-center gap-3 py-4">
          {/* 2nd */}
          <PodiumCard user={byMinutes[1]} rank={2} currentUserId={user?.id} />
          {/* 1st */}
          <PodiumCard user={byMinutes[0]} rank={1} currentUserId={user?.id} />
          {/* 3rd */}
          <PodiumCard user={byMinutes[2]} rank={3} currentUserId={user?.id} />
        </div>
      )}

      {/* Tabs */}
      <LeaderboardSection
        title="أكثر دراسةً"
        icon={<Clock className="w-4 h-4" />}
        users={byMinutes ?? []}
        valueKey="total_study_minutes"
        valueLabel={(v) => `${Math.floor(v / 60)} ساعة`}
        color="gold"
        currentUserId={user?.id}
      />

      <LeaderboardSection
        title="أطول سلسلة"
        icon={<Flame className="w-4 h-4" />}
        users={byStreak ?? []}
        valueKey="streak"
        valueLabel={(v) => `${v} يوم`}
        color="red"
        currentUserId={user?.id}
      />

      <LeaderboardSection
        title="أغنى المزارعين"
        icon={<Coins className="w-4 h-4" />}
        users={byCoins ?? []}
        valueKey="coins"
        valueLabel={(v) => `${v.toLocaleString("ar")} 🪙`}
        color="green"
        currentUserId={user?.id}
      />
    </div>
  );
}

function PodiumCard({ user, rank, currentUserId }: { user: UserRow; rank: 1 | 2 | 3; currentUserId?: string }) {
  const isMe = user.id === currentUserId;
  const config = {
    1: { bg: "bg-[var(--gold)]", text: "text-[#0B0B12]", h: "h-32", crown: true },
    2: { bg: "bg-zinc-400", text: "text-[#0B0B12]", h: "h-24", crown: false },
    3: { bg: "bg-amber-700", text: "text-white", h: "h-20", crown: false },
  }[rank];

  return (
    <div className="flex flex-col items-center gap-2">
      {config.crown && <Crown className="w-5 h-5 text-[var(--gold)] animate-float" />}
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
        config.bg, config.text,
        isMe && "ring-2 ring-[var(--purple)] ring-offset-2 ring-offset-[var(--bg-base)]"
      )}>
        {user.username[0]?.toUpperCase()}
      </div>
      <p className="text-xs font-medium text-[var(--text)] max-w-[60px] truncate text-center">{user.username}</p>
      <div className={cn("w-16 rounded-t-xl flex items-center justify-center", config.h, config.bg)}>
        <span className={cn("text-xl font-bold", config.text)}>#{rank}</span>
      </div>
    </div>
  );
}

function LeaderboardSection({
  title, icon, users, valueKey, valueLabel, color, currentUserId,
}: {
  title: string;
  icon: React.ReactNode;
  users: UserRow[];
  valueKey: keyof UserRow;
  valueLabel: (v: number) => string;
  color: "gold" | "red" | "green";
  currentUserId?: string;
}) {
  const colors = {
    gold: "text-[var(--gold)] bg-[var(--gold-glow)]",
    red: "text-[var(--red)] bg-[var(--red-glow)]",
    green: "text-[var(--green)] bg-[var(--green-glow)]",
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-2 rounded-xl", colors[color].split(" ")[1])}>
          <span className={colors[color].split(" ")[0]}>{icon}</span>
        </div>
        <h2 className="font-semibold text-[var(--text)]">{title}</h2>
      </div>

      <div className="space-y-1">
        {users.slice(0, 10).map((u, i) => {
          const isMe = u.id === currentUserId;
          const val = u[valueKey] as number;

          return (
            <div
              key={u.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                isMe
                  ? "bg-[var(--gold-glow2)] border border-[rgba(245,166,35,0.2)]"
                  : "hover:bg-[var(--bg-surface2)]"
              )}
            >
              {/* Rank badge */}
              <span className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                i === 0 ? "bg-[var(--gold)] text-[#0B0B12]" :
                i === 1 ? "bg-zinc-400 text-[#0B0B12]" :
                i === 2 ? "bg-amber-700 text-white" :
                "bg-[var(--bg-surface3)] text-[var(--text-muted)]"
              )}>
                {i + 1}
              </span>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--orange)] flex items-center justify-center text-[#0B0B12] font-bold text-sm shrink-0">
                {u.username[0]?.toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", isMe ? "text-[var(--gold)]" : "text-[var(--text)]")}>
                  {u.username}
                  {isMe && <span className="text-[10px] mr-1 text-[var(--text-muted)]">(أنت)</span>}
                </p>
                {u.subscription === "premium" && (
                  <span className="text-[9px] text-[var(--purple)]">⭐ برميم</span>
                )}
              </div>

              {/* Value */}
              <span className={cn("text-sm font-bold", colors[color].split(" ")[0])}>
                {valueLabel(val)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
