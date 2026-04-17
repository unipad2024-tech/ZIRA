import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Zira" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRes, challengesRes, achievementsRes, leaderboardRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_challenges")
      .select("*, challenge:challenges(*)")
      .eq("user_id", user.id).eq("completed", false).limit(3),
    supabase.from("user_achievements")
      .select("*, achievement:achievements(*)")
      .eq("user_id", user.id).order("earned_at", { ascending: false }).limit(4),
    supabase.from("profiles")
      .select("id, username, total_study_minutes, streak, coins")
      .order("total_study_minutes", { ascending: false }).limit(5),
  ]);

  const profile = profileRes.data ?? {
    username: "Scholar", coins: 0, streak: 0,
    total_study_minutes: 0, subscription: "free",
  };

  return (
    <DashboardClient
      profile={profile as { username: string; coins: number; streak: number; total_study_minutes: number; subscription: string }}
      challenges={challengesRes.data as any}
      achievements={achievementsRes.data as any}
      topUsers={leaderboardRes.data as any}
      userId={user.id}
    />
  );
}
