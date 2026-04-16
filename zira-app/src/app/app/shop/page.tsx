"use client";

import { useState } from "react";
import { ShoppingBag, Coins, Lock, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const SHOP_ITEMS = [
  { id: "horse",    name_ar: "حصان",         type: "animal",     cost: 150,  rarity: "common",    emoji: "🐎" },
  { id: "camel",    name_ar: "جمل",           type: "animal",     cost: 200,  rarity: "rare",      emoji: "🐪" },
  { id: "cow",      name_ar: "بقرة",          type: "animal",     cost: 120,  rarity: "common",    emoji: "🐄" },
  { id: "sheep",    name_ar: "خروف",          type: "animal",     cost: 80,   rarity: "common",    emoji: "🐑" },
  { id: "chicken",  name_ar: "دجاجة",         type: "animal",     cost: 40,   rarity: "common",    emoji: "🐔" },
  { id: "tree",     name_ar: "نخلة",          type: "tree",       cost: 60,   rarity: "common",    emoji: "🌴" },
  { id: "cactus",   name_ar: "صبار",          type: "tree",       cost: 45,   rarity: "common",    emoji: "🌵" },
  { id: "wheat",    name_ar: "حقل قمح",       type: "garden",     cost: 30,   rarity: "common",    emoji: "🌾" },
  { id: "herb",     name_ar: "أعشاب طبية",   type: "garden",     cost: 55,   rarity: "rare",      emoji: "🌿" },
  { id: "house",    name_ar: "منزل ريفي",    type: "house",      cost: 300,  rarity: "rare",      emoji: "🏡" },
  { id: "barn",     name_ar: "حظيرة",         type: "house",      cost: 180,  rarity: "common",    emoji: "🏚️" },
  { id: "well",     name_ar: "بئر ماء",       type: "decoration", cost: 100,  rarity: "common",    emoji: "🪣" },
  { id: "windmill", name_ar: "طاحونة هواء",  type: "decoration", cost: 250,  rarity: "rare",      emoji: "⚙️" },
  { id: "lake",     name_ar: "بحيرة",         type: "lake",       cost: 500,  rarity: "epic",      emoji: "🏞️" },
  { id: "oasis",    name_ar: "واحة",          type: "lake",       cost: 400,  rarity: "epic",      emoji: "🌊" },
  { id: "rainbow",  name_ar: "قوس قزح",      type: "decoration", cost: 800,  rarity: "legendary", emoji: "🌈" },
  { id: "unicorn",  name_ar: "يونيكورن",      type: "animal",     cost: 1500, rarity: "legendary", emoji: "🦄" },
  { id: "dragon",   name_ar: "تنين",          type: "animal",     cost: 2000, rarity: "legendary", emoji: "🐉" },
];

const CATEGORIES = [
  { key: "all", label: "الكل" },
  { key: "animal", label: "🐾 حيوانات" },
  { key: "tree", label: "🌴 أشجار" },
  { key: "garden", label: "🌾 حدائق" },
  { key: "house", label: "🏡 مباني" },
  { key: "decoration", label: "✨ ديكور" },
  { key: "lake", label: "💧 مياه" },
];

const RARITY_ORDER = ["common", "rare", "epic", "legendary"];
const RARITY_BADGE: Record<string, { variant: "gold" | "green" | "purple" | "blue" | "red" | "surface"; label: string }> = {
  common:    { variant: "surface", label: "عادي" },
  rare:      { variant: "blue",    label: "⭐ نادر" },
  epic:      { variant: "purple",  label: "💎 ملحمي" },
  legendary: { variant: "gold",    label: "🏆 أسطوري" },
};

export default function ShopPage() {
  const { user, coins, spendCoins } = useUserStore();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"cost" | "rarity">("rarity");
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const filtered = SHOP_ITEMS
    .filter((i) => category === "all" || i.type === category)
    .sort((a, b) => {
      if (sortBy === "cost") return a.cost - b.cost;
      return RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
    });

  const handleBuy = async (item: typeof SHOP_ITEMS[0]) => {
    if (!user) return;
    if (coins < item.cost) {
      toast.error("عملاتك غير كافية", { description: `تحتاج ${item.cost} عملة` });
      return;
    }
    setPurchasing(item.id);
    const ok = spendCoins(item.cost);
    if (!ok) { setPurchasing(null); return; }

    const supabase = getSupabaseBrowserClient();
    // Add to farm at random available position
    const { data: existing } = await supabase.from("farm_items").select("position_x, position_y").eq("user_id", user.id);
    const occupied = new Set((existing ?? []).map((e) => `${e.position_x},${e.position_y}`));
    let x = 0, y = 0;
    outer: for (let yy = 0; yy < 5; yy++) {
      for (let xx = 0; xx < 5; xx++) {
        if (!occupied.has(`${xx},${yy}`)) { x = xx; y = yy; break outer; }
      }
    }

    await supabase.from("farm_items").insert({
      user_id: user.id,
      item_type: item.type as "tree" | "animal" | "house" | "garden" | "lake" | "decoration",
      item_id: item.id,
      position_x: x,
      position_y: y,
    });
    await supabase.from("profiles").update({ coins: Math.max(0, coins - item.cost) }).eq("id", user.id);

    toast.success(`تم شراء ${item.name_ar}! ${item.emoji}`, { description: "تم إضافته لمزرعتك" });
    setPurchasing(null);
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">المتجر</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">اشترِ عناصر لمزرعتك</p>
        </div>
        <Badge variant="gold" size="md">
          <Coins className="w-3.5 h-3.5" />
          {Math.floor(coins).toLocaleString("ar")} عملة
        </Badge>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              category === cat.key
                ? "bg-[var(--gold-glow)] border-[rgba(245,166,35,0.4)] text-[var(--gold)]"
                : "bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-soft)] hover:text-[var(--text)]"
            )}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={() => setSortBy(sortBy === "cost" ? "rarity" : "cost")}
          className="mr-auto px-3 py-1.5 rounded-full text-xs font-medium border bg-[var(--bg-surface)] border-[var(--border)] text-[var(--text-soft)] flex items-center gap-1"
        >
          <Filter className="w-3 h-3" />
          {sortBy === "cost" ? "السعر" : "الندرة"}
        </button>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((item) => {
          const canAfford = coins >= item.cost;
          const rb = RARITY_BADGE[item.rarity];
          const rarityBorder = {
            common: "border-[var(--border)]",
            rare: "border-[rgba(59,130,246,0.3)]",
            epic: "border-[rgba(168,85,247,0.3)]",
            legendary: "border-[rgba(245,166,35,0.4)] shadow-[0_0_16px_rgba(245,166,35,0.08)]",
          }[item.rarity];

          return (
            <div
              key={item.id}
              className={cn(
                "bg-[var(--bg-surface)] rounded-2xl border p-4 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-[1.02]",
                rarityBorder
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl",
                item.rarity === "legendary" ? "bg-[var(--gold-glow)]" :
                item.rarity === "epic" ? "bg-[var(--purple-glow)]" :
                item.rarity === "rare" ? "bg-[var(--blue-glow)]" : "bg-[var(--bg-surface2)]"
              )}>
                {item.emoji}
              </div>
              <div className="text-center">
                <p className="font-semibold text-[var(--text)] text-sm">{item.name_ar}</p>
                <Badge variant={rb.variant} size="sm" className="mt-1">{rb.label}</Badge>
              </div>
              <div className="flex items-center gap-1 text-[var(--gold)] text-sm font-bold">
                <Coins className="w-3.5 h-3.5" />
                {item.cost}
              </div>
              <Button
                variant={canAfford ? "gold" : "surface"}
                size="sm"
                className="w-full"
                disabled={!canAfford || purchasing === item.id}
                loading={purchasing === item.id}
                onClick={() => handleBuy(item)}
              >
                {!canAfford ? (
                  <><Lock className="w-3 h-3" /> تحتاج {item.cost - Math.floor(coins)} عملة</>
                ) : (
                  <>
                    <Star className="w-3 h-3" /> شراء
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
