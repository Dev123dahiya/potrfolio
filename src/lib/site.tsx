// Shared state for the parts of the page that talk to each other:
// the project gallery (search, filter, open project) and the colour theme.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { projects, type Area, type Project } from '../data';

export type Filter = 'All' | Area;
type Theme = 'light' | 'dark';

interface Site {
  query: string;
  setQuery: (q: string) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  /** Name of the project whose details are open, or null. */
  openName: string | null;
  open: (name: string | null) => void;
  /** Set the search, clear the filter and scroll to the gallery. */
  searchFor: (q: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
}

const Ctx = createContext<Site | null>(null);

// Every word typed must start a word somewhere in the project's name, summary, tech list or area.
// Matching at word starts keeps short terms honest: "CI" finds "CI gating" but not "scikit".
export function matches(p: Project, query: string): boolean {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const hay = ` ${p.name} ${p.summary} ${p.stack.join(' ')} ${p.area}`.toLowerCase();
  return words.every((w) => {
    let at = hay.indexOf(w);
    while (at !== -1) {
      if (!/[a-z0-9]/.test(hay[at - 1])) return true;
      at = hay.indexOf(w, at + 1);
    }
    return false;
  });
}

export function countMatches(query: string): number {
  return projects.filter((p) => matches(p, query)).length;
}

export function scrollToId(id: string) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [openName, setOpenName] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0A111E' : '#F3F5F8');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* private mode: the choice lasts for this visit only */
      }
      return next;
    });
  }, []);

  const searchFor = useCallback((q: string) => {
    setQuery(q);
    setFilter('All');
    scrollToId('gallery');
  }, []);

  const value = useMemo(
    () => ({ query, setQuery, filter, setFilter, openName, open: setOpenName, searchFor, theme, toggleTheme, paletteOpen, setPaletteOpen }),
    [query, filter, openName, searchFor, theme, toggleTheme, paletteOpen]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite(): Site {
  const site = useContext(Ctx);
  if (!site) throw new Error('useSite must be used inside SiteProvider');
  return site;
}
