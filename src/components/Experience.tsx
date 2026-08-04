import { ExternalLink } from 'lucide-react';
import { Section, Reveal } from './ui';
import { Logo } from './bits';
import { experience } from '../data';

export default function Experience() {
  return (
    <Section id="experience" kicker="Where I've worked" title="Experience">
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-line md:left-1/2" />
        <div className="space-y-8">
          {experience.map((job, i) => (
            <Reveal key={job.role} delay={i * 0.06}>
              <div className="relative flex flex-col gap-3 md:flex-row md:items-start">
                <div className="absolute left-0 top-2 hidden md:block">
                  <div className="z-10 h-4 w-4 rounded-full border-2 border-accent bg-base" />
                </div>
                <div className="md:ml-12 flex-1">
                  <div className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="hidden md:block">
                          {job.image ? (
                            <picture>
                              <source srcSet={job.image.replace(/\.[^/.]+$/, '.webp')} type="image/webp" />
                              <img src={job.image} alt={job.org} className="h-10 w-10 rounded-md object-cover" />
                            </picture>
                          ) : (
                            <Logo domain={job.domain} name={job.org} className="h-10 w-10" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-ink">{job.role}</h3>
                          <div className="text-sm text-muted">{job.org} · {job.location}</div>
                        </div>
                      </div>
                      <div className="font-mono text-xs text-muted">{job.period}</div>
                    </div>
                    <div className="mt-3">
                      <ul className="space-y-1.5">
                        {job.points.map((p) => (
                          <li key={p} className="flex gap-2 text-sm text-muted">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
