"use client";

import { useState, useEffect } from "react";
import { Gavel, Clock, Coins, TrendingUp, Crown, Timer, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuctionItem } from "@/types";

// Static demo auctions
type DemoAuction = {
  id: string;
  item: { name_ar: string; type: string; rarity: string; image_url: string; emoji: string; description: string; description_ar: string; id: string; name: string; cost: number };
  start_price: number;
  current_price: number;
  ends_at: string;
  is_active: boolean;
  bid_count: number;
  highest_bidder: null;
  highest_bidder_id: string | null;
  shop_item_id: string;
};

const DEMO_AUCTIONS: DemoAuction[] = [
  {
    id: "a1", item: { name_ar: "يونيكورن أسطوري", type: "animal", rarity: "legendary", image_url: "", emoji: "🦄", description: "", description_ar: "", id: "unicorn", name: "Unicorn", cost: 1500 },
    start_price: 800, current_price: 1250, ends_at: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    is_active: true, bid_count: 12, highest_bidder: null, highest_bidder_id: null, shop_item_id: "unicorn",
  },
  {
    id: "a2", item: { name_ar: "قوس قزح", type: "decoration", rarity: "epic", image_url: "", emoji: "🌈", description: "", description_ar: "", id: "rainbow", name: "Rainbow", cost: 800 },
    start_price: 400, current_price: 680, ends_at: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    is_active: true, bid_count: 7, highest_bidder: null, highest_bidder_id: null, shop_item_id: "rainbow",
  },
  {
    id: "a3", item: { name_ar: "جمل نادر", type: "animal", rarity: "rare", image_url: "", emoji: "🐪", description: "", description_ar: "", id: "camel", name: "Camel", cost: 200 },
    start_price: 100, current_price: 165, ends_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    is_active: true, bid_count: 3, highest_bidder: null, highest_bidder_id: null, shop_item_id: "camel",
  },
  {
    id: "a4", item: { name_ar: "بحيرة ملحمية", type: "lake", rarity: "epic", image_url: "", emoji: "🏞️", description: "", description_ar: "", id: "lake", name: "Lake", cost: 500 },
    start_price: 300, current_price: 450, ends_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    is_active: true, bid_count: 5, highest_bidder: null, highest_bidder_id: null, shop_item_id: "lake",
  },
];

const RARITY_STYLE: Record<string, string> = {
  common:    "border-[var(--border)]",
  rare:      "border-[rgba(59,130,246,0.4)]",
  epic:      "border-[rgba(168,85,247,0.4)]",
  legendary: "border-[rgba(245,166,35,0.5)] shadow-[0_0_20px_rgba(245,166,35,0.1)]",
};

function useCountdown(endsAt: string) {
  const [remaining, setRemaining] = useState(() => Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000)));
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return { h, m, s, done: remaining === 0 };
}

function CountdownBadge({ endsAt }: { endsAt: string }) {
  const { h, m, s, done } = useCountdown(endsAt);
  if (done) return <Badge variant="red" size="sm">⏰ انتهى</Badge>;
  return (
    <Badge variant={h < 2 ? "red" : "surface"} size="sm" className="font-mono">
      <Timer className="w-3 h-3" />
      {h > 0 ? `${h}س` : ""} {m}د {s}ث
    </Badge>
  );
}

export default function AuctionPage() {
  const { user, coins, spendCoins } = useUserStore();
  const [auctions, setAuctions] = useState<DemoAuction[]>(DEMO_AUCTIONS);
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleBid = async (auction: typeof DEMO_AUCTIONS[0]) => {
    if (!user) return;
    const amount = parseInt(bidAmounts[auction.id] ?? "");
    if (isNaN(amount) || amount <= auction.current_price) {
      toast.error("يجب أن يكون مبلغ المزايدة أعلى من السعر الحالي");
      return;
    }
    if (coins < amount) {
      toast.error("عملاتك غير كافية");
      return;
    }

    setLoading(auction.id);
    const ok = spendCoins(amount);
    if (!ok) { setLoading(null); return; }

    // Update local state
    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auction.id
          ? { ...a, current_price: amount, bid_count: a.bid_count + 1, highest_bidder_id: user.id }
          : a
      )
    );

    toast.success(`تم تقديم مزايدتك بـ ${amount} عملة! 🎉`);
    setBidAmounts((prev) => ({ ...prev, [auction.id]: "" }));
    setLoading(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold-glow)] border border-[rgba(245,166,35,0.3)] flex items-center justify-center">
            <Gavel className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">المزاد الأسبوعي</h1>
            <p className="text-[var(--text-muted)] text-sm">مزايدة على عناصر نادرة وحصرية</p>
          </div>
        </div>
        <Badge variant="gold" size="md">
          <Coins className="w-3.5 h-3.5" />
          {Math.floor(coins).toLocaleString("ar")} عملة
        </Badge>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1a0f2e] to-[#0f1a2e] border border-[rgba(168,85,247,0.3)] rounded-2xl p-5 flex items-center gap-4">
        <span className="text-4xl">🔨</span>
        <div>
          <p className="font-bold text-[var(--text)]">المزاد يبدأ كل يوم جمعة!</p>
          <p className="text-sm text-[var(--text-soft)] mt-0.5">عناصر حصرية وأسطورية لا تجدها في المتجر العادي</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="purple" size="sm">
              <AlertTriangle className="w-3 h-3" /> السوق السوداء قريباً
            </Badge>
          </div>
        </div>
      </div>

      {/* Active auctions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctions.map((auction) => {
          const rarity = auction.item.rarity;
          const isWinning = auction.highest_bidder_id === user?.id;

          return (
            <div
              key={auction.id}
              className={cn(
                "bg-[var(--bg-surface)] rounded-2xl border p-5 transition-all duration-200",
                RARITY_STYLE[rarity]
              )}
            >
              {/* Item header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-3xl",
                    rarity === "legendary" ? "bg-[var(--gold-glow)]" :
                    rarity === "epic" ? "bg-[var(--purple-glow)]" :
                    rarity === "rare" ? "bg-[var(--blue-glow)]" : "bg-[var(--bg-surface2)]"
                  )}>
                    {(auction.item as typeof auction.item & { emoji: string }).emoji}
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]">{auction.item.name_ar}</p>
                    <Badge
                      variant={rarity === "legendary" ? "gold" : rarity === "epic" ? "purple" : rarity === "rare" ? "blue" : "surface"}
                      size="sm"
                      className="mt-0.5"
                    >
                      {rarity === "legendary" ? "🏆 أسطوري" : rarity === "epic" ? "💎 ملحمي" : rarity === "rare" ? "⭐ نادر" : "عادي"}
                    </Badge>
                  </div>
                </div>
                <CountdownBadge endsAt={auction.ends_at} />
              </div>

              {/* Price info */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-[var(--bg-surface2)] rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-[var(--text-muted)]">السعر الحالي</p>
                  <p className="text-sm font-bold text-[var(--gold)]">{auction.current_price}</p>
                </div>
                <div className="bg-[var(--bg-surface2)] rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-[var(--text-muted)]">عدد المزايدات</p>
                  <p className="text-sm font-bold text-[var(--text)]">
                    <TrendingUp className="w-3 h-3 inline ml-1" />
                    {auction.bid_count}
                  </p>
                </div>
                <div className="bg-[var(--bg-surface2)] rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-[var(--text-muted)]">الحد الأدنى</p>
                  <p className="text-sm font-bold text-[var(--text)]">{auction.current_price + 1}+</p>
                </div>
              </div>

              {isWinning && (
                <div className="mb-3 bg-[var(--gold-glow2)] border border-[rgba(245,166,35,0.3)] rounded-xl p-2.5 flex items-center gap-2 text-[var(--gold)] text-sm">
                  <Crown className="w-4 h-4" />
                  <span className="font-semibold">أنت الأعلى مزايدة!</span>
                </div>
              )}

              {/* Bid input */}
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`${auction.current_price + 1}+`}
                  value={bidAmounts[auction.id] ?? ""}
                  onChange={(e) => setBidAmounts((prev) => ({ ...prev, [auction.id]: e.target.value }))}
                  dir="ltr"
                  className="flex-1"
                />
                <Button
                  variant="gold"
                  size="md"
                  loading={loading === auction.id}
                  onClick={() => handleBid(auction)}
                >
                  <Gavel className="w-4 h-4" />
                  زايد
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* My bids summary */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-5">
        <h2 className="font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
          مزايداتي النشطة
        </h2>
        {auctions.some((a) => a.highest_bidder_id === user?.id) ? (
          <div className="space-y-2">
            {auctions
              .filter((a) => a.highest_bidder_id === user?.id)
              .map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--gold-glow2)] border border-[rgba(245,166,35,0.15)]">
                  <span className="text-xl">{(a.item as typeof a.item & { emoji: string }).emoji}</span>
                  <p className="text-sm font-medium text-[var(--text)] flex-1">{a.item.name_ar}</p>
                  <Badge variant="gold" size="sm">{a.current_price} عملة</Badge>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-[var(--text-muted)] text-sm text-center py-4">لا توجد مزايدات نشطة</p>
        )}
      </div>
    </div>
  );
}
