"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Coins, Plus, Lock, Info, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { FarmItem, ShopItem } from "@/types";

// Static shop items (would come from DB in production)
const SHOP_ITEMS: (ShopItem & { emoji: string })[] = [
  { id: "horse",    name: "Horse",    name_ar: "حصان",        type: "animal",     cost: 150,  rarity: "common",    image_url: "", description: "", emoji: "🐎" },
  { id: "camel",    name: "Camel",    name_ar: "جمل",         type: "animal",     cost: 200,  rarity: "rare",      image_url: "", description: "", emoji: "🐪" },
  { id: "cow",      name: "Cow",      name_ar: "بقرة",        type: "animal",     cost: 120,  rarity: "common",    image_url: "", description: "", emoji: "🐄" },
  { id: "sheep",    name: "Sheep",    name_ar: "خروف",        type: "animal",     cost: 80,   rarity: "common",    image_url: "", description: "", emoji: "🐑" },
  { id: "chicken",  name: "Chicken",  name_ar: "دجاجة",       type: "animal",     cost: 40,   rarity: "common",    image_url: "", description: "", emoji: "🐔" },
  { id: "tree",     name: "Tree",     name_ar: "شجرة نخيل",  type: "tree",       cost: 60,   rarity: "common",    image_url: "", description: "", emoji: "🌴" },
  { id: "wheat",    name: "Wheat",    name_ar: "قمح",         type: "garden",     cost: 30,   rarity: "common",    image_url: "", description: "", emoji: "🌾" },
  { id: "house",    name: "House",    name_ar: "منزل",        type: "house",      cost: 300,  rarity: "rare",      image_url: "", description: "", emoji: "🏡" },
  { id: "well",     name: "Well",     name_ar: "بئر",         type: "decoration", cost: 100,  rarity: "common",    image_url: "", description: "", emoji: "🪣" },
  { id: "lake",     name: "Lake",     name_ar: "بحيرة",       type: "lake",       cost: 500,  rarity: "epic",      image_url: "", description: "", emoji: "🏞️" },
  { id: "rainbow",  name: "Rainbow",  name_ar: "قوس قزح",    type: "decoration", cost: 800,  rarity: "legendary", image_url: "", description: "", emoji: "🌈" },
  { id: "unicorn",  name: "Unicorn",  name_ar: "يونيكورن",   type: "animal",     cost: 1500, rarity: "legendary", image_url: "", description: "", emoji: "🦄" },
];

const RARITY_STYLE: Record<string, string> = {
  common:    "border-[var(--border)] bg-[var(--bg-surface2)]",
  rare:      "border-[rgba(59,130,246,0.4)] bg-[var(--blue-glow)]",
  epic:      "border-[rgba(168,85,247,0.4)] bg-[var(--purple-glow)]",
  legendary: "border-[rgba(245,166,35,0.5)] bg-[var(--gold-glow)]",
};

const RARITY_BADGE: Record<string, { variant: "gold" | "green" | "purple" | "blue" | "red" | "surface"; label: string }> = {
  common:    { variant: "surface", label: "عادي" },
  rare:      { variant: "blue",    label: "نادر" },
  epic:      { variant: "purple",  label: "ملحمي" },
  legendary: { variant: "gold",    label: "أسطوري" },
};

const GRID_SIZE = 25; // 5x5

export function FarmClient() {
  const { user, coins, spendCoins } = useUserStore();
  const [farmItems, setFarmItems] = useState<(FarmItem & { emoji?: string })[]>([]);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [loadingBuy, setLoadingBuy] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("farm_items")
      .select("*")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data) {
          const enriched = (data as Array<{ id: string; user_id: string; item_type: string; item_id: string; position_x: number; position_y: number; placed_at: string }>).map((item) => {
            const staticItem = SHOP_ITEMS.find((s) => s.id === item.item_id);
            return { ...item, emoji: staticItem?.emoji ?? "🌱" };
          });
          setFarmItems(enriched as typeof farmItems);
        }
      });
  }, [user]);

  const handleBuy = async (item: typeof SHOP_ITEMS[0]) => {
    if (!user) return;
    if (selectedCell === null) {
      toast.error("اختر خلية في المزرعة أولاً");
      return;
    }
    if (coins < item.cost) {
      toast.error("عملاتك غير كافية", { description: `تحتاج ${item.cost} عملة` });
      return;
    }

    const cellTaken = farmItems.some((fi) => fi.position_x === selectedCell % 5 && fi.position_y === Math.floor(selectedCell / 5));
    if (cellTaken) {
      toast.error("هذه الخلية مشغولة");
      return;
    }

    setLoadingBuy(item.id);
    const ok = spendCoins(item.cost);
    if (!ok) { setLoadingBuy(null); return; }

    const supabase = getSupabaseBrowserClient();
    const { data, error } = await (supabase.from("farm_items") as ReturnType<typeof supabase.from>).insert({
      user_id: user.id,
      item_type: item.type,
      item_id: item.id,
      position_x: selectedCell % 5,
      position_y: Math.floor(selectedCell / 5),
    }).select().single();

    if (error) {
      toast.error("حدث خطأ");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFarmItems((prev) => [...prev, { ...(data as any), emoji: item.emoji }]);
      await supabase.from("profiles").update({ coins: Math.max(0, coins - item.cost) }).eq("id", user.id);
      toast.success(`تم شراء ${item.name_ar}! 🎉`);
      setSelectedCell(null);
      setShowShop(false);
    }
    setLoadingBuy(null);
  };

  const getCellItem = (index: number) => {
    const x = index % 5;
    const y = Math.floor(index / 5);
    return farmItems.find((fi) => fi.position_x === x && fi.position_y === y);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">مزرعتي</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">ابنِ مزرعتك بعملاتك المكتسبة من الدراسة</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="gold" size="md">
            <Coins className="w-3.5 h-3.5" />
            {Math.floor(coins).toLocaleString("ar")} عملة
          </Badge>
          <Button variant="gold" size="sm" onClick={() => { setShowShop(!showShop); setSelectedCell(null); }}>
            <ShoppingBag className="w-4 h-4" />
            المتجر
          </Button>
        </div>
      </div>

      <div className={cn("grid gap-4", showShop ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1")}>
        {/* Farm grid */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text)]">أرضك</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">{farmItems.length}/{GRID_SIZE} خلية</span>
              {selectedCell !== null && (
                <Badge variant="blue" size="sm">خلية {selectedCell + 1} محددة</Badge>
              )}
            </div>
          </div>

          {/* 5x5 grid */}
          <div
            className="grid gap-2 mx-auto"
            style={{ gridTemplateColumns: "repeat(5, 1fr)", maxWidth: "360px" }}
          >
            {Array.from({ length: GRID_SIZE }).map((_, i) => {
              const item = getCellItem(i);
              const isSelected = selectedCell === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!item) {
                      setSelectedCell(isSelected ? null : i);
                      if (!isSelected) setShowShop(true);
                    }
                  }}
                  className={cn(
                    "aspect-square rounded-xl flex flex-col items-center justify-center text-2xl transition-all duration-150 border",
                    item
                      ? "bg-[var(--green-glow)] border-[rgba(34,197,94,0.3)] cursor-default"
                      : isSelected
                      ? "bg-[var(--gold-glow)] border-[rgba(245,166,35,0.5)] scale-105 shadow-[0_0_12px_rgba(245,166,35,0.3)]"
                      : "bg-[var(--bg-surface2)] border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--bg-surface3)] cursor-pointer"
                  )}
                >
                  {item ? (
                    <span title={item.item_id}>{item.emoji}</span>
                  ) : isSelected ? (
                    <Plus className="w-5 h-5 text-[var(--gold)]" />
                  ) : (
                    <Sprout className="w-4 h-4 text-[var(--text-muted)] opacity-30" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-[var(--text-muted)] mt-3">
            اضغط على خلية فارغة لإضافة عنصر
          </p>
        </div>

        {/* Shop panel */}
        {showShop && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5 animate-slide-right">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text)]">المتجر</h2>
              <button onClick={() => setShowShop(false)} className="text-[var(--text-muted)] hover:text-[var(--text)] text-sm">✕</button>
            </div>

            {selectedCell === null && (
              <div className="mb-3 flex items-center gap-2 bg-[var(--blue-glow)] border border-[rgba(59,130,246,0.3)] rounded-xl p-3 text-sm text-[var(--blue)]">
                <Info className="w-4 h-4 shrink-0" />
                اختر خلية في المزرعة أولاً ثم اشترِ
              </div>
            )}

            <div className="space-y-2 max-h-[400px] overflow-y-auto pl-1">
              {SHOP_ITEMS.map((item) => {
                const canAfford = coins >= item.cost;
                const rb = RARITY_BADGE[item.rarity];
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      RARITY_STYLE[item.rarity]
                    )}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[var(--text)]">{item.name_ar}</p>
                        <Badge variant={rb.variant} size="sm">{rb.label}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--gold)] text-xs mt-0.5">
                        <Coins className="w-3 h-3" />
                        {item.cost} عملة
                      </div>
                    </div>
                    <Button
                      variant={canAfford ? "gold" : "surface"}
                      size="sm"
                      disabled={!canAfford || selectedCell === null || loadingBuy === item.id}
                      loading={loadingBuy === item.id}
                      onClick={() => handleBuy(item)}
                    >
                      {!canAfford ? <Lock className="w-3 h-3" /> : "شراء"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Farm summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--green)]">{farmItems.filter(i => i.item_type === "animal").length}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">حيوانات</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--gold)]">{farmItems.filter(i => i.item_type === "tree" || i.item_type === "garden").length}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">نباتات</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[var(--blue)]">{farmItems.filter(i => i.item_type === "house" || i.item_type === "decoration").length}</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">مباني وديكور</p>
        </div>
      </div>
    </div>
  );
}
