"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Sparkles, ChevronLeft, ChevronRight, RotateCcw, Eye, EyeOff, Trash2, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { FlashcardSet, Flashcard } from "@/types";

type View = "list" | "create" | "study";

export function FlashcardsClient() {
  const { user } = useUserStore();
  const [view, setView] = useState<View>("list");
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(false);

  // Create form
  const [setTitle, setSetTitle] = useState("");
  const [setSubject, setSetSubject] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [cards, setCards] = useState([{ front: "", back: "" }]);

  // Study mode
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [unknown, setUnknown] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("flashcard_sets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSets(data as unknown as FlashcardSet[]);
      });
  }, [user]);

  const handleCreateSet = async () => {
    if (!user || !setTitle.trim() || cards.some((c) => !c.front.trim() || !c.back.trim())) {
      toast.error("تأكد من ملء جميع الحقول");
      return;
    }
    setLoading(true);
    const supabase = getSupabaseBrowserClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: newSet, error } = await (supabase.from("flashcard_sets") as any)
      .insert({ user_id: user.id, title: setTitle, subject: setSubject, is_public: isPublic })
      .select()
      .single();

    if (error || !newSet) {
      toast.error("حدث خطأ في إنشاء المجموعة");
      setLoading(false);
      return;
    }

    const newSetTyped = newSet as { id: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("flashcards") as any).insert(
      cards.map((c) => ({
        set_id: newSetTyped.id,
        front: c.front,
        back: c.back,
        difficulty: 3,
        next_review: new Date().toISOString(),
        review_count: 0,
      }))
    );

    toast.success("تم إنشاء المجموعة!");
    setSets((prev) => [{ ...newSetTyped, title: setTitle, subject: setSubject, is_public: isPublic, user_id: user.id, created_at: new Date().toISOString(), cards: cards as Flashcard[], card_count: cards.length } as FlashcardSet, ...prev]);
    setView("list");
    setSetTitle(""); setSetSubject(""); setCards([{ front: "", back: "" }]);
    setLoading(false);
  };

  const handleStudy = async (set: FlashcardSet) => {
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase.from("flashcards").select("*").eq("set_id", set.id);
    setActiveSet({ ...set, cards: (data ?? []) as unknown as Flashcard[] });
    setCardIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
    setView("study");
  };

  const handleDeleteSet = async (id: string) => {
    const supabase = getSupabaseBrowserClient();
    await supabase.from("flashcards").delete().eq("set_id", id);
    await supabase.from("flashcard_sets").delete().eq("id", id);
    setSets((prev) => prev.filter((s) => s.id !== id));
    toast.success("تم حذف المجموعة");
  };

  // Study mode
  if (view === "study" && activeSet) {
    const currentCard = activeSet.cards[cardIndex];
    const total = activeSet.cards.length;
    const progress = ((cardIndex) / total) * 100;

    return (
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">{activeSet.title}</h1>
            <p className="text-[var(--text-muted)] text-sm">{cardIndex + 1} / {total}</p>
          </div>
          <Button variant="ghost" onClick={() => setView("list")}>
            <ChevronLeft className="w-4 h-4" /> رجوع
          </Button>
        </div>

        {/* Progress */}
        <div className="h-1.5 rounded-full bg-[var(--bg-surface2)] overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold)] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Scores */}
        <div className="flex gap-2">
          <Badge variant="green" size="md">✓ {known.size} أعرفها</Badge>
          <Badge variant="red" size="md">✗ {unknown.size} لا أعرفها</Badge>
        </div>

        {/* Flashcard */}
        <div
          className="cursor-pointer select-none"
          onClick={() => setFlipped(!flipped)}
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative h-64 transition-transform duration-500"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 rounded-2xl bg-[var(--bg-surface)] border-2 border-[var(--gold)] flex flex-col items-center justify-center p-8 text-center"
              style={{ backfaceVisibility: "hidden" }}
            >
              <Badge variant="surface" size="sm" className="mb-3">السؤال</Badge>
              <p className="text-xl font-semibold text-[var(--text)]">{currentCard?.front}</p>
              <p className="text-xs text-[var(--text-muted)] mt-4 flex items-center gap-1">
                <Eye className="w-3 h-3" /> اضغط لرؤية الجواب
              </p>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--bg-surface2)] to-[var(--bg-surface)] border-2 border-[var(--green)] flex flex-col items-center justify-center p-8 text-center"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <Badge variant="green" size="sm" className="mb-3">الجواب</Badge>
              <p className="text-xl font-semibold text-[var(--text)]">{currentCard?.back}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        {flipped && (
          <div className="flex gap-3 animate-fade-in">
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                setUnknown((prev) => new Set([...prev, cardIndex]));
                setFlipped(false);
                if (cardIndex < total - 1) setCardIndex((p) => p + 1);
              }}
            >
              <EyeOff className="w-4 h-4" /> لا أعرفها
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              onClick={() => {
                setKnown((prev) => new Set([...prev, cardIndex]));
                setFlipped(false);
                if (cardIndex < total - 1) setCardIndex((p) => p + 1);
                else toast.success("أنهيت المراجعة! 🎉");
              }}
            >
              أعرفها ✓
            </Button>
          </div>
        )}

        <div className="flex justify-between">
          <Button variant="ghost" disabled={cardIndex === 0} onClick={() => { setCardIndex((p) => p - 1); setFlipped(false); }}>
            <ChevronRight className="w-4 h-4" /> السابق
          </Button>
          <Button variant="ghost" onClick={() => { setCardIndex(0); setFlipped(false); setKnown(new Set()); setUnknown(new Set()); }}>
            <RotateCcw className="w-4 h-4" /> إعادة
          </Button>
          <Button variant="ghost" disabled={cardIndex === total - 1} onClick={() => { setCardIndex((p) => p + 1); setFlipped(false); }}>
            التالي <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Create mode
  if (view === "create") {
    return (
      <div className="animate-fade-in space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--text)]">إنشاء مجموعة جديدة</h1>
          <Button variant="ghost" onClick={() => setView("list")}>
            <ChevronLeft className="w-4 h-4" /> رجوع
          </Button>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
          <Input label="عنوان المجموعة" placeholder="مثال: أحياء الفصل الثالث" value={setTitle} onChange={(e) => setSetTitle(e.target.value)} />
          <Input label="المادة" placeholder="مثال: الأحياء" value={setSubject} onChange={(e) => setSetSubject(e.target.value)} />
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                isPublic ? "bg-[var(--gold)]" : "bg-[var(--bg-surface3)]"
              )}
            >
              <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-all", isPublic ? "right-1" : "left-1")} />
            </button>
            <label className="text-sm text-[var(--text-soft)] flex items-center gap-1">
              {isPublic ? <Globe className="w-4 h-4 text-[var(--green)]" /> : <Lock className="w-4 h-4" />}
              {isPublic ? "مجموعة عامة" : "مجموعة خاصة"}
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-[var(--text)]">البطاقات ({cards.length})</h2>
          {cards.map((card, i) => (
            <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="surface" size="sm">بطاقة {i + 1}</Badge>
                {cards.length > 1 && (
                  <button onClick={() => setCards((prev) => prev.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--red)]" />
                  </button>
                )}
              </div>
              <Input
                placeholder="السؤال / الوجه الأمامي"
                value={card.front}
                onChange={(e) => setCards((prev) => prev.map((c, idx) => idx === i ? { ...c, front: e.target.value } : c))}
              />
              <Input
                placeholder="الجواب / الوجه الخلفي"
                value={card.back}
                onChange={(e) => setCards((prev) => prev.map((c, idx) => idx === i ? { ...c, back: e.target.value } : c))}
              />
            </div>
          ))}

          <Button variant="outline" className="w-full" onClick={() => setCards((prev) => [...prev, { front: "", back: "" }])}>
            <Plus className="w-4 h-4" /> إضافة بطاقة
          </Button>
        </div>

        <Button variant="gold" size="lg" className="w-full" loading={loading} onClick={handleCreateSet}>
          <Sparkles className="w-4 h-4" /> إنشاء المجموعة ({cards.length} بطاقة)
        </Button>
      </div>
    );
  }

  // List
  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">البطاقات التعليمية</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">مجموعاتك ({sets.length})</p>
        </div>
        <Button variant="gold" onClick={() => setView("create")}>
          <Plus className="w-4 h-4" /> مجموعة جديدة
        </Button>
      </div>

      {sets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl">📚</span>
          <p className="text-[var(--text-muted)] text-center">لا توجد مجموعات بعد.<br />أنشئ مجموعتك الأولى!</p>
          <Button variant="gold" onClick={() => setView("create")}>
            <Plus className="w-4 h-4" /> ابدأ الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sets.map((set) => {
            const count = (set as FlashcardSet & { cards: { count: number }[] }).cards?.[0]?.count ?? set.card_count ?? 0;
            return (
              <div key={set.id} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--gold)] transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[var(--text)]">{set.title}</h3>
                      {set.is_public ? (
                        <Globe className="w-3.5 h-3.5 text-[var(--green)]" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{set.subject}</p>
                  </div>
                  <button onClick={() => handleDeleteSet(set.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--red)]" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="surface" size="sm">
                    <BookOpen className="w-3 h-3" /> {count} بطاقة
                  </Badge>
                </div>

                <Button variant="gold" size="sm" className="w-full" onClick={() => handleStudy(set)}>
                  <BookOpen className="w-4 h-4" /> مراجعة
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
