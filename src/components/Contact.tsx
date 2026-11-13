import { FileText, Github, Linkedin } from 'lucide-react';
import { profile } from '../data';

export default function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-surface">
      <div className="wrap py-20 lg:py-28">
        <h2 className="h-section">Get in touch</h2>
        <p className="mt-4 max-w-[36rem] text-[1.1rem] leading-relaxed text-muted">
          I can join with a short notice period. The fastest way to reach me is email.
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block break-all font-display text-[1.7rem] font-bold tracking-[-0.02em] text-ink underline decoration-signal decoration-2 underline-offset-[6px] hover:text-signal sm:text-[2.6rem]"
        >
          {profile.email}
        </a>
        <div className="mt-10 flex flex-wrap gap-3">
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
