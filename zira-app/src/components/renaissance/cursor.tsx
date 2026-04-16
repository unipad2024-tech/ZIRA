"use client";

import { useEffect, useRef } from "react";

export function RenaissanceCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ x: -100, y: -100 });
  const ring    = useRef({ x: -100, y: -100 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      }
      // Faster lerp: 0.28 instead of 0.12
      ring.current.x += (pos.current.x - ring.current.x) * 0.28;
      ring.current.y += (pos.current.y - ring.current.y) * 0.28;
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ring.current.x - 16}px, ${ring.current.y - 16}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(animate);

    const addHover = () => {
      if (dotRef.current)  dotRef.current.style.transform  += " scale(2)";
      if (ringRef.current) ringRef.current.style.opacity = "0.4";
    };
    const removeHover = () => {
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };

    const els = document.querySelectorAll("a,button,[role=button]");
    els.forEach(el => {
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
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full pointer-events-none"
        style={{ background: "var(--gold)", boxShadow: "0 0 6px var(--gold), 0 0 14px rgba(201,168,76,0.6)" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(201,168,76,0.55)", boxShadow: "0 0 10px rgba(201,168,76,0.12)" }}
      />
    </>
  );
}
