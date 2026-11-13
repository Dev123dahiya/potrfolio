import { experience } from '../data';

export default function Experience() {
  return (
    <section id="experience" className="py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Experience</h2>
        <ol className="relative mt-12 space-y-10 before:absolute before:bottom-6 before:left-[1.1rem] before:top-6 before:w-px before:bg-line md:before:hidden">
          {experience.map((e, i) => (
            <li key={e.org} className="relative grid gap-5 pl-12 md:grid-cols-12 md:gap-8 md:pl-0">
              <span
                className={`absolute left-[0.7rem] top-6 h-3 w-3 rounded-full ring-4 ring-paper md:hidden ${i === 0 ? 'bg-signal' : 'bg-[#9FB0C4]'}`}
                aria-hidden
              />
              <div className="md:col-span-3">
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`grid h-[5.5rem] w-full max-w-[15rem] place-items-center rounded-xl border px-6 transition-colors ${
                    e.logoOnDark ? 'border-[#1d1d26] bg-[#0d0d12] hover:border-[#3a3a48]' : 'border-line bg-surface hover:border-ink/30'
                  }`}
                >
                  <img src={e.logo} alt={e.org} className="max-h-11 w-auto max-w-full object-contain" loading="lazy" />
                </a>
                <p className="mt-3 text-[0.95rem] text-muted">
                  {e.start} – {e.end}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 md:col-span-9">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-[1.4rem] font-bold leading-snug tracking-[-0.015em]">
                    {e.role},{' '}
                    <a href={e.url} target="_blank" rel="noreferrer" className="link font-bold">
                      {e.org}
                    </a>
                  </h3>
                  <p className="text-[0.95rem] text-muted">{e.place}</p>
                </div>
                {i === 0 && (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-signalSoft px-2.5 py-0.5 text-[0.82rem] font-medium text-signal">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden /> Current role
                  </p>
                )}
                <ul className="mt-4 space-y-2.5">
                  {e.points.map((pt) => (
                    <li key={pt} className="relative pl-5 leading-relaxed">
                      <span className="absolute left-0 top-[0.7em] h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
