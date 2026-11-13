import { skills, skillSearch } from '../data';
import { countMatches, useSite } from '../lib/site';

// A skill that appears in at least one project becomes a button that shows those projects.
export default function About() {
  const { searchFor } = useSite();
  return (
    <section id="skills" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Skills</h2>
        <p className="lead">Select a skill with a number to see the projects that use it.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g) => (
            <div key={g.group} className="rounded-2xl border border-line bg-paper p-5">
              <h3 className="font-semibold">{g.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.items.map((it) => {
                  const term = skillSearch[it] ?? it;
                  const n = countMatches(term);
                  return (
                    <li key={it}>
                      {n > 0 ? (
                        <button type="button" className="tag gap-1.5 bg-surface" onClick={() => searchFor(term)} title={`Show ${n} ${n === 1 ? 'project' : 'projects'}`}>
                          {it} <span className="font-medium text-signal">{n}</span>
                        </button>
                      ) : (
                        <span className="tag bg-surface">{it}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
