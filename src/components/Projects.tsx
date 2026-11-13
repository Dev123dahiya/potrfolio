import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Github, Play, Search, X } from 'lucide-react';
import { featured, highlights, projects, type Area, type Project } from '../data';
import { demos, hasDemo } from '../demos';
import { matches, useSite, type Filter } from '../lib/site';
import HoverCard from './HoverCard';
import Shot from './Shot';
import Reveal from './Reveal';

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
  const [tab, setTab] = useState<'overview' | 'demo'>('overview');
  const project = projects.find((p) => p.name === openName) ?? null;
  const demo = project ? demos[project.name] : undefined;
  // Step through what the visitor is looking at; fall back to everything if the project is filtered out.
  const order = project && list.includes(project) ? list : projects;
  const at = project ? order.indexOf(project) : -1;
  const step = (d: number) => open(order[(at + d + order.length) % order.length].name);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
    // A different project means a different demo, so start on the overview
    // rather than dropping the visitor into something they did not ask for.
    setTab('overview');
  }, [project]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="project-dialog-title"
      onClose={() => open(null)}
      onClick={(e) => e.target === dialog.current && open(null)}
      onKeyDown={(e) => {
        // Arrows step through projects, but not while the visitor is typing
        // into a demo.
        const target = e.target as HTMLElement;
        if (target.closest('input, textarea, select')) return;
        if (e.key === 'ArrowRight') step(1);
        if (e.key === 'ArrowLeft') step(-1);
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-[15px] border border-line bg-surface p-0 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] ${
        tab === 'demo' ? 'w-[min(74rem,calc(100vw-1.5rem))]' : 'w-[min(60rem,calc(100vw-1.5rem))]'
      }`}
    >
      {project && (
        <div key={project.name} className="panel-in">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface/95 px-5 py-3 backdrop-blur">
            <p className={`text-[0.9rem] font-medium ${areaColor[project.area]}`}>
              {project.area} <span className="font-normal text-muted">· {at + 1} of {order.length}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => step(-1)} aria-label="Previous project" className="grid h-9 w-9 place-items-center rounded-[5px] border border-line hover:border-signal hover:text-signal">
                <ArrowLeft size={17} aria-hidden />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next project" className="grid h-9 w-9 place-items-center rounded-[5px] border border-line hover:border-signal hover:text-signal">
                <ArrowRight size={17} aria-hidden />
              </button>
              <button type="button" onClick={() => open(null)} aria-label="Close" className="ml-1 grid h-9 w-9 place-items-center rounded-[5px] border border-line hover:border-signal hover:text-signal">
                <X size={17} aria-hidden />
              </button>
            </div>
          </div>
          {demo && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-5 pb-3 pt-4 sm:px-7">
              {(['overview', 'demo'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={tab === t}
                  onClick={() => setTab(t)}
                  className={`inline-flex items-center gap-1.5 rounded-[5px] border px-3 py-1.5 font-nav text-[0.9rem] transition-colors ${
                    tab === t
                      ? 'border-signal bg-signal text-white'
                      : 'border-line bg-surface text-muted hover:border-signal hover:text-signal'
                  }`}
                >
                  {t === 'demo' && <Play size={14} aria-hidden />}
                  {t === 'overview' ? 'Overview' : demo.title}
                </button>
              ))}
              <p className="ml-1 hidden text-[0.86rem] text-muted sm:block">{demo.blurb}</p>
            </div>
          )}

          {demo && tab === 'demo' ? (
            <div className="p-5 sm:p-7">
              <Suspense
                fallback={
                  <p className="py-16 text-center text-[0.95rem] text-muted">Loading the demo…</p>
                }
              >
                <demo.Component />
              </Suspense>
            </div>
          ) : (
          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-3">
              <Shot src={project.image} alt={`Screenshot of ${project.name}`} caption={project.shot} eager />
            </div>
            <div className="lg:col-span-2">
              <h3 id="project-dialog-title" className="font-display text-[1.5rem] font-bold leading-tight">
                {project.name}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>
              {highlights[project.name] && (
                <p className="mt-4 border-l-2 border-signal pl-3 text-[0.95rem] leading-relaxed text-ink">
                  {highlights[project.name]}
                </p>
              )}
              {demo && (
                <button type="button" onClick={() => setTab('demo')} className="btn-quiet mt-5 !py-2">
                  <Play size={15} aria-hidden /> {demo.title}
                </button>
              )}
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
          )}
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
    <section id="work" className="bg-tri py-20 lg:py-24">
      <div className="wrap">
        <h2 className="sec-title">Selected work</h2>
        <p className="lead">
          Every picture shows the project itself: a screenshot of the running app, or its real code and output. Select any project for the details.
        </p>

        {/* Featured project */}
        <Reveal>
        <article className="card mt-12 grid grid-cols-1 items-center gap-10 p-5 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <div className="order-2 min-w-0 lg:order-1">
            <p className="font-nav text-[0.9rem] font-medium uppercase tracking-wide text-signal">Featured project</p>
            <h3 className="mt-1 font-display text-[1.7rem] font-bold leading-tight sm:text-[2rem]">{featured.name}</h3>
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
                  <button type="button" className="tag" title={`Show projects that use ${s}`} onClick={() => searchFor(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <a href={featured.repo} className="btn-primary mt-7" target="_blank" rel="noreferrer">
              <Github size={17} aria-hidden /> View the code
            </a>
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <Shot src={featured.image} alt={`Screenshot of the ${featured.name} dashboard`} caption={featured.shot} />
          </div>
        </article>
        </Reveal>

        {/* Search + filter + gallery */}
        <div id="gallery" className="mt-16 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-[1.4rem] font-bold uppercase">All projects</h3>
            <label className="relative block w-full sm:w-80">
              <span className="sr-only">Search projects by name or technology</span>
              <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or technology"
                className="h-11 w-full rounded-[5px] border-2 border-line bg-surface pl-10 pr-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-muted focus:border-signal"
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
                className={`rounded-[5px] border-2 px-3.5 py-1.5 font-nav text-[0.9rem] transition-colors ${
                  filter === f ? 'border-signal bg-signal text-white' : 'border-line bg-surface text-muted hover:border-signal hover:text-signal'
                }`}
              >
                {f} <span className={filter === f ? 'opacity-80' : 'opacity-80'}>{count(f)}</span>
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
          <div className="mt-8 card px-6 py-14 text-center">
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
                <HoverCard
                  card={
                    <div>
                      <p className={`font-nav text-[0.8rem] font-medium ${areaColor[p.area]}`}>{p.area}</p>
                      <p className="mt-0.5 font-display text-[1.05rem] font-bold leading-snug">{p.name}</p>
                      <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{p.summary}</p>
                      {highlights[p.name] && (
                        <p className="mt-2.5 border-l-2 border-signal pl-2.5 text-[0.86rem] leading-relaxed text-ink">
                          {highlights[p.name]}
                        </p>
                      )}
                      <ul className="mt-3 flex flex-wrap gap-1">
                        {p.stack.map((s) => (
                          <li
                            key={s}
                            className="rounded-[4px] border border-line px-1.5 py-0.5 font-mono text-[0.74rem] text-muted"
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-[0.82rem] text-muted">
                        {hasDemo(p.name) ? (
                          <>
                            <span className="font-medium text-signal">{demos[p.name].title}</span> —{' '}
                            {demos[p.name].blurb}
                          </>
                        ) : (
                          'Select the card for the full details.'
                        )}
                      </p>
                    </div>
                  }
                >
                <article className="card group relative flex h-full flex-col p-3 transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-cardHover motion-reduce:transform-none">
                  <div className="relative">
                    <button type="button" onClick={() => open(p.name)} className="block w-full rounded-xl text-left" tabIndex={-1} aria-hidden>
                      <Shot src={p.image} alt="" caption={p.shot} className="shadow-none" />
                    </button>
                    {/* Sits on the image rather than over the caption bar. */}
                    {hasDemo(p.name) && (
                      <span className="pointer-events-none absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-signal px-2 py-0.5 font-nav text-[0.72rem] font-medium text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                        <Play size={11} aria-hidden /> Demo
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <p className={`font-nav text-[0.82rem] font-medium ${areaColor[p.area]}`}>{p.area}</p>
                    <h4 className="mt-1 font-display text-[1.12rem] font-bold leading-snug">
                      <button type="button" onClick={() => open(p.name)} className="text-left decoration-signal/40 underline-offset-4 hover:underline">
                        {p.name}
                      </button>
                    </h4>
                    <p className="line-clamp-3 mt-2 text-[0.97rem] leading-relaxed text-muted">{p.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
                      {p.stack.slice(0, 3).map((s) => (
                        <li key={s}>
                          <button type="button" className="tag" title={`Show projects that use ${s}`} onClick={() => searchFor(s)}>
                            {s}
                          </button>
                        </li>
                      ))}
                      {p.stack.length > 3 && <li className="tag border-transparent bg-transparent">+{p.stack.length - 3}</li>}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      <button type="button" onClick={() => open(p.name)} className="link text-[0.95rem]" aria-label={`Details of ${p.name}`}>
                        {hasDemo(p.name) ? 'Details and demo' : 'Details'}
                      </button>
                      <a href={p.repo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[0.92rem] text-muted transition-colors hover:text-ink" aria-label={`${p.name} on GitHub`}>
                        <Github size={16} aria-hidden /> Code
                      </a>
                    </div>
                  </div>
                </article>
                </HoverCard>
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
