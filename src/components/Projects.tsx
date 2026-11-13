import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Github, Search, X } from 'lucide-react';
import { featured, projects, type Area, type Project } from '../data';
import { matches, useSite, type Filter } from '../lib/site';
import Shot from './Shot';

const filters: Filter[] = ['All', 'AI & LLMs', 'Backend & full stack', 'Data', 'Cloud & security'];

// How many cards show before the visitor asks for the rest.
const FIRST_PAGE = 9;

const areaColor: Record<Area, string> = {
  'AI & LLMs': 'text-signal',
  'Backend & full stack': 'text-cobalt',
  Data: 'text-amber',
  'Cloud & security': 'text-violet',
};

// Full details for one project, with previous / next through the current results.
function ProjectDialog({ list }: { list: Project[] }) {
  const { openName, open, searchFor } = useSite();
  const dialog = useRef<HTMLDialogElement>(null);
  const project = projects.find((p) => p.name === openName) ?? null;
  // Step through what the visitor is looking at; fall back to everything if the project is filtered out.
  const order = project && list.includes(project) ? list : projects;
  const at = project ? order.indexOf(project) : -1;
  const step = (d: number) => open(order[(at + d + order.length) % order.length].name);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-dialog-title"
      onClose={() => open(null)}
      onClick={(e) => e.target === dialog.current && open(null)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(60rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-line bg-surface p-0 shadow-[0_40px_90px_-30px_rgba(6,12,22,0.7)]"
    >
      {project && (
        <div key={project.name} className="panel-in">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur">
            <p className={`text-[0.9rem] font-medium ${areaColor[project.area]}`}>
              {project.area} <span className="font-normal text-muted">· {at + 1} of {order.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => step(-1)} aria-label="Previous project" className="grid h-9 w-9 place-items-center rounded-lg border border-line hover:border-ink/40">
                <ArrowLeft size={17} aria-hidden />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next project" className="grid h-9 w-9 place-items-center rounded-lg border border-line hover:border-ink/40">
                <ArrowRight size={17} aria-hidden />
              </button>
              <button type="button" onClick={() => open(null)} aria-label="Close" className="ml-1 grid h-9 w-9 place-items-center rounded-lg border border-line hover:border-ink/40">
                <X size={17} aria-hidden />
              </button>
            </div>
          </div>
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-3">
              <Shot src={project.image} alt={`Screenshot of ${project.name}`} caption={project.shot} eager />
            </div>
            <div className="lg:col-span-2">
              <h3 id="project-dialog-title" className="font-display text-[1.7rem] font-bold leading-tight tracking-[-0.02em]">
                {project.name}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>
              <p className="mt-6 text-[0.9rem] font-semibold">Built with</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="tag"
                      title={`Show projects that use ${s}`}
                      onClick={() => {
                        open(null);
                        setTimeout(() => searchFor(s), 0);
                      }}
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
              <a href={project.repo} target="_blank" rel="noreferrer" className="btn-primary mt-7">
                <Github size={17} aria-hidden /> View the code
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function Projects() {
  const { query, setQuery, filter, setFilter, open, searchFor } = useSite();
  const [expanded, setExpanded] = useState(false);

  const searched = useMemo(() => projects.filter((p) => matches(p, query)), [query]);
  const count = (f: Filter) => (f === 'All' ? searched.length : searched.filter((p) => p.area === f).length);
  const matching = filter === 'All' ? searched : searched.filter((p) => p.area === filter);
  const searching = query.trim() !== '';
  const shown = expanded || searching ? matching : matching.slice(0, FIRST_PAGE);
  const hidden = matching.length - shown.length;
  const reset = () => {
    setQuery('');
    setFilter('All');
  };

  return (
    <section id="work" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Selected work</h2>
        <p className="lead">
          Every picture shows the project itself: a screenshot of the running app, or its real code and output. Select any project for the details.
        </p>

        {/* Featured project */}
        <article className="mt-12 grid items-center gap-10 rounded-2xl border border-line bg-paper p-5 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="order-2 lg:order-1">
            <p className="text-[0.9rem] font-medium text-signal">Featured project</p>
            <h3 className="mt-1 font-display text-[1.9rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.2rem]">{featured.name}</h3>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{featured.summary}</p>
            <ol className="mt-6 space-y-3">
              {featured.steps.map((step, i) => (
                <li key={step} className="grid grid-cols-[2rem_1fr] items-baseline gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-signalSoft text-[0.85rem] font-semibold text-signal">{i + 1}</span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
            <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Built with">
              {featured.stack.map((s) => (
                <li key={s}>
                  <button type="button" className="tag bg-surface" title={`Show projects that use ${s}`} onClick={() => searchFor(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <a href={featured.repo} className="btn-primary mt-7" target="_blank" rel="noreferrer">
              <Github size={17} aria-hidden /> View the code
            </a>
          </div>
          <div className="order-1 lg:order-2">
            <Shot src={featured.image} alt={`Screenshot of the ${featured.name} dashboard`} caption={featured.shot} />
          </div>
        </article>

        {/* Search + filter + gallery */}
        <div id="gallery" className="mt-16 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-[1.5rem] font-bold tracking-[-0.01em]">All projects</h3>
            <label className="relative block w-full sm:w-80">
              <span className="sr-only">Search projects by name or technology</span>
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or technology"
                className="h-11 w-full rounded-lg border border-line bg-paper pl-10 pr-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-muted focus:border-signal"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by area">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => {
                  setFilter(f);
                  setExpanded(false);
                }}
                className={`rounded-full border px-3.5 py-1.5 text-[0.9rem] transition-colors ${
                  filter === f ? 'border-ink bg-ink text-onInk' : 'border-line bg-surface text-muted hover:border-ink/40 hover:text-ink'
                }`}
              >
                {f} <span className={filter === f ? 'opacity-70' : 'opacity-80'}>{count(f)}</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-[0.92rem] text-muted" aria-live="polite">
            {matching.length === 0
              ? 'No projects match.'
              : `Showing ${shown.length} of ${matching.length} ${matching.length === 1 ? 'project' : 'projects'}${searching ? ` for “${query.trim()}”` : ''}.`}{' '}
            {(searching || filter !== 'All') && (
              <button type="button" onClick={reset} className="link">
                Clear
              </button>
            )}
          </p>
        </div>

        {matching.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper px-6 py-14 text-center">
            <p className="font-display text-[1.3rem] font-bold">Nothing matches “{query.trim()}”{filter !== 'All' ? ` in ${filter}` : ''}</p>
            <p className="mx-auto mt-2 max-w-[28rem] text-muted">Try a technology such as Python, React, Kubernetes or SQL, or clear the search to see everything.</p>
            <button type="button" onClick={reset} className="btn-quiet mt-6">
              Show all projects
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <li key={p.name} className="min-w-0">
                <article className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-3 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-[0_22px_46px_-26px_rgba(14,26,43,0.55)] motion-reduce:transform-none">
                  <button type="button" onClick={() => open(p.name)} className="block w-full rounded-xl text-left" tabIndex={-1} aria-hidden>
                    <Shot src={p.image} alt="" caption={p.shot} className="shadow-none" />
                  </button>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <p className={`text-[0.85rem] font-medium ${areaColor[p.area]}`}>{p.area}</p>
                    <h4 className="mt-1 font-display text-[1.25rem] font-bold leading-snug tracking-[-0.01em]">
                      <button type="button" onClick={() => open(p.name)} className="text-left decoration-signal/40 underline-offset-4 hover:underline">
                        {p.name}
                      </button>
                    </h4>
                    <p className="line-clamp-3 mt-2 text-[0.97rem] leading-relaxed text-muted">{p.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
                      {p.stack.slice(0, 3).map((s) => (
                        <li key={s}>
                          <button type="button" className="tag bg-surface" title={`Show projects that use ${s}`} onClick={() => searchFor(s)}>
                            {s}
                          </button>
                        </li>
                      ))}
                      {p.stack.length > 3 && <li className="tag border-transparent bg-transparent">+{p.stack.length - 3}</li>}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <button type="button" onClick={() => open(p.name)} className="link text-[0.95rem]" aria-label={`Details of ${p.name}`}>
                        Details
                      </button>
                      <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.92rem] text-muted transition-colors hover:text-ink" aria-label={`${p.name} on GitHub`}>
                        <Github size={16} aria-hidden /> Code
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {!searching && matching.length > FIRST_PAGE && (
          <div className="mt-10 flex justify-center">
            <button type="button" aria-expanded={expanded} onClick={() => setExpanded((e) => !e)} className="btn-quiet">
              {expanded ? 'Show fewer projects' : `Show ${hidden} more ${hidden === 1 ? 'project' : 'projects'}`}
            </button>
          </div>
        )}
      </div>
      <ProjectDialog list={matching} />
    </section>
  );
}
