import { Award } from 'lucide-react';
import { education } from '../data';
import Reveal from './Reveal';

export default function Education() {
  return (
    <section id="education" className="py-20 lg:py-24">
      <Reveal className="wrap">
        <h2 className="sec-title">Education</h2>
        <div className="feature-box mt-12 overflow-hidden lg:grid lg:grid-cols-12">
          <figure className="relative lg:col-span-6">
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
          <div className="p-6 sm:p-9 lg:col-span-6">
            <a href={education.url} target="_blank" rel="noreferrer" className="logo-tile inline-grid h-20 px-5" aria-label={`${education.school} website`}>
              <img src={education.logo} alt="" className="h-12 w-auto" loading="lazy" />
            </a>
            <h3 className="mt-7 font-display text-[1.4rem] font-bold leading-snug">{education.degree}</h3>
            <p className="mt-1 text-muted">
              {education.school}, {education.years}
            </p>
            <p className="mt-5 inline-flex items-baseline gap-2 rounded-[5px] bg-signalSoft px-3 py-1.5">
              <span className="font-display text-[1.35rem] font-bold text-signal">{education.grade.replace('CGPA ', '')}</span>
              <span className="text-[0.9rem] text-signal">CGPA</span>
            </p>
            <h4 className="mt-8 font-semibold">Certifications</h4>
            <ul className="mt-3 space-y-2.5">
              {education.certifications.map((c) => (
                <li key={c} className="flex items-start gap-2.5 leading-snug text-ink/85">
                  <Award size={17} className="mt-0.5 shrink-0 text-signal" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
