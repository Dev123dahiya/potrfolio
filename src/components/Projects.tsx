import { useState } from 'react';
import { Github } from 'lucide-react';
import { featured, projects, type Area } from '../data';

const filters: ('All' | Area)[] = ['All', 'AI & LLMs', 'Backend & full stack', 'Data'];

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const shown = filter === 'All' ? projects : projects.filter((p) => p.area === filter);

  return (
    <section id="work" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Selected work</h2>

        {/* Featured project */}
        <article className="mt-10 grid gap-10 rounded-2xl border border-line bg-paper p-6 sm:p-9 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="font-display text-[1.75rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2rem]">
              {featured.name}
            </h3>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{featured.summary}</p>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
              {featured.stack.map((s) => (
                <li key={s} className="tag bg-surface">
                  {s}
                </li>
              ))}
            </ul>
            <a href={featured.repo} className="btn-quiet mt-7" target="_blank" rel="noreferrer">
              <Github size={17} aria-hidden /> View the code
            </a>
          </div>
          <div className="lg:col-span-6">
            <p className="font-semibold">How it works</p>
            <ol className="mt-4 space-y-4">
              {featured.steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] items-baseline gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-signalSoft text-[0.85rem] font-semibold text-signal">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </article>

        {/* Filter + list */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-xl font-bold">More projects</h3>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-[0.9rem] transition-colors ${
                  filter === f
                    ? 'border-ink bg-ink text-white'
                    : 'border-line bg-surface text-muted hover:border-ink/40 hover:text-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-6 divide-y divide-line border-y border-line">
          {shown.map((p) => (
            <li key={p.name} className="group grid gap-2 py-6 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4">
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-[1.2rem] font-bold leading-snug tracking-[-0.01em] decoration-signal/40 underline-offset-4 group-hover:underline"
                >
                  {p.name}
                </a>
                <p className="mt-1 text-[0.85rem] text-signal">{p.area}</p>
              </div>
              <p className="leading-relaxed text-muted md:col-span-5">{p.summary}</p>
              <p className="text-[0.9rem] leading-relaxed text-ink/80 md:col-span-3">{p.stack.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
