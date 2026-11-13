import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { profile } from '../data';
import { useSite } from '../lib/site';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'research', label: 'Research' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

// Which section is under the header, how far down the page we are, and whether we have left the top.
function useScrollState() {
  const [active, setActive] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      let current = '';
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
      setScrolled(window.scrollY > 60);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { active, scrolled, bar };
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, setPaletteOpen } = useSite();
  const { active, scrolled, bar } = useScrollState();
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const themeLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  // Over the dark banner the header is see-through with white text; once the page scrolls it turns solid.
  const solid = scrolled || open;
  const iconBtn = solid
    ? 'border-line bg-surface text-muted hover:border-signal hover:text-signal'
    : 'border-white/35 bg-white/5 text-white hover:bg-white/15';

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${solid ? 'bg-surface shadow-header' : 'bg-transparent'}`}>
        <nav className="wrap flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
          <a href="#top" className={`whitespace-nowrap font-display text-[1.05rem] font-bold uppercase tracking-wide sm:text-[1.15rem] ${solid ? 'text-ink' : 'text-white'}`}>
            Dev <span className={solid ? 'text-signal' : 'text-[#7FD1CB]'}>Kumar</span> Dahiya
          </a>
          <div className="hidden items-center lg:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={active === l.id ? 'true' : undefined}
                className={`px-2.5 py-2 font-nav text-[0.95rem] transition-colors xl:px-3.5 ${
                  active === l.id
                    ? solid ? 'text-signal' : 'text-white'
                    : solid ? 'text-ink/80 hover:text-signal' : 'text-white/70 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className={`inline-flex h-9 items-center gap-2 rounded-[5px] border px-2.5 font-nav text-[0.88rem] transition-colors ${iconBtn}`}
              aria-label="Search projects and sections"
            >
              <Search size={16} aria-hidden />
              <span className="hidden sm:inline">Search</span>
              <span className={`hidden whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[0.7rem] xl:inline ${solid ? 'border-line' : 'border-white/30'}`}>Ctrl K</span>
            </button>
            <button type="button" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel} className={`grid h-9 w-9 place-items-center rounded-[5px] border transition-colors ${iconBtn}`}>
              <ThemeIcon size={17} aria-hidden />
            </button>
            <a href={profile.resumeUrl} className="btn-primary hidden py-2 sm:inline-flex" target="_blank" rel="noreferrer">
              Résumé
            </a>
            <button
              type="button"
              className={`grid h-9 w-9 place-items-center rounded-[5px] border lg:hidden ${iconBtn}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </nav>
        {open && (
          <div id="mobile-menu" className="wrap grid grid-cols-2 gap-1 pb-4 font-nav lg:hidden">
            {links.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={`rounded-[5px] px-3 py-2 ${active === l.id ? 'bg-tint font-medium text-signal' : 'hover:bg-tint'}`} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href={profile.resumeUrl} className="btn-primary col-span-2 mt-2 justify-center sm:hidden" target="_blank" rel="noreferrer">
              Résumé
            </a>
          </div>
        )}
        {/* Reading progress */}
        <div ref={bar} className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-signal" aria-hidden />
      </header>

      <a
        href="#top"
        aria-label="Back to top"
        className={`fixed bottom-4 right-4 z-30 grid h-10 w-10 place-items-center rounded-[5px] bg-signal text-white shadow-card transition-[opacity,transform] duration-300 hover:bg-signal/85 ${
          scrolled ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <ArrowUp size={18} aria-hidden />
      </a>
    </>
  );
}
