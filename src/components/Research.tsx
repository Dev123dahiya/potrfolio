import { useMemo, useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { publication } from '../data';

type Voice = 'real' | 'generated';

const notes: Record<Voice, string> = {
  real: 'A human voice: the bright bands drift and waver from moment to moment.',
  generated: 'A generated voice: the bands tend to be steadier, with faint regular patterns higher up.',
};

// A drawing of a spectrogram, the kind of input the paper's model reads.
// It is an illustration of the idea, not data from the paper.
function Spectrogram({ voice }: { voice: Voice }) {
  const cols = 64;
  const rows = 18;
  const cells = useMemo(() => {
    const out: JSX.Element[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const t = c / cols;
        const f = r / rows;
        const energy =
          voice === 'real'
            ? 0.55 * Math.exp(-((f - 0.25 - 0.08 * Math.sin(t * 9)) ** 2) / 0.012) +
              0.35 * Math.exp(-((f - 0.55 - 0.05 * Math.cos(t * 13)) ** 2) / 0.008) +
              0.18 * (0.5 + 0.5 * Math.sin(c * 1.7 + r * 2.3)) * (1 - f)
            : 0.6 * Math.exp(-((f - 0.25 - 0.012 * Math.sin(t * 9)) ** 2) / 0.006) +
              0.4 * Math.exp(-((f - 0.55 - 0.008 * Math.cos(t * 13)) ** 2) / 0.005) +
              0.16 * (c % 4 === 0 ? 1 : 0.25) * (f > 0.72 ? 1 : 0.15);
        const a = Math.min(0.95, Math.max(0.05, energy));
        out.push(
          <rect key={`${c}-${r}`} x={c * 10} y={(rows - 1 - r) * 10} width={9} height={9} rx={1.5} fill="#7FD1B9" style={{ opacity: a, transition: 'opacity 0.45s ease' }} />
        );
      }
    }
    return out;
  }, [voice]);
  return (
    <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} className="h-auto w-full" role="img" aria-label={`Illustration of a spectrogram for a ${voice === 'real' ? 'human' : 'generated'} voice`}>
      {cells}
    </svg>
  );
}

export default function Research() {
  const [voice, setVoice] = useState<Voice>('real');
  return (
    <section id="research" className="border-y border-nightLine bg-night py-20 text-[#E6EDF8] lg:py-28">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="h-section text-white">Research</h2>
          <img src={publication.publisherLogo} alt="Springer Nature" className="mt-8 h-5 w-auto opacity-90" loading="lazy" />
          <h3 className="mt-7 font-display text-[1.6rem] font-bold leading-snug tracking-[-0.015em] text-white">{publication.title}</h3>
          <p className="mt-3 text-[0.95rem] text-[#9FB2CF]">{publication.venue}</p>
          <p className="mt-6 max-w-[36rem] leading-relaxed text-[#C9D6EA]">{publication.summary}</p>
          <dl className="mt-8 grid max-w-[24rem] grid-cols-2 gap-6">
            <div>
              <dt className="text-[0.9rem] text-[#9FB2CF]">Accuracy</dt>
              <dd className="font-display text-[2rem] font-bold text-white">99.33%</dd>
            </div>
            <div>
              <dt className="text-[0.9rem] text-[#9FB2CF]">Audio clips</dt>
              <dd className="font-display text-[2rem] font-bold text-white">10,000</dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={publication.url} target="_blank" rel="noreferrer" className="btn bg-white text-night hover:bg-[#E6EDF8]">
              <ExternalLink size={17} aria-hidden /> Read on SpringerLink
            </a>
            <a href={publication.repo} target="_blank" rel="noreferrer" className="btn border border-nightLine text-white hover:border-[#3A4D6E]">
              <Github size={17} aria-hidden /> Code
            </a>
          </div>
        </div>

        <figure>
          <div className="rounded-2xl border border-nightLine bg-[#0E1B30] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.9rem] text-[#9FB2CF]">What the model looks at</p>
              <div className="flex rounded-full bg-[#16243C] p-1" role="group" aria-label="Choose a voice type">
                {(['real', 'generated'] as Voice[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={voice === v}
                    onClick={() => setVoice(v)}
                    className={`rounded-full px-3.5 py-1 text-[0.85rem] transition-colors ${
                      voice === v ? 'bg-[#7FD1B9] font-medium text-night' : 'text-[#B9C7DD] hover:text-white'
                    }`}
                  >
                    {v === 'real' ? 'Human voice' : 'AI-generated'}
                  </button>
                ))}
              </div>
            </div>
            <Spectrogram voice={voice} />
            <div className="mt-3 flex justify-between text-[0.78rem] text-[#7388A8]">
              <span>Time →</span>
              <span>Pitch ↑</span>
            </div>
          </div>
          <figcaption className="mt-3 text-[0.88rem] leading-snug text-[#9FB2CF]" aria-live="polite">
            {notes[voice]} This is a drawing to show the idea, not data from the paper.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
