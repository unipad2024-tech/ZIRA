"use client";

import { useState, useEffect } from "react";
import { Gavel, Clock, TrendingUp, Crown, Timer, Coins, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUserStore } from "@/store/user-store";

/* ─── Legendary auction items with real painting references ────── */
type DemoAuction = {
  id: string;
  name: string;
  name_ar: string;
  lore: string;
  rarity: "legendary" | "epic" | "rare";
  painting: string;          // Wikimedia URL
  paintingCredit: string;
  startPrice: number;
  currentPrice: number;
  endsAt: string;
  bidCount: number;
  highestBidderId: string | null;
};

/* ── All painting URLs verified 200 OK from Met Museum open access ── */
const AUCTIONS: DemoAuction[] = [
  {
    id: "a1",
    name: "Aegis of Athena",
    name_ar: "درع أثينا",
    lore: "The divine shield forged by Hephaestus, bearing the head of Medusa. Grants invincibility to the worthy scholar.",
    rarity: "legendary",
    painting: "https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg",
    paintingCredit: "Caravaggio — The Denial of Saint Peter, ca. 1610 · The Met",
    startPrice: 1200, currentPrice: 1850,
    endsAt: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    bidCount: 14, highestBidderId: null,
  },
  {
    id: "a2",
    name: "Philosopher's Crown",
    name_ar: "تاج الفيلسوف",
    lore: "Worn by Aristotle as he contemplated the bust of Homer. Those who study under it achieve perfect recall.",
    rarity: "legendary",
    painting: "https://images.metmuseum.org/CRDImages/ep/original/DP-30758-001.jpg",
    paintingCredit: "Rembrandt — Aristotle with a Bust of Homer, 1653 · The Met",
    startPrice: 900, currentPrice: 1340,
    endsAt: new Date(Date.now() + 7 * 3600 * 1000).toISOString(),
    bidCount: 9, highestBidderId: null,
  },
  {
    id: "a3",
    name: "Hemlock of Socrates",
    name_ar: "كأس سقراط",
    lore: "The vessel that carried the great philosopher to immortality. Holding it grants unshakeable conviction.",
    rarity: "epic",
    painting: "https://images.metmuseum.org/CRDImages/ep/original/DP-13139-001.jpg",
    paintingCredit: "Jacques-Louis David — The Death of Socrates, 1787 · The Met",
    startPrice: 600, currentPrice: 820,
    endsAt: new Date(Date.now() + 11 * 3600 * 1000).toISOString(),
    bidCount: 6, highestBidderId: null,
  },
  {
    id: "a4",
    name: "Annunciation Scroll",
    name_ar: "طومار البشارة",
    lore: "A manuscript of divine revelation. Reading one page grants insight equal to a month of study.",
    rarity: "epic",
    painting: "https://images.metmuseum.org/CRDImages/ep/original/DP-40424-001.jpg",
    paintingCredit: "Hans Memling — The Annunciation, ca. 1480 · The Met",
    startPrice: 500, currentPrice: 650,
    endsAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    bidCount: 4, highestBidderId: null,
  },
  {
    id: "a5",
    name: "Sage's Medallion",
    name_ar: "ميدالية الحكيم",
    lore: "Worn by a Renaissance scholar whose identity was never revealed. Said to sharpen memory threefold.",
    rarity: "rare",
    painting: "https://images.metmuseum.org/CRDImages/ep/original/DP-17778-001.jpg",
    paintingCredit: "Sebastiano del Piombo — Portrait, 1519 · The Met",
    startPrice: 280, currentPrice: 390,
    endsAt: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
    bidCount: 3, highestBidderId: null,
  },
  {
    id: "a6",
    name: "Van Gogh's Straw Hat",
    name_ar: "قبعة فان غوخ",
    lore: "The hat worn during the most prolific painting period. Those who possess it never suffer creative drought.",
    rarity: "rare",
    painting: "https://images.metmuseum.org/CRDImages/ep/original/DT1502_cropped2.jpg",
    paintingCredit: "Vincent van Gogh — Self-Portrait with Straw Hat, 1887 · The Met",
    startPrice: 200, currentPrice: 275,
    endsAt: new Date(Date.now() + 32 * 3600 * 1000).toISOString(),
    bidCount: 2, highestBidderId: null,
  },
];

const RARITY = {
  legendary: {
    label: "Legendary",
    color: "var(--gold)",
    glow: "rgba(201,168,76,0.18)",
    border: "rgba(201,168,76,0.45)",
    shadow: "0 0 32px rgba(201,168,76,0.14)",
  },
  epic: {
    label: "Epic",
    color: "var(--premium)",
    glow: "rgba(155,89,182,0.15)",
    border: "rgba(155,89,182,0.40)",
    shadow: "0 0 24px rgba(155,89,182,0.12)",
  },
  rare: {
    label: "Rare",
    color: "var(--azure)",
    glow: "rgba(58,95,149,0.15)",
    border: "rgba(58,95,149,0.38)",
    shadow: "0 0 20px rgba(58,95,149,0.10)",
  },
};

function Countdown({ endsAt }: { endsAt: string }) {
  const [rem, setRem] = useState(() => Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000)));
  useEffect(() => {
    const id = setInterval(() => setRem(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(rem / 3600), m = Math.floor((rem % 3600) / 60), s = rem % 60;
  if (rem === 0) return <span style={{ color: "var(--crimson-hi)", fontSize: "0.7rem" }}>Ended</span>;
  return (
    <span className="font-mono text-xs" style={{ color: h < 2 ? "var(--crimson-hi)" : "var(--tx-2)" }}>
      {h > 0 ? `${h}h ` : ""}{m}m {s}s
    </span>
  );
}

export default function AuctionPage() {
  const { user, coins, spendCoins } = useUserStore();
  const [auctions, setAuctions] = useState(AUCTIONS);
  const [bids, setBids] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const handleBid = (auction: DemoAuction) => {
    if (!user) return;
    const amount = parseInt(bids[auction.id] ?? "");
    if (isNaN(amount) || amount <= auction.currentPrice) {
      toast.error("Bid must exceed current price");
      return;
    }
    if (coins < amount) {
      toast.error("Insufficient coins");
      return;
    }
    setLoading(auction.id);
    if (!spendCoins(amount)) { setLoading(null); return; }
    setAuctions(prev => prev.map(a =>
      a.id === auction.id ? { ...a, currentPrice: amount, bidCount: a.bidCount + 1, highestBidderId: user.id } : a
    ));
    toast.success(`Bid placed — ${amount.toLocaleString()} coins`);
    setBids(prev => ({ ...prev, [auction.id]: "" }));
    setLoading(null);
  };

  return (
    <div className="animate-fade-in space-y-8">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow mb-2">Weekly Event</p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 900,
            background: "linear-gradient(135deg, var(--parchment), var(--gold-hi), var(--gold))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.05,
          }}>The Grand Auction</h1>
          <p className="text-sm mt-1" style={{ color: "var(--tx-3)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
            المزاد الأسبوعي — قطع أسطورية لن تجدها في أي مكان آخر
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid var(--b1)" }}
        >
          <Coins className="w-4 h-4" style={{ color: "var(--gold)" }} />
          <span className="font-bold text-sm" style={{ color: "var(--gold)" }}>{Math.floor(coins).toLocaleString()}</span>
          <span className="text-xs" style={{ color: "var(--tx-3)" }}>coins</span>
        </div>
      </div>

      {/* ── Banner ──────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(30,15,5,0.95) 0%, rgba(15,10,25,0.95) 100%)",
          border: "1px solid rgba(201,168,76,0.25)",
          boxShadow: "0 0 40px rgba(201,168,76,0.08)",
        }}
      >
        {/* Painting strip */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `url('https://images.metmuseum.org/CRDImages/ep/original/DP-30758-001.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center 25%",
        }} />
        <div className="relative z-10 p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.30)" }}
          >
            <Gavel className="w-6 h-6" style={{ color: "var(--gold)" }} />
          </div>
          <div>
            <p className="font-bold" style={{ color: "var(--parchment)", fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
              The auction opens every Friday at midnight.
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--tx-3)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
              Legendary relics. Divine artefacts. Only for those who study hard enough to afford them.
            </p>
          </div>
          <div className="mr-auto flex items-center gap-2 px-3 py-1 rounded-full shrink-0"
            style={{ background: "rgba(155,89,182,0.12)", border: "1px solid rgba(155,89,182,0.30)" }}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: "var(--premium)" }} />
            <span className="text-xs font-semibold" style={{ color: "var(--premium)" }}>Black Market — Coming Soon</span>
          </div>
        </div>
      </div>

      {/* ── Auction Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {auctions.map((a) => {
          const r = RARITY[a.rarity];
          const isWinning = a.highestBidderId === user?.id;

          return (
            <div key={a.id}
              className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(12,8,5,0.85)",
                border: `1px solid ${a.rarity === "legendary" ? "rgba(201,168,76,0.35)" : a.rarity === "epic" ? "rgba(155,89,182,0.30)" : "rgba(58,95,149,0.28)"}`,
                boxShadow: r.shadow,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = r.shadow.replace("0.14","0.28").replace("0.12","0.22").replace("0.10","0.20"); }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = r.shadow; }}
            >
              {/* Painting */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={a.painting}
                  alt={a.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "sepia(0.25) contrast(1.08) brightness(0.85)" }}
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Gradient overlay on painting */}
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(0deg, rgba(12,8,5,0.95) 0%, rgba(12,8,5,0.30) 50%, transparent 100%)`,
                }} />
                {/* Rarity badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: r.color, background: r.glow, border: `1px solid ${r.border}` }}
                  >{r.label}</span>
                </div>
                {/* Timer */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(5,3,2,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Timer className="w-2.5 h-2.5" style={{ color: "var(--tx-3)" }} />
                  <Countdown endsAt={a.endsAt} />
                </div>
                {/* Painting credit */}
                <p className="absolute bottom-1.5 left-2 text-[9px]" style={{ color: "rgba(245,237,214,0.25)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                  {a.paintingCredit}
                </p>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col p-5 gap-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "var(--parchment)", fontSize: "1.05rem" }}>{a.name}</h3>
                    <span className="text-xs shrink-0 mt-0.5" style={{ color: "var(--tx-3)", fontFamily: "var(--font-ui)" }}>{a.name_ar}</span>
                  </div>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--tx-3)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
                    {a.lore}
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Current", value: a.currentPrice.toLocaleString() },
                    { label: "Bids", value: <span className="flex items-center gap-1 justify-center"><TrendingUp className="w-2.5 h-2.5" />{a.bidCount}</span> },
                    { label: "Min Bid", value: `${(a.currentPrice + 1).toLocaleString()}+` },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-2 text-center"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <p className="text-[9px] mb-0.5 uppercase tracking-wider" style={{ color: "var(--tx-4)" }}>{s.label}</p>
                      <p className="text-xs font-bold" style={{ color: "var(--gold)" }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Winning banner */}
                {isWinning && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)", color: "var(--gold)" }}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    You hold the highest bid
                  </div>
                )}

                {/* Bid input */}
                <div className="flex gap-2 mt-auto">
                  <Input
                    type="number"
                    placeholder={`${a.currentPrice + 1}+`}
                    value={bids[a.id] ?? ""}
                    onChange={e => setBids(prev => ({ ...prev, [a.id]: e.target.value }))}
                    dir="ltr"
                    className="flex-1"
                  />
                  <Button variant="gold" size="md" loading={loading === a.id} onClick={() => handleBid(a)}>
                    <Gavel className="w-4 h-4" />
                    Bid
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── My Active Bids ───────────────────────────────────────────── */}
      <div className="glass-card frame rounded-2xl p-6">
        <h2 className="flex items-center gap-2 mb-4 font-semibold" style={{ color: "var(--tx)", fontFamily: "var(--font-display)" }}>
          <Clock className="w-4 h-4" style={{ color: "var(--tx-3)" }} />
          My Active Bids
          <span className="text-xs font-normal" style={{ color: "var(--tx-3)", fontFamily: "var(--font-ui)" }}>· مزايداتي النشطة</span>
        </h2>
        {auctions.some(a => a.highestBidderId === user?.id) ? (
          <div className="space-y-2">
            {auctions.filter(a => a.highestBidderId === user?.id).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <Crown className="w-4 h-4 shrink-0" style={{ color: "var(--gold)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--parchment)", fontFamily: "var(--font-display)" }}>{a.name}</p>
                  <p className="text-xs" style={{ color: "var(--tx-3)" }}>{a.name_ar}</p>
                </div>
                <span className="text-sm font-bold" style={{ color: "var(--gold)" }}>{a.currentPrice.toLocaleString()} <span className="text-xs font-normal" style={{ color: "var(--tx-3)" }}>coins</span></span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-6 text-sm" style={{ color: "var(--tx-4)", fontFamily: "var(--font-accent)", fontStyle: "italic" }}>
            No active bids — place your first bid to claim a relic.
          </p>
        )}
      </div>
    </div>
  );
}
