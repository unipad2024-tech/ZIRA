"use client";

import { useEffect, useRef } from "react";

export function RenaissanceCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const pos    = useRef({ x: -100, y: -100 });
  const ring   = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Don't show on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      // Ring lerps smoothly
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);

    // Hover effects
    const addHover = () => {
      dotRef.current?.classList.add("scale-150", "opacity-50");
      ringRef.current?.classList.add("scale-150");
    };
    const removeHover = () => {
      dotRef.current?.classList.remove("scale-150", "opacity-50");
      ringRef.current?.classList.remove("scale-150");
    };
    document.querySelectorAll("a,button,[role=button]").forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Gold dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full pointer-events-none transition-transform duration-75"
        style={{ background: "var(--gold)", boxShadow: "0 0 8px var(--gold), 0 0 16px rgba(201,168,76,0.5)" }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full pointer-events-none transition-[transform] duration-[50ms]"
        style={{
          border: "1px solid rgba(201,168,76,0.5)",
          boxShadow: "0 0 8px rgba(201,168,76,0.15)",
        }}
      />
    </>
  );
}
