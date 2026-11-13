import { useState } from 'react';
import { Check, Copy, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data';

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
    <section id="contact" className="border-t border-line bg-surface">
      <div className="wrap py-20 text-center lg:py-28">
        <h2 className="h-section">Get in touch</h2>
        <p className="lead mx-auto">I can join with a short notice period. The fastest way to reach me is email.</p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block break-all font-display text-[1.6rem] font-bold tracking-[-0.02em] text-ink underline decoration-signal decoration-2 underline-offset-[6px] hover:text-signal sm:text-[2.4rem]"
        >
          {profile.email}
        </a>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={copy} className="btn-primary min-w-[10.5rem] justify-center">
            {copied === 'done' ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
            {copied === 'done' ? 'Address copied' : 'Copy address'}
          </button>
          <a href={`mailto:${profile.email}`} className="btn-quiet">
            <Mail size={17} aria-hidden /> Write an email
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-quiet">
            <Linkedin size={17} aria-hidden /> LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn-quiet">
            <Github size={17} aria-hidden /> GitHub
          </a>
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="btn-quiet">
            <FileText size={17} aria-hidden /> Résumé (PDF)
          </a>
        </div>
        <p className="mt-4 min-h-[1.5rem] text-[0.92rem] text-muted" aria-live="polite">
          {copied === 'failed' ? 'Copying is blocked in this browser. Select the address above to copy it.' : ''}
        </p>
      </div>
      <footer className="border-t border-line">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-6 text-[0.9rem] text-muted">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Built with React, TypeScript and Tailwind CSS</p>
        </div>
      </footer>
    </section>
  );
}
