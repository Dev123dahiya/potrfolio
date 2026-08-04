import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch { return true; }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <button aria-label="Toggle theme" onClick={() => setDark((d) => !d)}
      className={`grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent ${className}`}>
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
