import { useState } from 'react';
import { FileText, Mail } from 'lucide-react';
import { profile } from '../data';

function Avatar() {
  const [i, setI] = useState(0);
  const src = profile.photoCandidates[i];
  if (!src) {
    return (
      <div className="grid h-14 w-14 place-items-center rounded-full bg-ink font-display text-lg font-bold text-white">
        DK
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={profile.name}
      width={56}
      height={56}
      className="h-14 w-14 rounded-full object-cover ring-2 ring-surface"
      referrerPolicy="no-referrer"
      onError={() => setI((n) => n + 1)}
    />
  );
}

// Sample extraction shown in the hero. The bill and numbers are illustrative.
const fields: [string, string, 'str' | 'num'][] = [
  ['vendor', 'Northgrid Power', 'str'],
  ['document', 'electricity_bill', 'str'],
  ['period', '2025-03', 'str'],
  ['energy_kwh', '1284', 'num'],
  ['amount_inr', '11930', 'num'],
  ['co2e_kg', '911.6', 'num'],
];

function ExtractionDemo() {
  return (
    <figure className="w-full">
      <div className="rounded-2xl bg-night p-4 shadow-[0_24px_60px_-28px_rgba(11,21,38,0.55)] sm:p-5">
        <div className="mb-3 flex items-center justify-between text-[0.8rem] text-[#8FA3C2]">
          <span className="font-mono">electricity_bill_mar.pdf</span>
          <span>Sample input</span>
        </div>

        <div className="scan-card rounded-lg bg-[#FBFCFE] px-4 py-3.5 text-[0.82rem] leading-relaxed text-[#2b3445]">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-[#111a29]">Northgrid Power</span>
            <span className="text-[#6b778a]">Electricity bill</span>
          </div>
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5">
            <span className="text-[#6b778a]">Billing period</span>
            <span>01 Mar – 31 Mar 2025</span>
            <span className="text-[#6b778a]">Units consumed</span>
            <span>1,284 kWh</span>
            <span className="text-[#6b778a]">Amount payable</span>
            <span className="font-semibold">₹ 11,930.00</span>
          </div>
        </div>

        <div className="my-3 flex items-center gap-3 text-[0.8rem] text-[#8FA3C2]">
          <span className="h-px flex-1 bg-nightLine" />
          OCR, then an LLM extracts the fields
          <span className="h-px flex-1 bg-nightLine" />
        </div>

        <pre className="overflow-x-auto rounded-lg border border-nightLine bg-[#0E1B30] px-4 py-3 font-mono text-[0.82rem] leading-[1.65] text-[#D7E3F5]">
          <code>
            <span className="json-line block" style={{ animationDelay: '1.35s' }}>{'{'}</span>
            {fields.map(([k, v, t], idx) => (
              <span key={k} className="json-line block" style={{ animationDelay: `${1.45 + idx * 0.16}s` }}>
                {'  '}
                <span className="text-[#8DB4FF]">"{k}"</span>
                <span className="text-[#8FA3C2]">: </span>
                {t === 'str' ? (
                  <span className="text-[#7FD1B9]">"{v}"</span>
                ) : (
                  <span className="text-[#F2C27B]">{v}</span>
                )}
                {idx < fields.length - 1 ? <span className="text-[#8FA3C2]">,</span> : null}
              </span>
            ))}
            <span className="json-line block" style={{ animationDelay: `${1.45 + fields.length * 0.16}s` }}>{'}'}</span>
          </code>
        </pre>
      </div>
      <figcaption className="mt-3 text-[0.85rem] leading-snug text-muted">
        The kind of extraction my Horizon17 pipeline ran on 500 real invoices. This bill and its numbers are made up.
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <section id="top" className="wrap grid gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-14 lg:pb-28 lg:pt-20">
      <div className="lg:col-span-7">
        <div className="flex items-center gap-4">
          <Avatar />
          <div className="leading-tight">
            <p className="font-semibold">{profile.name}</p>
            <p className="text-[0.95rem] text-muted">
              {profile.role}, {profile.location}
            </p>
          </div>
        </div>

        <h1
          className="mt-9 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.028em] text-ink sm:text-[3.6rem] lg:text-[4.1rem]"
          style={{ fontVariationSettings: "'wdth' 94, 'opsz' 96" }}
        >
          {profile.headline}
        </h1>

        <p className="mt-7 max-w-[38rem] text-[1.1rem] leading-relaxed text-muted">{profile.intro}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a href="#work" className="btn-primary">
            See my projects
          </a>
          <a href={profile.resumeUrl} className="btn-quiet" target="_blank" rel="noreferrer">
            <FileText size={17} aria-hidden /> Résumé (PDF)
          </a>
          <a href={`mailto:${profile.email}`} className="btn-quiet">
            <Mail size={17} aria-hidden /> Email me
          </a>
        </div>

        <p className="mt-8 flex items-start gap-2.5 text-[0.95rem] text-ink">
          <span className="mt-[0.45rem] h-2 w-2 shrink-0 rounded-full bg-signal" aria-hidden />
          {profile.openTo}
        </p>
      </div>

      <div className="lg:col-span-5 lg:pt-4">
        <ExtractionDemo />
      </div>
    </section>
  );
}
