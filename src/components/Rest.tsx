import { useState } from 'react';
import { FileText, Mail, Github, Linkedin, MapPin, Send } from 'lucide-react';
import { Logo } from './bits';
import { Section, Reveal } from './ui';
import { skills, publication, education, about, profile } from '../data';

export function About() {
  return (
    <Section id="about" kicker="Who I am" title="About">
      <Reveal>
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{about}</p>
      </Reveal>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" kicker="What I use" title="Skills & Tools">
      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((s, i) => (
          <Reveal key={s.group} delay={(i % 2) * 0.05}>
            <div className="card p-5">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">{s.group}</h3>
              <div className="flex flex-wrap gap-2">
                {s.items.map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 rounded-full border border-line bg-white/3 px-3 py-1 text-xs font-medium text-ink">{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Research() {
  return (
    <Section id="research" kicker="Published work" title="Research">
      <Reveal>
        <div className="card p-6">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold text-ink">{publication.title}</h3>
            <span className="font-mono text-xs text-muted">{publication.date}</span>
          </div>
          <div className="mb-4 text-sm text-accent">{publication.venue}</div>
          <ul className="space-y-1.5">
            {publication.points.map((p) => (
              <li key={p} className="flex gap-2 text-sm text-muted">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="card mt-6 flex items-center gap-4 p-6">
          {education.image ? (
            <img src={education.image} alt={education.school} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
          ) : (
            <Logo domain={education.domain} name={education.school} className="h-12 w-12 shrink-0 text-sm" />
          )}
          <div className="flex flex-wrap items-baseline justify-between gap-2 grow">
            <div>
              <h3 className="font-display font-semibold text-ink">{education.school}</h3>
              <p className="text-sm text-muted">{education.degree} · {education.detail}</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-muted">{education.period}</div>
              <div className="text-xs text-muted">{education.location}</div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // If a form endpoint is configured (e.g. Formspree), POST to it; otherwise
    // fall back to the visitor's email client via a prefilled mailto link.
    if (profile.formEndpoint) {
      setStatus('sending');
      try {
        const res = await fetch(profile.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); }
        else setStatus('error');
      } catch { setStatus('error'); }
    } else {
      const subject = encodeURIComponent(`Portfolio message from ${form.name || 'someone'}`);
      const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus('sent');
    }
  }

  const field = 'w-full rounded-lg border border-line bg-white/5 px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none';

  return (
    <Section id="contact" kicker="Say hello" title="Get in touch">
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="card flex h-full flex-col justify-between p-7">
            <div>
              <h3 className="font-display text-2xl font-bold text-ink">Let’s build something.</h3>
              <p className="mt-2 text-muted">
                I’m open to full-stack and applied-ML roles and collaborations. Drop a message here, or reach me directly.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-sm text-muted hover:text-accent">
                <Mail size={18} className="text-accent" /> {profile.email}
              </a>
              <span className="flex items-center gap-3 text-sm text-muted">
                <MapPin size={18} className="text-accent" /> {profile.location}
              </span>
              <div className="flex items-center gap-3 pt-1">
                <a href={profile.socials.github} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted hover:border-accent hover:text-accent"><Github size={18} /></a>
                <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted hover:border-accent hover:text-accent"><Linkedin size={18} /></a>
                <a href={profile.resumeUrl} download className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:bg-white/5"><FileText size={16} /> Résumé</a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={submit} className="card space-y-3 p-7">
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Your name" value={form.name}
                     onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              <input required type="email" placeholder="Your email" value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
            </div>
            <textarea required placeholder="Your message" rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })} className={field} />
            <button type="submit" disabled={status === 'sending'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-base hover:brightness-110 disabled:opacity-60">
              {status === 'sending' ? 'Sending…' : (<><Send size={16} /> Send message</>)}
            </button>
            {status === 'sent' && <p className="text-sm text-emerald-400">Thanks! Your message is on its way.</p>}
            {status === 'error' && <p className="text-sm text-red-400">Something went wrong. Please email me directly.</p>}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line py-8 text-center text-sm text-muted">
      © {new Date().getFullYear()} {profile.name}. Built with React, TypeScript & Tailwind.
    </footer>
  );
}
