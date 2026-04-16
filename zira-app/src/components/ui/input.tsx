"use client";

import { cn } from "@/utils/cn";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium"
            style={{ color: "var(--tx-2)", fontFamily: "var(--font-ui)" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--tx-3)" }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 rounded-xl px-4 text-sm transition-all duration-200",
              "placeholder:text-[var(--tx-4)]",
              "focus:outline-none",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              icon && "pr-10",
              className
            )}
            style={{
              background: "rgba(30,21,16,0.65)",
              border: error ? "1px solid var(--crimson-hi)" : "1px solid var(--b1)",
              color: "var(--tx)",
              backdropFilter: "blur(8px)",
              boxShadow: error
                ? "inset 0 1px 0 rgba(181,42,42,0.08)"
                : "inset 0 1px 0 rgba(201,168,76,0.05)",
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.border = "1px solid var(--b2)";
                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(201,168,76,0.10), inset 0 1px 0 rgba(201,168,76,0.08)";
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = error ? "1px solid var(--crimson-hi)" : "1px solid var(--b1)";
              e.currentTarget.style.boxShadow = error
                ? "inset 0 1px 0 rgba(181,42,42,0.08)"
                : "inset 0 1px 0 rgba(201,168,76,0.05)";
              props.onBlur?.(e);
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs mt-0.5" style={{ color: "var(--crimson-hi)", fontFamily: "var(--font-ui)" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
