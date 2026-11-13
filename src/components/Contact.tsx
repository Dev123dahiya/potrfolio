import { useState } from 'react';
import { Check, Copy, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data';
import { scrollToId } from '../lib/site';
import Reveal from './Reveal';

const sections: [string, string][] = [
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['research', 'Research'],
  ['education', 'Education'],
  ['skills', 'Skills'],
];

export default function Contact() {
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied('done');
    } catch {
      setCopied('failed');
    }
    setTimeout(() => setCopied('idle'), 2500);
  };

  return (
    <>
      <section id="contact" className="bg-band py-20 text-center text-white lg:py-24">
        <Reveal className="wrap">
          <h2 className="font-display text-[1.5rem] font-bold leading-snug sm:text-[1.9rem]">
            Have a <span className="text-[#35BDF2]">role</span> in mind? Let’s <span className="text-[#4CD08A]">talk</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-[36rem] text-white/75">I can join with a short notice period. The fastest way to reach me is email.</p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-7 inline-block break-all font-display text-[1.3rem] font-semibold text-white underline decoration-[#7FD1CB] decoration-2 underline-offset-[6px] hover:text-[#7FD1CB] sm:text-[1.9rem]"
          >
            {profile.email}
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={copy} className="btn-outline-light min-w-[12rem] justify-center">
              {copied === 'done' ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
              {copied === 'done' ? 'Address copied' : 'Copy address'}
            </button>
            <a href={`mailto:${profile.email}`} className="btn-primary px-8 py-3">
              <Mail size={17} aria-hidden /> Write an email
            </a>
          </div>
          <p className="mt-4 min-h-[1.5rem] text-[0.92rem] text-white/75" aria-live="polite">
            {copied === 'failed' ? 'Copying is blocked in this browser. Select the address above to copy it.' : ''}
          </p>
        </Reveal>
      </section>

      <footer className="bg-tint text-[0.92rem]">
        <div className="wrap grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[1.15rem] font-bold uppercase tracking-wide">
              Dev <span className="text-signal">Kumar</span> Dahiya
            </p>
            <p className="mt-3 max-w-[24rem] leading-relaxed text-muted">
              {profile.role}. I build backend systems and LLM pipelines.
            </p>
            <div className="mt-5 flex gap-2.5">
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-full border border-muted/50 text-muted transition-colors hover:border-signal hover:text-signal">
                <Linkedin size={17} aria-hidden />
              </a>
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-full border border-muted/50 text-muted transition-colors hover:border-signal hover:text-signal">
                <Github size={17} aria-hidden />
              </a>
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" aria-label="Résumé (PDF)" className="grid h-10 w-10 place-items-center rounded-full border border-muted/50 text-muted transition-colors hover:border-signal hover:text-signal">
                <FileText size={17} aria-hidden />
              </a>
            </div>
          </div>
          <nav aria-label="Footer" className="lg:col-span-3">
            <p className="font-display font-bold">On this page</p>
            <ul className="mt-3 space-y-2">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(id);
                    }}
                    className="text-muted transition-colors hover:text-signal"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="lg:col-span-4">
            <p className="font-display font-bold">Contact</p>
            <p className="mt-3 text-muted">{profile.location}</p>
            <p className="mt-2 break-all">
              <span className="font-semibold">Email:</span>{' '}
              <a href={`mailto:${profile.email}`} className="text-muted hover:text-signal">
                {profile.email}
              </a>
            </p>
            <p className="mt-2">
              <span className="font-semibold">GitHub:</span>{' '}
              <a href={profile.github} target="_blank" rel="noreferrer" className="text-muted hover:text-signal">
                {profile.github.replace('https://', '')}
              </a>
            </p>
          </div>
        </div>
        <div className="wrap pb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[5px] bg-line/40 px-4 py-4 text-muted">
            <p>
              © {new Date().getFullYear()} <span className="font-semibold text-ink">{profile.name}</span>
            </p>
            <p>Built with React, TypeScript and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </>
  );
}
