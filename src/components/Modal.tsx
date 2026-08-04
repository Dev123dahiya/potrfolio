import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-panel p-6 shadow-glow">
        {title && <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>}
        <div className="prose max-w-none text-sm text-muted">{children}</div>
        <div className="mt-6 text-right">
          <button onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm">Close</button>
        </div>
      </div>
    </div>
  );
}
