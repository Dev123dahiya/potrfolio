import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Copy, FileText, FolderGit2, Hash, Moon, Search } from 'lucide-react';
import { featured, profile, projects } from '../data';
import { scrollToId, useSite } from '../lib/site';

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: typeof Search;
  run: () => void;
}

const sections: [string, string][] = [
  ['work', 'Selected work'],
  ['experience', 'Experience'],
  ['research', 'Research'],
  ['education', 'Education'],
  ['skills', 'Skills'],
  ['contact', 'Get in touch'],
];

// Ctrl/Cmd+K (or "/") opens a search box that jumps to any section or project.
export default function Palette() {
  const { paletteOpen, setPaletteOpen, open, toggleTheme } = useSite();
  const dialog = useRef<HTMLDialogElement>(null);
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && e.target.closest('input, textarea, [contenteditable]');
      if ((e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setPaletteOpen]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (paletteOpen && !d.open) {
      setText('');
      setIndex(0);
      d.showModal();
    } else if (!paletteOpen && d.open) {
      d.close();
    }
  }, [paletteOpen]);

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...sections.map(([id, label]) => ({ id: `s-${id}`, label, hint: 'Section', icon: Hash, run: () => scrollToId(id) })),
      { id: 'p-featured', label: featured.name, hint: 'Featured project', icon: FolderGit2, run: () => scrollToId('work') },
      ...projects.map((p) => ({ id: `p-${p.name}`, label: p.name, hint: p.area, icon: FolderGit2, run: () => open(p.name) })),
      { id: 'a-resume', label: 'Open résumé (PDF)', hint: 'Action', icon: FileText, run: () => window.open(profile.resumeUrl, '_blank', 'noopener') },
      { id: 'a-email', label: 'Copy email address', hint: 'Action', icon: Copy, run: () => void navigator.clipboard?.writeText(profile.email) },
      { id: 'a-theme', label: 'Switch light / dark theme', hint: 'Action', icon: Moon, run: toggleTheme },
    ];
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    return all.filter((it) => words.every((w) => `${it.label} ${it.hint}`.toLowerCase().includes(w))).slice(0, 9);
  }, [text, open, toggleTheme]);

  const choose = (item: Item | undefined) => {
    if (!item) return;
    setPaletteOpen(false);
    // Let the dialog close before scrolling or opening the next one.
    setTimeout(item.run, 0);
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Search"
      onClose={() => setPaletteOpen(false)}
      onClick={(e) => e.target === dialog.current && setPaletteOpen(false)}
      className="m-0 mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-[15px] border border-line bg-surface p-0 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} className="shrink-0 text-muted" aria-hidden />
        <input
          autoFocus
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setIndex((i) => Math.min(items.length - 1, i + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              choose(items[index]);
            }
          }}
          placeholder="Search projects, sections and actions"
          aria-label="Search projects, sections and actions"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={items[index] ? `palette-${index}` : undefined}
          className="h-14 w-full bg-transparent text-[1.05rem] text-ink outline-none placeholder:text-muted"
        />
        <span className="kbd shrink-0">Esc</span>
      </div>
      <ul id="palette-list" role="listbox" className="max-h-[22rem] overflow-y-auto p-2">
        {items.length === 0 && <li className="px-3 py-6 text-center text-muted">Nothing matches “{text}”. Try a technology, such as Python or Kubernetes.</li>}
        {items.map((it, i) => (
          <li key={it.id} id={`palette-${i}`} role="option" aria-selected={i === index}>
            <button
              type="button"
              tabIndex={-1}
              onMouseMove={() => setIndex(i)}
              onClick={() => choose(it)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${i === index ? 'bg-signalSoft' : ''}`}
            >
              <it.icon size={17} className="shrink-0 text-muted" aria-hidden />
              <span className="min-w-0 flex-1 truncate font-medium">{it.label}</span>
              <span className="shrink-0 text-[0.85rem] text-muted">{it.hint}</span>
              {i === index && <ArrowRight size={16} className="shrink-0 text-signal" aria-hidden />}
            </button>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line px-4 py-2.5 text-[0.82rem] text-muted">
        <span><span className="kbd">↑</span> <span className="kbd">↓</span> to move</span>
        <span><span className="kbd">Enter</span> to open</span>
      </p>
    </dialog>
  );
}
