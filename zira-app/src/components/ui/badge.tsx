import { cn } from "@/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "green" | "purple" | "blue" | "red" | "surface";
  size?: "sm" | "md";
  className?: string;
}

const VARIANTS: Record<string, { color: string; bg: string; border: string }> = {
  gold:    { color: "var(--gold)",          bg: "rgba(201,168,76,0.12)",  border: "rgba(201,168,76,0.30)" },
  green:   { color: "var(--verdigris-hi)",  bg: "rgba(61,122,100,0.12)", border: "rgba(61,122,100,0.30)" },
  purple:  { color: "var(--premium)",       bg: "rgba(155,89,182,0.12)", border: "rgba(155,89,182,0.30)" },
  blue:    { color: "var(--azure)",         bg: "rgba(58,95,149,0.12)",  border: "rgba(58,95,149,0.30)" },
  red:     { color: "var(--crimson-hi)",    bg: "rgba(181,42,42,0.12)",  border: "rgba(181,42,42,0.30)" },
  surface: { color: "var(--tx-2)",          bg: "rgba(30,21,16,0.50)",   border: "var(--b1)" },
};

export function Badge({ children, variant = "surface", size = "sm", className }: BadgeProps) {
  const v = VARIANTS[variant];

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizes[size],
        className
      )}
      style={{
        color: v.color,
        background: v.bg,
        border: `1px solid ${v.border}`,
      }}
    >
      {children}
    </span>
  );
}
