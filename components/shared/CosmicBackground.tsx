'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  drift: number;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const starCount = 180;
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.2,
      opacity: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.15 + 0.02,
      drift: (Math.random() - 0.5) * 0.08,
    }));

    const nebulas = [
      { x: 0.15, y: 0.3, r: 200, color: 'rgba(124,58,237,0.04)' },
      { x: 0.75, y: 0.6, r: 250, color: 'rgba(6,182,212,0.04)' },
      { x: 0.5, y: 0.85, r: 180, color: 'rgba(168,85,247,0.03)' },
    ];

    let frame: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const n of nebulas) {
        const grd = ctx.createRadialGradient(
          n.x * canvas.width, n.y * canvas.height, 0,
          n.x * canvas.width, n.y * canvas.height, n.r
        );
        grd.addColorStop(0, n.color);
        grd.addColorStop(1, 'transparent');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x * canvas.width, n.y * canvas.height, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const star of stars) {
        const pulse = prefersReducedMotion ? star.opacity : star.opacity * (0.7 + 0.3 * Math.sin(t * star.speed * 3 + star.x));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${pulse})`;
        ctx.fill();

        if (!prefersReducedMotion) {
          star.y -= star.speed * 0.3;
          star.x += star.drift;
          if (star.y < -2) { star.y = canvas.height + 2; star.x = Math.random() * canvas.width; }
          if (star.x < -2) star.x = canvas.width + 2;
          if (star.x > canvas.width + 2) star.x = -2;
        }
      }

      t += 0.016;
      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'var(--background)' }}
    />
  );
}
