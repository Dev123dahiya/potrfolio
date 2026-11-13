import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/**
 * A card that appears beside its trigger on hover and on keyboard focus.
 *
 * Hover alone would hide this from anyone using a keyboard or a screen
 * reader, so the trigger owns the card through aria-describedby and focus
 * opens it the same way the pointer does. Escape closes it without closing
 * whatever is underneath, and the card itself is inert: everything in it is
 * also reachable in the dialog, so there is nothing to tab into.
 */
export default function HoverCard({
  children,
  card,
  disabled = false,
}: {
  children: ReactNode;
  card: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<'top' | 'bottom'>('top');
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // A short delay stops the card flashing as the pointer crosses the grid.
  const show = () => {
    if (disabled) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const box = wrap.current?.getBoundingClientRect();
      // Flip below the card when there is not enough room above it.
      if (box) setSide(box.top < 260 ? 'bottom' : 'top');
      setOpen(true);
    }, 220);
  };

  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        hide();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open]);

  return (
    <div
      ref={wrap}
      className="relative h-full"
      onPointerEnter={(e) => e.pointerType !== 'touch' && show()}
      onPointerLeave={hide}
      onFocusCapture={show}
      onBlurCapture={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <div aria-describedby={open ? id : undefined} className="h-full">
        {children}
      </div>
      {open && (
        <div
          id={id}
          role="tooltip"
          // Pointer events off so moving towards the card never traps the
          // pointer, and the card can overlap its neighbours freely.
          className={`hovercard pointer-events-none absolute left-1/2 z-30 w-[min(22rem,calc(100vw-3rem))] -translate-x-1/2 rounded-[12px] border border-line bg-surface p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] ${
            side === 'top' ? 'bottom-[calc(100%+0.6rem)]' : 'top-[calc(100%+0.6rem)]'
          }`}
        >
          {card}
          <span
            aria-hidden
            className={`absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-line bg-surface ${
              side === 'top' ? 'bottom-[-0.42rem] border-b border-r' : 'top-[-0.42rem] border-l border-t'
            }`}
          />
        </div>
      )}
    </div>
  );
}
