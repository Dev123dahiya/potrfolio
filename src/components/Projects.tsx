import { useState } from 'react';
import { Github } from 'lucide-react';
import { featured, projects, type Area } from '../data';
import Shot from './Shot';

const filters: ('All' | Area)[] = ['All', 'AI & LLMs', 'Backend & full stack', 'Data'];

const areaColor: Record<Area, string> = {
  'AI & LLMs': 'text-signal',
  'Backend & full stack': 'text-cobalt',
  Data: 'text-[#9A5B00]',
};

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const shown = filter === 'All' ? projects : projects.filter((p) => p.area === filter);

  return (
    <section id="work" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Selected work</h2>
        <p className="mt-4 max-w-[40rem] text-[1.05rem] leading-relaxed text-muted">
          Every picture shows the project itself: a screenshot of the running app, or its real code and output. Each frame says what you are looking at.
        </p>

        {/* Featured project */}
        <article className="mt-12 grid items-start gap-10 rounded-2xl border border-line bg-paper p-5 sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <h3 className="font-display text-[1.9rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">
              {featured.name}
            </h3>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{featured.summary}</p>
            <p className="mt-7 font-semibold">How it works</p>
            <ol className="mt-4 space-y-3.5">
              {featured.steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] items-baseline gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-signalSoft text-[0.85rem] font-semibold text-signal">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-7 flex flex-wrap gap-1.5" aria-label="Built with">
              {featured.stack.map((s) => (
                <li key={s} className="tag bg-surface">
                  {s}
                </li>
              ))}
            </ul>
            <a href={featured.repo} className="btn-primary mt-8" target="_blank" rel="noreferrer">
              <Github size={17} aria-hidden /> View the code
            </a>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            <Shot src={featured.image} alt={`Screenshot of the ${featured.name} dashboard`} caption={featured.shot} />
          </div>
        </article>

        {/* Filter + gallery */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-[1.5rem] font-bold tracking-[-0.01em]">More projects</h3>
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

        <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.name} className="group flex flex-col">
              <a href={p.repo} target="_blank" rel="noreferrer" className="block rounded-xl" aria-label={`${p.name} on GitHub`}>
                <Shot
                  src={p.image}
                  alt={`Screenshot of ${p.name}`}
                  caption={p.shot}
                  className="transition-[border-color,box-shadow] duration-200 group-hover:border-ink/30 group-hover:shadow-[0_22px_46px_-24px_rgba(14,26,43,0.6)]"
                />
              </a>
              <p className={`mt-5 text-[0.85rem] font-medium ${areaColor[p.area]}`}>{p.area}</p>
              <h4 className="mt-1 font-display text-[1.3rem] font-bold leading-snug tracking-[-0.01em]">
                <a href={p.repo} target="_blank" rel="noreferrer" className="decoration-signal/40 underline-offset-4 hover:underline">
                  {p.name}
                </a>
              </h4>
              <p className="mt-2 leading-relaxed text-muted">{p.summary}</p>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/75">{p.stack.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
