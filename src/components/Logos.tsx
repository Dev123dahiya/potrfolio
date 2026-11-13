import { affiliations } from '../data';

export default function Logos() {
  return (
    <section aria-labelledby="logos-title" className="border-t border-line bg-surface">
      <div className="wrap flex flex-col gap-6 py-9 lg:flex-row lg:items-center lg:gap-12">
        <h2 id="logos-title" className="shrink-0 text-[0.95rem] leading-snug text-muted lg:w-44">
          Where I’ve worked, studied and published
        </h2>
        <ul className="grid flex-1 grid-cols-2 items-center gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {affiliations.map((a) => (
            <li key={a.name} className="flex items-center justify-center lg:justify-start">
              <img
                src={a.logo}
                alt={a.name}
                style={{ height: a.height }}
                className="w-auto max-w-full object-contain"
                loading="lazy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
