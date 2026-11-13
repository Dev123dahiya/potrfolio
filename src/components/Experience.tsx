import { experience } from '../data';

export default function Experience() {
  return (
    <section id="experience" className="py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Experience</h2>
        <ol className="mt-12 space-y-12">
          {experience.map((e) => (
            <li key={e.org} className="grid gap-3 md:grid-cols-12 md:gap-8">
              <p className="pt-1 text-[0.95rem] text-muted md:col-span-3">
                {e.start} – {e.end}
              </p>
              <div className="md:col-span-9">
                <h3 className="font-display text-[1.4rem] font-bold leading-snug tracking-[-0.015em]">
                  {e.role},{' '}
                  <a href={e.url} target="_blank" rel="noreferrer" className="link font-bold">
                    {e.org}
                  </a>
                </h3>
                <p className="text-[0.95rem] text-muted">{e.place}</p>
                <ul className="mt-4 max-w-[46rem] space-y-2.5">
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
