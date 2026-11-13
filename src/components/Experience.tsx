import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { experience } from '../data';

// One company at a time: pick it on the left, read it on the right.
export default function Experience() {
  const [active, setActive] = useState(0);
  const e = experience[active];

  const onKey = (ev: React.KeyboardEvent) => {
    const step = ev.key === 'ArrowDown' || ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowUp' || ev.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    const next = (active + step + experience.length) % experience.length;
    setActive(next);
    document.getElementById(`exp-tab-${next}`)?.focus();
  };

  return (
    <section id="experience" className="py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Experience</h2>
        <p className="lead">Three roles so far. Choose one to see what I did there.</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:gap-8">
          <div role="tablist" aria-label="Roles" aria-orientation="vertical" onKeyDown={onKey} className="grid gap-3 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1">
            {experience.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.org}
                  id={`exp-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="exp-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-[border-color,background-color,box-shadow] ${
                    on ? 'border-signal bg-surface shadow-[0_14px_34px_-22px_rgb(var(--signal))]' : 'border-line bg-surface/60 hover:border-ink/30 hover:bg-surface'
                  }`}
                >
                  <span className={`grid h-14 w-[5.5rem] shrink-0 place-items-center rounded-lg px-3 ${x.logoOnDark ? 'bg-[#0d0d12]' : 'border border-line bg-white'}`}>
                    <img src={x.logo} alt="" className="max-h-8 w-auto max-w-full object-contain" loading="lazy" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{x.org}</span>
                    <span className="block text-[0.88rem] text-muted">
                      {x.start} – {x.end}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id="exp-panel"
            role="tabpanel"
            aria-labelledby={`exp-tab-${active}`}
            key={e.org}
            className="panel-in rounded-2xl border border-line bg-surface p-6 sm:p-8 lg:col-span-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
              <div>
                <h3 className="font-display text-[1.5rem] font-bold leading-snug tracking-[-0.015em]">{e.role}</h3>
                <p className="mt-1 text-muted">
                  {e.org}, {e.place}
                </p>
              </div>
              {active === 0 && (
                <p className="inline-flex items-center gap-2 rounded-full bg-signalSoft px-2.5 py-1 text-[0.82rem] font-medium text-signal">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden /> Current role
                </p>
              )}
            </div>
            <ul className="mt-6 space-y-3.5">
              {e.points.map((pt) => (
                <li key={pt} className="relative pl-6 leading-relaxed">
                  <span className="absolute left-0 top-[0.72em] h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>
            <a href={e.url} target="_blank" rel="noreferrer" className="link mt-7 inline-flex items-center gap-1.5">
              Visit {e.org} <ExternalLink size={15} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
