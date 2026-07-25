import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { profile } from '../data';

const links = [
  ['About', 'about'],
  ['Experience', 'experience'],
  ['Projects', 'projects'],
  ['Skills', 'skills'],
  ['Research', 'research'],
  ['Contact', 'contact'],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? 'border-b border-line bg-base/80 backdrop-blur' : ''}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          Dev<span className="text-accent">.</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="link-underline text-sm text-muted hover:text-ink">{label}</a>
          ))}
          <a href={profile.resumeUrl} download
             className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-base hover:brightness-110">
            Résumé
          </a>
        </div>
        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-line bg-base/95 px-5 py-4 md:hidden">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
               className="block py-2 text-muted hover:text-ink">{label}</a>
          ))}
          <a href={profile.resumeUrl} download className="mt-2 inline-block rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-base">Résumé</a>
        </div>
      )}
    </header>
  );
}
