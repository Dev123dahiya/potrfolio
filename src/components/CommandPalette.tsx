import { useEffect, useMemo, useState } from 'react';

const COMMANDS = [
  { id: 'projects', label: 'View Projects', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'resume', label: 'Download Resume', action: () => window.open('/Dev_Kumar_Dahiya_Resume.pdf', '_blank') },
  { id: 'github', label: 'Open GitHub', action: () => window.open(window.location.origin + '/'), },
  { id: 'linkedin', label: 'Open LinkedIn', action: () => window.open('https://linkedin.com/in/devkumardahiya', '_blank') },
  { id: 'contact', label: 'Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'skills', label: 'Skills', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
  { id: 'experience', label: 'Experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) setQuery(''); }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-lg bg-panel p-4 shadow-glow">
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-line bg-base/0 px-3 py-2 text-sm text-ink outline-none" placeholder="Type a command or search..." />
        <ul className="mt-3 max-h-60 overflow-auto">
          {results.map((r) => (
            <li key={r.id}>
              <button onClick={() => { r.action(); onClose(); }} className="w-full text-left px-3 py-2 hover:bg-white/3 rounded">{r.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
