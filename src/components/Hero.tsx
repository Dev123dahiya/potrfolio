import { useState } from 'react';
import { FileText, Mail, RotateCw } from 'lucide-react';
import { profile } from '../data';

// Sample documents for the demo. Every vendor and number here is made up.
interface Sample {
  tab: string;
  file: string;
  vendor: string;
  kind: string;
  rows: [string, string][];
  fields: [string, string, 'str' | 'num'][];
}

const samples: Sample[] = [
  {
    tab: 'Electricity bill',
    file: 'electricity_bill_mar.pdf',
    vendor: 'Northgrid Power',
    kind: 'Electricity bill',
    rows: [
      ['Billing period', '01 Mar – 31 Mar 2025'],
      ['Units consumed', '1,284 kWh'],
      ['Amount payable', '₹ 11,930.00'],
    ],
    fields: [
      ['vendor', 'Northgrid Power', 'str'],
      ['document', 'electricity_bill', 'str'],
      ['period', '2025-03', 'str'],
      ['energy_kwh', '1284', 'num'],
      ['amount_inr', '11930', 'num'],
      ['co2e_kg', '911.6', 'num'],
    ],
  },
  {
    tab: 'Fuel receipt',
    file: 'fuel_receipt_0412.jpg',
    vendor: 'Ridgeway Fuels',
    kind: 'Fuel receipt',
    rows: [
      ['Date', '12 Apr 2025'],
      ['Diesel', '180.0 L'],
      ['Total paid', '₹ 16,470.00'],
    ],
    fields: [
      ['vendor', 'Ridgeway Fuels', 'str'],
      ['document', 'fuel_receipt', 'str'],
      ['date', '2025-04-12', 'str'],
      ['fuel', 'diesel', 'str'],
      ['litres', '180', 'num'],
      ['co2e_kg', '482.4', 'num'],
    ],
  },
  {
    tab: 'Supplier invoice',
    file: 'invoice_INV-2291.pdf',
    vendor: 'Kestrel Packaging',
    kind: 'Tax invoice',
    rows: [
      ['Invoice no.', 'INV-2291'],
      ['Due date', '30 May 2025'],
      ['Invoice total', '₹ 48,200.00'],
    ],
    fields: [
      ['vendor', 'Kestrel Packaging', 'str'],
      ['document', 'invoice', 'str'],
      ['invoice_no', 'INV-2291', 'str'],
      ['due_date', '2025-05-30', 'str'],
      ['amount_inr', '48200', 'num'],
      ['currency', 'INR', 'str'],
    ],
  },
];

function ExtractionDemo() {
  const [which, setWhich] = useState(0);
  const [run, setRun] = useState(0); // bumping this replays the scan
  const s = samples[which];

  return (
    <figure className="w-full">
      <div className="rounded-[15px] bg-night/90 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/15 backdrop-blur sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Choose a sample document">
            {samples.map((x, i) => (
              <button
                key={x.tab}
                type="button"
                role="tab"
                aria-selected={i === which}
                onClick={() => {
                  setWhich(i);
                  setRun((r) => r + 1);
                }}
                className={`rounded-full px-3 py-1 text-[0.82rem] transition-colors ${
                  i === which ? 'bg-[#7FD1CB] font-medium text-night' : 'bg-[#1A2228] text-[#BAC4CD] hover:bg-[#243039] hover:text-white'
                }`}
              >
                {x.tab}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.82rem] text-[#BAC4CD] transition-colors hover:bg-[#1A2228] hover:text-white"
          >
            <RotateCw size={14} aria-hidden /> Run again
          </button>
        </div>

        <div key={`${which}-${run}`} role="tabpanel">
          <p className="mb-2 font-mono text-[0.8rem] text-[#93A1AD]">{s.file}</p>
          <div className="scan-card rounded-lg bg-[#FBFCFE] px-4 py-3.5 text-[0.82rem] leading-relaxed text-[#2b3445]">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-[#111a29]">{s.vendor}</span>
              <span className="text-[#6b778a]">{s.kind}</span>
            </div>
            <div className="mt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5">
              {s.rows.map(([k, v], i) => (
                <span key={k} className="contents">
                  <span className="text-[#6b778a]">{k}</span>
                  <span className={i === s.rows.length - 1 ? 'font-semibold' : ''}>{v}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="my-3 flex items-center gap-3 text-[0.8rem] text-[#93A1AD]">
            <span className="h-px flex-1 bg-nightLine" />
            OCR, then an LLM extracts the fields
            <span className="h-px flex-1 bg-nightLine" />
          </div>

          <pre className="overflow-x-auto rounded-lg border border-nightLine bg-[#11171C] px-4 py-3 font-mono text-[0.82rem] leading-[1.65] text-[#DCE3E9]">
            <code>
              <span className="json-line block" style={{ animationDelay: '1.2s' }}>{'{'}</span>
              {s.fields.map(([k, v, t], idx) => (
                <span key={k} className="json-line block" style={{ animationDelay: `${1.3 + idx * 0.14}s` }}>
                  {'  '}
                  <span className="text-[#6FC7F2]">"{k}"</span>
                  <span className="text-[#93A1AD]">: </span>
                  {t === 'str' ? <span className="text-[#7FD1CB]">"{v}"</span> : <span className="text-[#F2C27B]">{v}</span>}
                  {idx < s.fields.length - 1 ? <span className="text-[#93A1AD]">,</span> : null}
                </span>
              ))}
              <span className="json-line block" style={{ animationDelay: `${1.3 + s.fields.length * 0.14}s` }}>{'}'}</span>
            </code>
          </pre>
        </div>
      </div>
      <figcaption className="mt-3 text-[0.85rem] leading-snug text-white/65">
        Pick a document to see the kind of extraction my Horizon17 pipeline ran on 500 real invoices. These three documents and their numbers are made up.
      </figcaption>
    </figure>
  );
}

export default function Hero() {
  return (
    <>
      <section id="top" className="bg-band text-white">
        <div className="wrap grid items-center gap-12 pb-28 pt-32 lg:grid-cols-2 lg:gap-16 lg:pb-32 lg:pt-40">
          <div>
            <p className="inline-flex items-center gap-2.5 rounded-[5px] border border-white/25 bg-white/5 px-3 py-1.5 font-nav text-[0.9rem] text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#7FD1CB]" aria-hidden />
              {profile.role}, {profile.location}
            </p>
            <h1 className="mt-6 font-display text-[2.3rem] font-bold uppercase leading-[1.08] sm:text-[3.1rem]">{profile.name}</h1>
            <p className="mt-5 max-w-[34rem] font-display text-[1.25rem] font-semibold leading-snug text-white/90 sm:text-[1.45rem]">{profile.headline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-primary py-3">
                See my projects
              </a>
              <a href={profile.resumeUrl} className="btn-outline-light px-5" target="_blank" rel="noreferrer">
                <FileText size={17} aria-hidden /> Résumé (PDF)
              </a>
              <a href={`mailto:${profile.email}`} className="btn-outline-light px-5">
                <Mail size={17} aria-hidden /> Email me
              </a>
            </div>
          </div>
          <ExtractionDemo />
        </div>
      </section>

      {/* Intro box that overlaps the banner */}
      <section aria-labelledby="intro-title" className="wrap relative z-10 -mt-14">
        <div className="feature-box px-6 py-7 sm:px-9 sm:py-9">
          <h2 id="intro-title" className="font-display text-[1.6rem] font-medium uppercase leading-tight text-ink sm:text-[2rem]">
            What I do
          </h2>
          <p className="mt-3 max-w-[60rem] leading-relaxed text-muted">{profile.intro}</p>
        </div>
      </section>
    </>
  );
}
