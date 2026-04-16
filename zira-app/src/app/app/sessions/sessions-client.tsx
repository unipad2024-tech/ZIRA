"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Hash, Play, Clock, Coins, Crown, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { useSessionStore } from "@/store/session-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { StudySession, SessionParticipant } from "@/types";

const DURATION_OPTIONS = [25, 45, 60, 90, 120];

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function SessionsClient() {
  const { user } = useUserStore();
  const { session, setSession, timeRemaining, isActive, startTimer, stopTimer, reset } = useSessionStore();

  const [mode, setMode] = useState<"home" | "create" | "join" | "active">("home");
  const [sessionTitle, setSessionTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [joinCode, setJoinCode] = useState("");
  const [participants, setParticipants] = useState<(SessionParticipant & { user?: { username: string } })[]>([]);
  const [loading, setLoading] = useState(false);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Subscribe to participants changes
  useEffect(() => {
    if (!session) return;
    const supabase = getSupabaseBrowserClient();

    const fetchParticipants = async () => {
      const { data } = await supabase
        .from("session_participants")
        .select("*")
        .eq("session_id", session.id)
        .is("left_at", null);
      if (data) setParticipants(data as unknown as typeof participants);
    };

    fetchParticipants();

    const channel = supabase
      .channel(`session:${session.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "session_participants" }, fetchParticipants)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session]);

  const handleCreate = async () => {
    if (!user || !sessionTitle.trim()) return;
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    const code = generateCode();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newSession, error } = await (supabase.from("study_sessions") as any)
      .insert({
        host_id: user.id,
        code,
        title: sessionTitle,
        duration_minutes: duration,
        is_active: true,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !newSession) {
      toast.error("حدث خطأ في إنشاء الجلسة");
      setLoading(false);
      return;
    }

    // Join as host
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("session_participants") as any).insert({
      session_id: (newSession as { id: string }).id,
      user_id: user.id,
    });

    setSession({ ...(newSession as { id: string; host_id: string; code: string; title: string; duration_minutes: number; started_at: string | null; ended_at: string | null; is_active: boolean; created_at: string }), participants: [] });
    startTimer();
    setMode("active");
    toast.success("تم إنشاء الجلسة!", { description: `الكود: ${code}` });
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!user || !joinCode.trim()) return;
    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: found, error } = await (supabase.from("study_sessions") as any)
      .select("*")
      .eq("code", joinCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !found) {
      toast.error("الكود غير صحيح أو الجلسة منتهية");
      setLoading(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("session_participants") as any).upsert({
      session_id: (found as { id: string }).id,
      user_id: user.id,
    });

    setSession({ ...(found as { id: string; host_id: string; code: string; title: string; duration_minutes: number; started_at: string | null; ended_at: string | null; is_active: boolean; created_at: string }), participants: [] });
    startTimer();
    setMode("active");
    toast.success("انضممت للجلسة!");
    setLoading(false);
  };

  const handleLeave = async () => {
    if (!session || !user) return;
    const supabase = getSupabaseBrowserClient();
    stopTimer();

    await supabase
      .from("session_participants")
      .update({ left_at: new Date().toISOString() })
      .eq("session_id", session.id)
      .eq("user_id", user.id);

    if (session.host_id === user.id) {
      await supabase.from("study_sessions").update({ is_active: false, ended_at: new Date().toISOString() }).eq("id", session.id);
    }

    reset();
    setMode("home");
    toast("غادرت الجلسة");
  };

  const progress = session
    ? Math.round(((session.duration_minutes * 60 - timeRemaining) / (session.duration_minutes * 60)) * 100)
    : 0;

  if (mode === "active" && session) {
    return (
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">{session.title}</h1>
            <p className="text-[var(--text-muted)] text-sm mt-0.5">كود الانضمام: <span className="text-[var(--gold)] font-mono font-bold">{session.code}</span></p>
          </div>
          <Button variant="danger" size="sm" onClick={handleLeave}>
            <LogOut className="w-4 h-4" />
            مغادرة
          </Button>
        </div>

        {/* Timer */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 text-center">
          <div className="text-6xl font-bold tabular-nums text-[var(--text)] mb-2">
            {formatTime(timeRemaining)}
          </div>
          <div className="h-2 rounded-full bg-[var(--bg-surface2)] mx-auto max-w-sm overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--purple)] transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="blue" size="md">
              <Clock className="w-3.5 h-3.5" />
              {session.duration_minutes} دقيقة
            </Badge>
            <Badge variant={isActive ? "green" : "surface"} size="md">
              {isActive ? "🟢 جارٍ" : "⏸ متوقف"}
            </Badge>
            <Badge variant="gold" size="md">
              <Coins className="w-3.5 h-3.5" />
              +{Math.round(session.duration_minutes * (participants.length > 1 ? 1.2 : 1))} عملة
            </Badge>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
          <h2 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--blue)]" />
            المشاركون ({participants.length})
          </h2>
          <div className="space-y-2">
            {participants.map((p) => (
              <div key={p.user_id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-surface2)]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--purple)] flex items-center justify-center text-white font-bold text-sm">
                  {(p.user as { username: string } | undefined)?.username?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text)]">
                    {(p.user as { username: string } | undefined)?.username ?? "مستخدم"}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {Math.floor(p.minutes_completed)} دقيقة مكتملة
                  </p>
                </div>
                {p.user_id === session.host_id && (
                  <Badge variant="gold" size="sm">
                    <Crown className="w-2.5 h-2.5" />
                    منظم
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Multiplier info */}
        {participants.length > 1 && (
          <div className="bg-[var(--green-glow)] border border-[rgba(34,197,94,0.3)] rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-semibold text-[var(--green)]">مضاعف جماعي نشط!</p>
              <p className="text-xs text-[var(--text-soft)]">ادرس مع {participants.length} أشخاص — العملات مضاعفة بـ ×1.2</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">الجلسات الجماعية</h1>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">ادرس مع أصدقائك واكسب مضاعفاً من العملات</p>
      </div>

      {/* Multiplier banner */}
      <div className="bg-gradient-to-r from-[var(--blue-glow)] to-[var(--purple-glow)] border border-[rgba(59,130,246,0.3)] rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <span className="text-4xl">👥</span>
          <div>
            <p className="font-bold text-[var(--text)]">كلما كان المجموعة أكبر، كلما كانت المكافأة أكبر!</p>
            <div className="flex gap-3 mt-2">
              <Badge variant="blue" size="sm">2 أشخاص: ×1.2</Badge>
              <Badge variant="purple" size="sm">3-4 أشخاص: ×1.5</Badge>
              <Badge variant="gold" size="sm">5+ أشخاص: ×2.0</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setMode("create")}
          className={cn(
            "p-6 rounded-2xl border text-right transition-all duration-200 hover:scale-[1.02]",
            mode === "create"
              ? "bg-[var(--gold-glow)] border-[rgba(245,166,35,0.4)]"
              : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--gold)]"
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--gold-glow)] border border-[rgba(245,166,35,0.3)] flex items-center justify-center mb-3">
            <Plus className="w-6 h-6 text-[var(--gold)]" />
          </div>
          <p className="font-bold text-[var(--text)]">إنشاء جلسة</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">ابدأ جلسة وادعُ أصدقاءك</p>
        </button>

        <button
          onClick={() => setMode("join")}
          className={cn(
            "p-6 rounded-2xl border text-right transition-all duration-200 hover:scale-[1.02]",
            mode === "join"
              ? "bg-[var(--blue-glow)] border-[rgba(59,130,246,0.4)]"
              : "bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--blue)]"
          )}
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--blue-glow)] border border-[rgba(59,130,246,0.3)] flex items-center justify-center mb-3">
            <UserPlus className="w-6 h-6 text-[var(--blue)]" />
          </div>
          <p className="font-bold text-[var(--text)]">الانضمام</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">أدخل كود الجلسة</p>
        </button>
      </div>

      {/* Create form */}
      {mode === "create" && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold text-[var(--text)]">إنشاء جلسة جديدة</h2>
          <Input
            label="اسم الجلسة"
            placeholder="مثال: مذاكرة الاختبار النهائي"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
          />
          <div>
            <p className="text-sm font-medium text-[var(--text-soft)] mb-2">مدة الجلسة</p>
            <div className="flex gap-2 flex-wrap">
              {DURATION_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all border",
                    duration === d
                      ? "bg-[var(--gold-glow)] border-[rgba(245,166,35,0.4)] text-[var(--gold)]"
                      : "bg-[var(--bg-surface2)] border-[var(--border)] text-[var(--text-soft)] hover:text-[var(--gold)]"
                  )}
                >
                  {d}د
                </button>
              ))}
            </div>
          </div>
          <Button variant="gold" className="w-full" loading={loading} onClick={handleCreate} disabled={!sessionTitle.trim()}>
            <Play className="w-4 h-4" />
            إنشاء وبدء الجلسة
          </Button>
        </div>
      )}

      {/* Join form */}
      {mode === "join" && (
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4 animate-fade-in">
          <h2 className="font-semibold text-[var(--text)]">الانضمام إلى جلسة</h2>
          <Input
            label="كود الجلسة"
            placeholder="أدخل الكود المكون من 6 أحرف"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            icon={<Hash className="w-4 h-4" />}
            dir="ltr"
            maxLength={6}
          />
          <Button variant="gold" className="w-full" loading={loading} onClick={handleJoin} disabled={joinCode.length < 4}>
            <UserPlus className="w-4 h-4" />
            انضمام للجلسة
          </Button>
        </div>
      )}
    </div>
  );
}
