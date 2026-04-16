"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  size: number; speed: number;
  opacity: number; delay: number;
  drift: number;
}

export function GoldParticles({ count = 25 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x:       Math.random() * window.innerWidth,
      y:       window.innerHeight + Math.random() * 200,
      size:    0.8 + Math.random() * 2.5,
      speed:   0.3 + Math.random() * 0.8,
      opacity: 0.1 + Math.random() * 0.6,
      delay:   Math.random() * 8000,
      drift:   (Math.random() - 0.5) * 0.4,
    }));

    let startTime: number | null = null;
    let raf: number;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const elapsed = timestamp - startTime! - p.delay;
        if (elapsed < 0) return;

        // Normalise progress 0–1
        const totalHeight = canvas.height + 200;
        const travelled   = (elapsed * p.speed * 0.05) % totalHeight;
        const py = canvas.height + 100 - travelled;
        const px = p.x + Math.sin(elapsed * 0.001 + p.drift) * 30;

        // Fade in/out
        const progress = travelled / totalHeight;
        const alpha = p.opacity *
          (progress < 0.1 ? progress / 0.1 :
           progress > 0.85 ? (1 - progress) / 0.15 : 1);

        // Gold dot with soft glow
        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3);
        grad.addColorStop(0,   `rgba(232,201,122,${alpha})`);
        grad.addColorStop(0.4, `rgba(201,168,76,${alpha * 0.6})`);
        grad.addColorStop(1,   `rgba(201,168,76,0)`);

        ctx.beginPath();
        ctx.arc(px, py, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Solid center
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,220,150,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
