import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, ArrowUpRight, FileText } from 'lucide-react';
import { profile, stats } from '../data';
import { Counter } from './bits';

export default function Hero() {
  return (
    <section id="top" className="bg-grid relative overflow-hidden">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-5 pb-16 pt-36 md:flex-row md:items-center md:justify-between md:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-xl text-center md:text-left"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Open to opportunities
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 bg-gradient-to-r from-accent to-accent2 bg-clip-text text-lg font-semibold text-transparent md:text-xl">
            {profile.title}
          </p>
          <p className="mt-4 text-muted">{profile.tagline}</p>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted md:justify-start">
            <MapPin size={15} /> {profile.location}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <a href="#projects" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-base hover:brightness-110">
              View work <ArrowUpRight size={16} />
            </a>
            <a href={profile.resumeUrl} download className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white/5">
              <FileText size={16} /> Résumé
            </a>
            <div className="flex items-center gap-2">
              <IconLink href={profile.socials.github} label="GitHub"><Github size={18} /></IconLink>
              <IconLink href={profile.socials.linkedin} label="LinkedIn"><Linkedin size={18} /></IconLink>
              <IconLink href={`mailto:${profile.email}`} label="Email"><Mail size={18} /></IconLink>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="relative shrink-0"
        >
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-accent/30 to-accent2/30 blur-2xl" />
          <ProfilePhoto />
        </motion.div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-5 pb-16 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card px-4 py-3 text-center md:text-left">
            <div className="font-display text-xl font-bold text-ink"><Counter value={s.value} suffix={s.suffix} /></div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfilePhoto() {
  const sources = [...profile.photoCandidates, profile.photoFallback];
  const [i, setI] = useState(0);
  return (
    <img
      src={sources[i]}
      onError={() => setI((n) => Math.min(n + 1, sources.length - 1))}
      alt={profile.name}
      referrerPolicy="no-referrer"
      className="relative h-44 w-44 animate-float rounded-full border-2 border-line object-cover shadow-glow md:h-56 md:w-56"
    />
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label}
       className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent">
      {children}
    </a>
  );
}
