import { Braces, BrainCircuit, Database, Server } from 'lucide-react';
import { skills, skillSearch } from '../data';
import { countMatches, useSite } from '../lib/site';
import Reveal from './Reveal';

const icons = [Braces, BrainCircuit, Server, Database];

// A skill that appears in at least one project becomes a button that shows those projects.
export default function About() {
  const { searchFor } = useSite();
  return (
    <section id="skills" className="bg-tri py-20 lg:py-24">
      <Reveal className="wrap">
        <h2 className="sec-title">Skills</h2>
        <p className="lead">Select a skill with a number to see the projects that use it.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={g.group} className="card px-6 py-9 text-center transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-cardHover">
                <h3 className="font-display text-[1.1rem] font-semibold">{g.group}</h3>
                <div className="icon-badge mt-5">
                  <Icon size={24} aria-hidden />
                </div>
                <ul className="mt-7 flex flex-wrap justify-center gap-1.5">
                  {g.items.map((it) => {
                    const term = skillSearch[it] ?? it;
                    const n = countMatches(term);
                    return (
                      <li key={it}>
                        {n > 0 ? (
                          <button type="button" className="tag gap-1.5" onClick={() => searchFor(term)} title={`Show ${n} ${n === 1 ? 'project' : 'projects'}`}>
                            {it} <span className="font-semibold text-signal">{n}</span>
                          </button>
                        ) : (
                          <span className="tag">{it}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
