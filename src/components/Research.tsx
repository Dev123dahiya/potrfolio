import { ExternalLink, Github } from 'lucide-react';
import { publication } from '../data';

// Decorative spectrogram strip: the kind of input the paper's model reads.
function Spectrogram() {
  const cols = 64;
  const rows = 18;
  const cells: JSX.Element[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const t = c / cols;
      const f = r / rows;
      const energy =
        0.55 * Math.exp(-((f - 0.25 - 0.08 * Math.sin(t * 9)) ** 2) / 0.012) +
        0.35 * Math.exp(-((f - 0.55 - 0.05 * Math.cos(t * 13)) ** 2) / 0.008) +
        0.18 * (0.5 + 0.5 * Math.sin(c * 1.7 + r * 2.3)) * (1 - f);
      const a = Math.min(0.95, Math.max(0.05, energy));
      cells.push(
        <rect key={`${c}-${r}`} x={c * 10} y={(rows - 1 - r) * 10} width={9} height={9} rx={1.5} fill={`rgba(127,209,185,${a.toFixed(2)})`} />
      );
    }
  }
  return (
    <svg viewBox={`0 0 ${cols * 10} ${rows * 10}`} className="h-auto w-full" aria-hidden role="presentation">
      {cells}
    </svg>
  );
}

export default function Research() {
  return (
    <section id="research" className="bg-night py-20 text-[#E6EDF8] lg:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="h-section text-white">Research</h2>
          <h3 className="mt-8 font-display text-[1.6rem] font-bold leading-snug tracking-[-0.015em] text-white">
            {publication.title}
          </h3>
          <p className="mt-3 text-[0.95rem] text-[#9FB2CF]">{publication.venue}</p>
          <p className="mt-6 max-w-[36rem] leading-relaxed text-[#C9D6EA]">{publication.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={publication.url}
              target="_blank"
              rel="noreferrer"
              className="btn bg-white text-night hover:bg-[#E6EDF8]"
            >
              <ExternalLink size={17} aria-hidden /> Read on SpringerLink
            </a>
            <a
              href={publication.repo}
              target="_blank"
              rel="noreferrer"
              className="btn border border-nightLine text-white hover:border-[#3A4D6E]"
            >
              <Github size={17} aria-hidden /> Code
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-6">
          <div className="rounded-2xl border border-nightLine bg-[#0E1B30] p-5">
            <Spectrogram />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <dt className="text-[0.9rem] text-[#9FB2CF]">Accuracy</dt>
              <dd className="font-display text-[2rem] font-bold text-white">99.33%</dd>
            </div>
            <div>
              <dt className="text-[0.9rem] text-[#9FB2CF]">Audio clips</dt>
              <dd className="font-display text-[2rem] font-bold text-white">10,000</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
