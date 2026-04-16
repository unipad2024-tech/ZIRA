import { cn } from "@/utils/cn";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  gold?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ className, children, gold, glow, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl p-5 transition-all duration-200",
        gold  ? "glass-card frame-gold" : "glass frame",
        glow  && "frame-gold-glow",
        onClick && "cursor-pointer hover:frame-gold-glow",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3
      className={cn("text-base font-semibold", className)}
      style={{ color: "var(--tx)", fontFamily: "var(--font-ui)" }}
    >
      {children}
    </h3>
  );
}

export function StatCard({
  label,
  value,
  icon,
  color = "gold",
  suffix,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: "gold" | "green" | "purple" | "blue";
  suffix?: string;
}) {
  const colorMap = {
    gold:   { text: "var(--gold)",        bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.2)" },
    green:  { text: "var(--verdigris-hi)", bg: "rgba(61,122,100,0.12)", border: "rgba(61,122,100,0.2)" },
    purple: { text: "var(--premium)",      bg: "rgba(155,89,182,0.12)", border: "rgba(155,89,182,0.2)" },
    blue:   { text: "var(--azure)",        bg: "rgba(58,95,149,0.12)",  border: "rgba(58,95,149,0.2)" },
  };

  const c = colorMap[color];

  return (
    <Card className="flex items-center gap-4">
      <div
        className="p-3 rounded-xl shrink-0"
        style={{ background: c.bg, border: `1px solid ${c.border}` }}
      >
        <span className="w-5 h-5 block" style={{ color: c.text }}>
          {icon}
        </span>
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--tx-3)" }}>{label}</p>
        <p className="text-xl font-bold mt-0.5" style={{ color: "var(--tx)" }}>
          {value}
          {suffix && (
            <span className="text-sm font-normal mr-1" style={{ color: "var(--tx-2)" }}>
              {suffix}
            </span>
          )}
        </p>
      </div>
    </Card>
  );
}
