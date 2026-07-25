import { useEffect, useRef } from 'react';

/**
 * Layered animated background:
 *  - four bright, slow-drifting aurora blobs (CSS)
 *  - a moving conic sheen
 *  - a particle/constellation canvas that links nodes and reacts to the cursor
 * Fixed behind all content; pointer-events disabled.
 */
export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(120, Math.floor((w * h) / 12000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) { p.x += (dx / dist) * 0.8; p.y += (dy / dist) * 0.8; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150,185,255,0.95)';
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 150) {
            ctx.strokeStyle = `rgba(110,160,255,${0.45 * (1 - d / 150)})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    resize(); tick();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-base" />
      <div className="sheen absolute inset-0" />
      <div className="blob absolute -left-24 -top-24 h-[34rem] w-[34rem] rounded-full bg-accent/60 blur-[70px]" />
      <div className="blob blob2 absolute -right-24 top-10 h-[32rem] w-[32rem] rounded-full bg-accent2/60 blur-[70px]" />
      <div className="blob blob3 absolute bottom-[-4rem] left-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-500/50 blur-[70px]" />
      <div className="blob blob4 absolute bottom-16 right-1/4 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/45 blur-[80px]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-base/25" />
    </div>
  );
}
