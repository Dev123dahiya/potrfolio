import { affiliations } from '../data';
import { scrollToId } from '../lib/site';

// Each logo jumps to the part of the page about that organisation.
export default function Logos() {
  return (
    <section aria-labelledby="logos-title" className="border-t border-line bg-surface">
      <div className="wrap py-10">
        <h2 id="logos-title" className="text-center text-[0.95rem] text-muted">
          Where I’ve worked, studied and published
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {affiliations.map((a) => (
            <li key={a.name} className="last:col-span-2 sm:last:col-span-1">
              <a
                href={`#${a.section}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(a.section);
                }}
                className="logo-tile h-[4.5rem] w-full"
                aria-label={`${a.name}: go to ${a.sectionLabel}`}
                title={`Go to ${a.sectionLabel}`}
              >
                <img src={a.logo} alt="" style={{ height: a.height }} className="w-auto max-w-full object-contain" loading="lazy" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
