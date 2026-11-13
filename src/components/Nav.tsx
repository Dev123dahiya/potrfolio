import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { profile } from '../data';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#research', label: 'Research' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur">
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <a href="#top" className="font-display text-lg font-bold tracking-[-0.01em]">
          Dev Kumar Dahiya
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[0.95rem] text-muted transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a href={profile.resumeUrl} className="btn-primary py-2" target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.95rem] md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          Menu
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="wrap flex flex-col gap-1 pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-md px-2 py-2 hover:bg-surface" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href={profile.resumeUrl} className="btn-primary mt-2 justify-center" target="_blank" rel="noreferrer">
            Résumé
          </a>
        </div>
      )}
    </header>
  );
}
