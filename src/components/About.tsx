import { education, skills } from '../data';

export default function About() {
  return (
    <section id="skills" className="py-20 lg:py-28">
      <div className="wrap grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="h-section">Skills</h2>
          <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {skills.map((g) => (
              <div key={g.group}>
                <h3 className="font-semibold">{g.group}</h3>
                <p className="mt-2 leading-relaxed text-muted">{g.items.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <h2 className="h-section">Education</h2>
          <div className="mt-10">
            <h3 className="font-semibold">{education.degree}</h3>
            <p className="text-muted">
              {education.school}, {education.years}
            </p>
            <p className="text-muted">{education.grade}</p>
            <h3 className="mt-8 font-semibold">Certifications</h3>
            <ul className="mt-2 space-y-1.5 text-muted">
              {education.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
