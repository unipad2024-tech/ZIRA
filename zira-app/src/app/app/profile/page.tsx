import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { User, Flame, Clock, Coins, Trophy, Crown, Star, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "ملفي الشخصي" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const { data: achievementsRaw } = await supabase
    .from("user_achievements")
    .select("*, achievement:achievements(*)")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });

  const achievements = achievementsRaw as unknown as Array<{
    id: string;
    achievement: { name_ar: string; icon: string; badge: string } | null;
  }> | null;

  const { data: farmCount } = await supabase.from("farm_items").select("id", { count: "exact", head: true }).eq("user_id", user.id);
  const { data: flashcardCount } = await supabase.from("flashcard_sets").select("id", { count: "exact", head: true }).eq("user_id", user.id);

  const p = profile ?? { username: "مستخدم", email: user.email, coins: 0, streak: 0, total_study_minutes: 0, subscription: "free", premium_expires_at: null, created_at: user.created_at };
  const hours = Math.floor((p.total_study_minutes ?? 0) / 60);
  const isPremium = p.subscription === "premium";
  const joinedDate = new Date(p.created_at).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      {/* Profile card */}
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#1a1a3e] via-[#2a1a3e] to-[#1a2a3e]">
          <div className="h-full w-full" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(245,166,35,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.15) 0%, transparent 50%)"
          }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gold)] to-[var(--orange)] flex items-center justify-center text-[#0B0B12] font-bold text-3xl border-4 border-[var(--bg-surface)]">
                {p.username?.[0]?.toUpperCase() ?? "U"}
              </div>
              {isPremium && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--purple)] flex items-center justify-center border-2 border-[var(--bg-surface)]">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            {isPremium ? (
              <Badge variant="purple" size="md">
                <Crown className="w-3.5 h-3.5" /> برميم
              </Badge>
            ) : (
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--blue)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                ترقية لبرميم ⚡
              </button>
            )}
          </div>

          <h1 className="text-xl font-bold text-[var(--text)]">{p.username}</h1>
          <p className="text-[var(--text-muted)] text-sm">{p.email}</p>
          <p className="text-[var(--text-muted)] text-xs mt-1">انضم في {joinedDate}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Coins className="w-5 h-5" />,  label: "العملات",     value: (p.coins ?? 0).toLocaleString("ar"), color: "gold" },
          { icon: <Flame className="w-5 h-5" />,  label: "أيام متواصلة", value: `${p.streak ?? 0} يوم`,             color: "red" },
          { icon: <Clock className="w-5 h-5" />,  label: "ساعات الدراسة", value: `${hours} ساعة`,                    color: "blue" },
          { icon: <Trophy className="w-5 h-5" />, label: "الإنجازات",    value: `${achievements?.length ?? 0}`,      color: "purple" },
        ].map((stat) => {
          const colors: Record<string, string> = {
            gold: "text-[var(--gold)] bg-[var(--gold-glow)]",
            red: "text-[var(--red)] bg-[var(--red-glow)]",
            blue: "text-[var(--blue)] bg-[var(--blue-glow)]",
            purple: "text-[var(--purple)] bg-[var(--purple-glow)]",
          };
          return (
            <div key={stat.label} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col items-center gap-2 text-center">
              <div className={`p-2.5 rounded-xl ${colors[stat.color]}`}>{stat.icon}</div>
              <p className="text-lg font-bold text-[var(--text)]">{stat.value}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* More stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--green-glow)]">
            <Star className="w-5 h-5 text-[var(--green)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">عناصر المزرعة</p>
            <p className="font-bold text-[var(--text)]">{(farmCount as { count?: number } | null)?.count ?? 0} عنصر</p>
          </div>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[var(--blue-glow)]">
            <Shield className="w-5 h-5 text-[var(--blue)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)]">مجموعات بطاقات</p>
            <p className="font-bold text-[var(--text)]">{(flashcardCount as { count?: number } | null)?.count ?? 0} مجموعة</p>
          </div>
        </div>
      </div>

      {/* Premium section */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-[#1a0f2e] to-[#0f0f2e] border border-[rgba(168,85,247,0.4)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-[var(--purple)]" />
            <h2 className="font-bold text-[var(--text)]">ترقية لبرميم</h2>
            <Badge variant="purple" size="md">5 ريال / شهر</Badge>
          </div>
          <ul className="space-y-2 mb-4">
            {PREMIUM_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2 text-sm text-[var(--text-soft)]">
                <span className="text-[var(--green)]">✓</span> {perk}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--purple)] to-[var(--blue)] text-white font-semibold hover:opacity-90 transition-opacity">
            اشترك الآن ⚡
          </button>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[var(--gold)]" />
            إنجازاتي ({achievements.length})
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {achievements.map((ua) => {
              const a = ua.achievement;
              if (!a) return null;
              return (
                <div key={ua.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--bg-surface2)] border border-[var(--border)] hover:border-[var(--gold)] transition-colors">
                  <span className="text-2xl">{a.icon}</span>
                  <p className="text-[10px] font-medium text-[var(--text)] text-center leading-tight">{a.name_ar}</p>
                  <Badge
                    variant={a.badge === "gold" ? "gold" : "surface"}
                    size="sm"
                  >
                    {a.badge === "gold" ? "🥇" : a.badge === "silver" ? "🥈" : "🥉"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const PREMIUM_PERKS = [
  "مضاعفة العملات المكتسبة من الدراسة ×1.5",
  "الوصول لعناصر حصرية في المزاد",
  "جلسات جماعية أكبر (حتى 20 شخص)",
  "مساعد ذكاء اصطناعي متقدم بلا حدود",
  "تحليلات مفصّلة لأدائك الدراسي",
];
