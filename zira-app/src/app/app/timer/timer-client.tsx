"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Trophy, Flame, Coins, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const DURATIONS = [
  { label: "25 دقيقة", minutes: 25, coins: 25 },
  { label: "45 دقيقة", minutes: 45, coins: 50 },
  { label: "60 دقيقة", minutes: 60, coins: 70 },
  { label: "90 دقيقة", minutes: 90, coins: 115 },
];

type Phase = "idle" | "studying" | "break" | "done";

export function TimerClient() {
  const { user, addCoins, coins } = useUserStore();
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(DURATIONS[0].minutes * 60);
  const [elapsed, setElapsed] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const totalSeconds = selectedDuration.minutes * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const finishSession = useCallback(async () => {
    stop();
    setPhase("done");
    const earned = selectedDuration.coins * (user?.subscription === "premium" ? 1.5 : 1);
    addCoins(Math.floor(earned));
    setCompletedSessions((prev) => prev + 1);

    toast.success(`أحسنت! 🎉 ربحت ${Math.floor(earned)} عملة ذهبية`, {
      description: `أكملت ${selectedDuration.minutes} دقيقة من الدراسة المركزة`,
    });

    // Save to DB
    if (user) {
      const supabase = getSupabaseBrowserClient();
      await supabase.from("profiles").update({
        total_study_minutes: (user.total_study_minutes ?? 0) + selectedDuration.minutes,
        coins: Math.floor(coins + earned),
      }).eq("id", user.id);
    }
  }, [stop, selectedDuration, user, addCoins, coins]);

  useEffect(() => {
    if (phase !== "studying") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { finishSession(); return 0; }
        return prev - 1;
      });
      setElapsed((prev) => prev + 1);
    }, 1000);
    return stop;
  }, [phase, finishSession, stop]);

  const handleStart = () => {
    if (phase === "idle" || phase === "done") {
      setTimeLeft(totalSeconds);
      setElapsed(0);
      startTimeRef.current = Date.now();
    }
    setPhase("studying");
    toast("جلسة الدراسة بدأت! 📚", { description: "حافظ على تركيزك" });
  };

  const handlePause = () => {
    stop();
    setPhase("idle");
    toast.warning("تم إيقاف المؤقت مؤقتاً");
  };

  const handleReset = () => {
    stop();
    setPhase("idle");
    setTimeLeft(selectedDuration.minutes * 60);
    setElapsed(0);
  };

  const handleSelectDuration = (d: typeof DURATIONS[0]) => {
    if (phase === "studying") return;
    setSelectedDuration(d);
    setTimeLeft(d.minutes * 60);
    setElapsed(0);
    setPhase("idle");
  };

  // Circle math
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">مؤقت التركيز</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">ادرس بتركيز، اكسب عملات ذهبية</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="md">
            <Coins className="w-3.5 h-3.5" />
            {Math.floor(coins).toLocaleString("ar")} عملة
          </Badge>
        </div>
      </div>

      {/* Duration selector */}
      <div className="grid grid-cols-4 gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d.minutes}
            onClick={() => handleSelectDuration(d)}
            disabled={phase === "studying"}
            className={cn(
              "rounded-xl p-3 text-sm font-medium transition-all duration-200 border",
              selectedDuration.minutes === d.minutes
                ? "bg-[var(--gold-glow)] border-[rgba(245,166,35,0.4)] text-[var(--gold)]"
                : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-soft)] hover:border-[var(--gold)] hover:text-[var(--gold)]",
              phase === "studying" && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="font-bold">{d.minutes}د</div>
            <div className="text-[10px] mt-0.5 flex items-center justify-center gap-0.5">
              <Coins className="w-2.5 h-2.5" /> {d.coins}
            </div>
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer glow */}
          {phase === "studying" && (
            <div className="absolute inset-0 rounded-full bg-[var(--gold)] opacity-5 blur-3xl animate-pulse" />
          )}

          <svg width="280" height="280" className="transform -rotate-90">
            {/* Track */}
            <circle
              cx="140" cy="140" r={radius}
              fill="none"
              stroke="var(--bg-surface2)"
              strokeWidth="12"
            />
            {/* Progress */}
            <circle
              cx="140" cy="140" r={radius}
              fill="none"
              stroke={phase === "done" ? "var(--green)" : "var(--gold)"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: phase === "studying" ? "drop-shadow(0 0 8px var(--gold))" : "none",
              }}
            />
          </svg>

          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <span className={cn(
              "text-5xl font-bold tabular-nums tracking-tight",
              phase === "done" ? "text-[var(--green)]" : "text-[var(--text)]"
            )}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-[var(--text-muted)] text-sm">
              {phase === "idle" && "جاهز للبدء"}
              {phase === "studying" && "جارٍ الدراسة..."}
              {phase === "done" && "أكملت الجلسة! 🎉"}
            </span>
            {phase === "studying" && (
              <div className="flex items-center gap-1 text-[var(--gold)] text-xs font-medium mt-1">
                <Coins className="w-3 h-3" />
                <span>+{selectedDuration.coins} عملة عند الإتمام</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button variant="surface" size="icon" onClick={handleReset} disabled={phase === "idle"}>
            <RotateCcw className="w-4 h-4" />
          </Button>

          {phase === "studying" ? (
            <Button variant="gold" size="lg" className="px-12" onClick={handlePause}>
              <Pause className="w-5 h-5" />
              إيقاف مؤقت
            </Button>
          ) : (
            <Button variant="gold" size="lg" className="px-12" onClick={handleStart}>
              <Play className="w-5 h-5" />
              {phase === "done" ? "جلسة جديدة" : "ابدأ الدراسة"}
            </Button>
          )}

          <Button variant="surface" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Session stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-[var(--blue-glow)] flex items-center justify-center mx-auto mb-2">
            <Trophy className="w-5 h-5 text-[var(--blue)]" />
          </div>
          <p className="text-xl font-bold text-[var(--text)]">{completedSessions}</p>
          <p className="text-xs text-[var(--text-muted)]">جلسات مكتملة</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-[var(--red-glow)] flex items-center justify-center mx-auto mb-2">
            <Flame className="w-5 h-5 text-[var(--red)]" />
          </div>
          <p className="text-xl font-bold text-[var(--text)]">{user?.streak ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)]">يوم متواصل</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold-glow)] flex items-center justify-center mx-auto mb-2">
            <Coins className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <p className="text-xl font-bold text-[var(--text)]">{Math.floor(coins).toLocaleString("ar")}</p>
          <p className="text-xs text-[var(--text-muted)]">عملاتك</p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
        <h3 className="font-semibold text-[var(--text)] mb-3 text-sm">نصائح لتحسين التركيز</h3>
        <div className="space-y-2">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
              <span className="text-base shrink-0 mt-0.5">{tip.emoji}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const TIPS = [
  { emoji: "📵", text: "ضع هاتفك بعيداً أو في الوضع الصامت" },
  { emoji: "💧", text: "اشرب كوب ماء قبل بدء الجلسة" },
  { emoji: "🎵", text: "الموسيقى الهادئة أو الضوضاء البيضاء تساعد على التركيز" },
  { emoji: "⏰", text: "خذ استراحة 5 دقائق بعد كل 25 دقيقة دراسة" },
];
