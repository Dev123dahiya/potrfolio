import { Award } from 'lucide-react';
import { education } from '../data';

export default function Education() {
  return (
    <section id="education" className="py-20 lg:py-28">
      <div className="wrap">
        <h2 className="h-section">Education</h2>
        <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface lg:grid lg:grid-cols-12">
          <figure className="relative lg:col-span-7">
            <img
              src={education.photo}
              alt="Amity University campus building in Noida"
              width={1268}
              height={952}
              loading="lazy"
              className="h-64 w-full object-cover sm:h-80 lg:h-full"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-3 pt-10 text-[0.75rem] text-white/85">
              {education.photoCredit}
            </figcaption>
          </figure>
          <div className="p-6 sm:p-9 lg:col-span-5">
            <a href={education.url} target="_blank" rel="noreferrer" className="inline-block">
              <img src={education.logo} alt={education.school} className="h-14 w-auto" loading="lazy" />
            </a>
            <h3 className="mt-7 font-display text-[1.5rem] font-bold leading-snug tracking-[-0.015em]">{education.degree}</h3>
            <p className="mt-1 text-muted">
              {education.school}, {education.years}
            </p>
            <p className="mt-5 inline-flex items-baseline gap-2 rounded-lg bg-signalSoft px-3 py-1.5">
              <span className="font-display text-[1.35rem] font-bold text-signal">{education.grade.replace('CGPA ', '')}</span>
              <span className="text-[0.9rem] text-signal">CGPA</span>
            </p>
            <h4 className="mt-8 font-semibold">Certifications</h4>
            <ul className="mt-3 space-y-2.5">
              {education.certifications.map((c) => (
                <li key={c} className="flex items-start gap-2.5 leading-snug text-ink/85">
                  <Award size={17} className="mt-0.5 shrink-0 text-cobalt" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
