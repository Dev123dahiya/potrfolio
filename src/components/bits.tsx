import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

/** Company / school logo with a monogram fallback if the image can't load. */
export function Logo({ domain, name, className = '' }: { domain: string; name: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
  if (failed) {
    return (
      <div className={`grid place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-accent2/30 font-display font-bold text-ink ${className}`}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      onError={() => setFailed(true)}
      alt={name}
      className={`rounded-xl bg-white object-contain p-1.5 ${className}`}
    />
  );
}

/** Project artwork. Shows a real photo from the web; if it fails to load it
 *  falls back to a bundled illustration. Upgrades to the repo's real GitHub
 *  preview image when that loads. */
export function Cover({ name, image, fallback, preview }: { name: string; image: string; fallback: string; preview?: string }) {
  const [src, setSrc] = useState(image);
  const [ok, setOk] = useState(false);
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-xl border border-line bg-panel">
      <img src={src} alt={name} loading="lazy"
           onError={() => setSrc(fallback)}
           className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-panel/70 via-transparent to-transparent" />
      {preview && (
        <img src={preview} onLoad={() => setOk(true)} alt={name}
             className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ok ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </div>
  );
}

/** Number that counts up when scrolled into view. Falls back to raw text for non-numeric values. */
export function Counter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState<string>(isNaN(Number(value)) ? value : '0');

  useEffect(() => {
    if (!inView) return;
    const num = Number(value);
    if (isNaN(num)) { setDisplay(value); return; }
    const decimals = (value.split('.')[1] || '').length;
    const controls = animate(0, num, {
      duration: 1.2, ease: 'easeOut',
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/** Tilt-on-hover wrapper for cards. */
export function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function onMove(e: React.MouseEvent) {
    const el = ref.current!; const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateZ(0)`;
  }
  function reset() { if (ref.current) ref.current.style.transform = ''; }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset}
      className={`transition-transform duration-150 will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
