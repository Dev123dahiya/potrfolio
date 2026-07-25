import { useEffect, useState } from 'react';
import { Github, ExternalLink, Star, GitFork, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Section, Reveal } from './ui';
import { Cover, Tilt } from './bits';
import { featured, GITHUB_USERNAME, profile, repoImage } from '../data';

interface Repo {
  id: number; name: string; html_url: string; homepage: string | null;
  description: string | null; language: string | null;
  stargazers_count: number; forks_count: number; fork: boolean; topics?: string[];
}

const FEATURED_REPOS = new Set(featured.map((f) => f.repo).filter(Boolean) as string[]);

const INITIAL_REPOS = 6;

export default function Projects() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Repo[]) =>
        setRepos(
          data
            .filter((r) => !r.fork && !FEATURED_REPOS.has(r.name))
            .sort((a, b) => b.stargazers_count - a.stargazers_count || b.id - a.id),
        ),
      )
      .catch(() => setError(true));
  }, []);

  return (
    <Section id="projects" kicker="Straight from my GitHub" title="Projects">
      {/* curated flagship projects with generated covers (upgrade to GitHub preview when the repo exists) */}
      <div className="grid gap-5 md:grid-cols-2">
        {featured.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.06}>
            <Tilt>
              <article className="card group flex h-full flex-col overflow-hidden p-4 transition hover:border-accent/60 hover:shadow-glow">
                <Cover name={p.name} image={p.image} fallback={p.cover} preview={p.repo ? repoImage(p.repo) : undefined} />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3>
                  <span className="chip gap-1 whitespace-nowrap text-accent"><Sparkles size={12} /> Featured</span>
                </div>
                <p className="mt-1.5 flex-1 text-sm text-muted">{p.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                      <Github size={16} /> Code
                    </a>
                  )}
                  {p.live && (
                    <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted hover:text-accent">
                      <ExternalLink size={16} /> Live
                    </a>
                  )}
                </div>
              </article>
            </Tilt>
          </Reveal>
        ))}
      </div>

      {/* everything else, pulled live from GitHub with real preview images */}
      <div id="github" className="mt-16">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Live from GitHub</div>
              <h3 className="section-title">More repositories</h3>
            </div>
            <a href={profile.socials.github} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-accent hover:text-accent">
              <Github size={16} /> @{GITHUB_USERNAME}
            </a>
          </div>
        </Reveal>

        {error && (
          <p className="text-sm text-muted">Couldn’t load live repositories right now. Visit{' '}
            <a href={profile.socials.github} className="text-accent" target="_blank" rel="noreferrer">GitHub</a> directly.</p>
        )}

        {!error && !repos && (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-56 animate-pulse bg-white/5" />)}
          </div>
        )}

        {repos && repos.length > 0 && (
          <>
            <div className="grid gap-5 md:grid-cols-3">
              {(showAll ? repos : repos.slice(0, INITIAL_REPOS)).map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.05}>
                  <a href={r.html_url} target="_blank" rel="noreferrer"
                     className="card group flex h-full flex-col overflow-hidden transition hover:border-accent/60 hover:shadow-glow">
                    <img src={repoImage(r.name)} alt={r.name} loading="lazy"
                         className="h-36 w-full border-b border-line object-cover" />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="mb-1 flex items-center gap-2 text-ink">
                        <Github size={16} className="text-accent" />
                        <span className="truncate font-semibold">{r.name}</span>
                      </div>
                      <p className="mb-3 flex-1 text-xs text-muted line-clamp-2">{r.description || 'No description provided.'}</p>
                      <div className="flex items-center gap-4 text-xs text-muted">
                        {r.language && <span>{r.language}</span>}
                        <span className="inline-flex items-center gap-1"><Star size={12} /> {r.stargazers_count}</span>
                        <span className="inline-flex items-center gap-1"><GitFork size={12} /> {r.forks_count}</span>
                      </div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            {repos.length > INITIAL_REPOS && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-accent hover:text-accent">
                  {showAll ? (
                    <>Show less <ChevronUp size={16} /></>
                  ) : (
                    <>View more ({repos.length - INITIAL_REPOS}) <ChevronDown size={16} /></>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {repos && repos.length === 0 && (
          <p className="text-sm text-muted">Your featured projects above are the highlights - more repositories will appear here as you push them to GitHub.</p>
        )}
      </div>
    </Section>
  );
}
