import type { ReactNode } from 'react';

/**
 * Shared pieces for the project demos.
 *
 * Every demo states up front whether it is computing live in the browser or
 * replaying output recorded from the real project, because the two are worth
 * very different amounts and a visitor should never have to guess which they
 * are looking at.
 */

export function DemoNote({ kind, children }: { kind: 'live' | 'recorded'; children: ReactNode }) {
  const live = kind === 'live';
  return (
    <p
      className={`flex items-start gap-2 rounded-[7px] border px-3 py-2 text-[0.84rem] leading-snug ${
        live ? 'border-signal/35 bg-signalSoft text-signal' : 'border-line bg-base text-muted'
      }`}
    >
      <span
        aria-hidden
        className={`mt-[0.3rem] h-2 w-2 shrink-0 rounded-full ${live ? 'bg-signal' : 'bg-muted'}`}
      />
      <span>
        <strong className="font-semibold">{live ? 'Running here.' : 'Recorded output.'}</strong>{' '}
        {children}
      </span>
    </p>
  );
}

export function Control({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-nav text-[0.82rem] font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.78rem] leading-snug text-muted">{hint}</span>}
    </label>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-[5px] border px-2.5 py-1 font-nav text-[0.84rem] transition-colors ${
            value === o.value
              ? 'border-signal bg-signal text-white'
              : 'border-line bg-surface text-muted hover:border-signal hover:text-signal'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between font-nav text-[0.82rem] font-medium text-muted">
        {label}
        <span className="font-mono text-[0.84rem] text-ink">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-signal"
      />
    </label>
  );
}

/** A terminal-looking frame for text output. */
export function Output({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-line bg-[#0d1117]">
      {label && (
        <p className="border-b border-white/10 px-3 py-1.5 font-mono text-[0.75rem] text-white/55">{label}</p>
      )}
      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[0.78rem] leading-relaxed text-[#d7e2ea]">
        {children}
      </pre>
    </div>
  );
}

/** A result table. Columns are inferred from the first row. */
export function Table({ rows, empty = 'No rows.' }: { rows: Record<string, unknown>[]; empty?: string }) {
  if (rows.length === 0) return <p className="px-1 py-3 text-[0.88rem] text-muted">{empty}</p>;
  const cols = Object.keys(rows[0]);
  return (
    <div className="overflow-x-auto rounded-[8px] border border-line">
      <table className="w-full border-collapse text-left font-mono text-[0.8rem]">
        <thead>
          <tr className="bg-base">
            {cols.map((c) => (
              <th key={c} className="border-b border-line px-2.5 py-1.5 font-semibold text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-base/50' : undefined}>
              {cols.map((c) => (
                <td key={c} className="border-b border-line/60 px-2.5 py-1.5">
                  {r[c] === null || r[c] === undefined ? (
                    <span className="text-muted/70">NULL</span>
                  ) : (
                    String(r[c])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A labelled number, for the measured results each demo reports. */
export function Stat({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="rounded-[7px] border border-line bg-base px-3 py-2">
      <p className="font-nav text-[0.76rem] uppercase tracking-wide text-muted">{label}</p>
      <p
        className={`mt-0.5 font-mono text-[1.05rem] font-semibold ${
          tone === 'good' ? 'text-signal' : tone === 'bad' ? 'text-amber' : 'text-ink'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function DemoError({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-[7px] border border-amber/40 bg-amber/10 px-3 py-2 font-mono text-[0.82rem] text-amber">
      {children}
    </p>
  );
}
