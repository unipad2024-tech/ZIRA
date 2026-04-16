"use client";

import { cn } from "@/utils/cn";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "ghost" | "outline" | "danger" | "surface" | "parchment";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] disabled:opacity-40 disabled:pointer-events-none active:scale-[0.97] relative overflow-hidden";

    const variants: Record<string, string> = {
      gold: [
        "bg-gradient-to-b from-[var(--gold-hi)] via-[var(--gold)] to-[var(--gold-lo)]",
        "text-[#0A0804] font-bold",
        "shadow-[0_2px_0_rgba(0,0,0,0.5),0_0_20px_rgba(201,168,76,0.30)]",
        "hover:shadow-[0_2px_0_rgba(0,0,0,0.5),0_0_32px_rgba(201,168,76,0.55)]",
        "hover:from-[var(--gold-hi)] hover:via-[var(--gold-hi)] hover:to-[var(--gold)]",
        "border border-[rgba(232,201,122,0.3)]",
      ].join(" "),
      ghost: "text-[var(--tx-2)] hover:text-[var(--tx)] hover:bg-[rgba(201,168,76,0.06)]",
      outline: [
        "border border-[var(--b1)] text-[var(--tx-2)]",
        "hover:border-[var(--b2)] hover:text-[var(--gold)] hover:bg-[rgba(201,168,76,0.06)]",
        "bg-transparent",
      ].join(" "),
      danger: [
        "bg-gradient-to-b from-[var(--crimson-hi)] to-[var(--crimson)]",
        "text-[var(--parchment)] border border-[rgba(181,42,42,0.3)]",
        "shadow-[0_0_16px_rgba(139,26,26,0.3)]",
        "hover:shadow-[0_0_24px_rgba(139,26,26,0.5)]",
      ].join(" "),
      surface: [
        "border border-[var(--b1)] text-[var(--tx-2)]",
        "hover:text-[var(--tx)] hover:border-[var(--b2)]",
        "bg-[rgba(30,21,16,0.50)] hover:bg-[rgba(39,26,14,0.65)]",
      ].join(" "),
      parchment: [
        "bg-[var(--parchment)] text-[var(--black)] border border-[var(--parchment-md)]",
        "shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
        "hover:bg-[var(--vellum)]",
      ].join(" "),
    };

    const sizes: Record<string, string> = {
      sm:   "h-8 px-3 text-xs",
      md:   "h-10 px-5 text-sm",
      lg:   "h-12 px-7 text-[15px]",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
