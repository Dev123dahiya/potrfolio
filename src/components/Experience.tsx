import { ExternalLink } from 'lucide-react';
import { Section, Reveal } from './ui';
import { Logo } from './bits';
import { experience } from '../data';

export default function Experience() {
  return (
    <Section id="experience" kicker="Where I've worked" title="Experience">
      <div className="space-y-4">
        {experience.map((job, i) => (
          <Reveal key={job.role} delay={i * 0.05}>
            <div className="card flex gap-4 p-5 transition hover:border-accent/50">
              <a href={job.url} target="_blank" rel="noreferrer" className="shrink-0">
                <Logo domain={job.domain} name={job.org} className="h-12 w-12 text-sm" />
              </a>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="font-display text-lg font-semibold text-ink">{job.role}</h3>
                  <span className="font-mono text-xs text-muted">{job.period}</span>
                </div>
                <div className="mb-3 flex items-center gap-1.5 text-sm text-accent">
                  <a href={job.url} target="_blank" rel="noreferrer" className="hover:underline">{job.org}</a>
                  <ExternalLink size={12} className="text-muted" />
                  <span className="text-muted">· {job.location}</span>
                </div>
                <ul className="space-y-1.5">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
