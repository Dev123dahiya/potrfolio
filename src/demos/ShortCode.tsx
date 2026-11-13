import { useMemo, useState } from 'react';
import { DemoNote, Output, Slider, Stat, Table } from './ui';

/**
 * The ID scheme from `url-shortener-service`: a Snowflake ID encoded in
 * base62. No central counter, no collision check, and the short code sorts by
 * creation time because the ID does.
 */

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const EPOCH = 1_700_000_000_000n; // a fixed start, to keep IDs short

/** 41 bits of milliseconds, 10 bits of machine, 12 bits of sequence. */
function snowflake(timestampMs: bigint, machine: bigint, sequence: bigint): bigint {
  return ((timestampMs - EPOCH) << 22n) | (machine << 12n) | sequence;
}

function base62(value: bigint): string {
  if (value === 0n) return '0';
  let out = '';
  let n = value;
  while (n > 0n) {
    out = ALPHABET[Number(n % 62n)] + out;
    n /= 62n;
  }
  return out;
}

function unbase62(code: string): bigint {
  let n = 0n;
  for (const c of code) {
    const i = ALPHABET.indexOf(c);
    if (i < 0) throw new Error(`"${c}" is not a base62 character`);
    n = n * 62n + BigInt(i);
  }
  return n;
}

export default function ShortCode() {
  const [machines, setMachines] = useState(4);
  const [perMs, setPerMs] = useState(3);
  const [code, setCode] = useState('');

  const generated = useMemo(() => {
    const base = 1_763_000_000_000n;
    const rows: { id: string; code: string; machine: number; sequence: number }[] = [];
    for (let ms = 0; ms < 4; ms += 1) {
      for (let m = 0; m < machines; m += 1) {
        for (let s = 0; s < perMs; s += 1) {
          const id = snowflake(base + BigInt(ms), BigInt(m), BigInt(s));
          rows.push({ id: id.toString(), code: base62(id), machine: m, sequence: s });
        }
      }
    }
    return rows;
  }, [machines, perMs]);

  const unique = new Set(generated.map((r) => r.code)).size;
  const sorted = generated.every((r, i) => i === 0 || r.code.length > generated[i - 1].code.length || r.code >= generated[i - 1].code);

  const decoded = useMemo(() => {
    const text = code.trim();
    if (!text) return null;
    try {
      const n = unbase62(text);
      const ms = Number((n >> 22n) + EPOCH);
      return {
        id: n.toString(),
        machine: Number((n >> 12n) & 0x3ffn),
        sequence: Number(n & 0xfffn),
        when: new Date(ms).toISOString().replace('T', ' ').slice(0, 23),
      };
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [code]);

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        IDs are minted and encoded in this page. Every code below comes from the same bit layout
        the service uses: 41 bits of time, 10 of machine, 12 of sequence.
      </DemoNote>

      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Machines minting at once" value={machines} min={1} max={16} onChange={setMachines} />
        <Slider label="IDs per machine per millisecond" value={perMs} min={1} max={12} onChange={setPerMs} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Stat label="IDs minted" value={String(generated.length)} />
        <Stat
          label="Distinct codes"
          value={`${unique} / ${generated.length}`}
          tone={unique === generated.length ? 'good' : 'bad'}
        />
        <Stat label="Sort by creation time" value={sorted ? 'yes' : 'no'} tone={sorted ? 'good' : 'bad'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <p className="font-nav text-[0.85rem] text-muted">
            {machines} machines minting simultaneously, no coordination between them
          </p>
          <div className="max-h-64 overflow-y-auto">
            <Table rows={generated.slice(0, 24)} />
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <label className="block">
            <span className="font-nav text-[0.82rem] font-medium text-muted">
              Decode a short code
            </span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={generated[5]?.code ?? 'paste a code'}
              className="mt-1 h-10 w-full rounded-[5px] border-2 border-line bg-surface px-3 font-mono text-[0.88rem] text-ink outline-none transition-colors focus:border-signal"
            />
          </label>

          {decoded && 'error' in decoded ? (
            <Output>{decoded.error}</Output>
          ) : decoded ? (
            <Output label="decoded">
              {`id        ${decoded.id}\nminted at ${decoded.when}\nmachine   ${decoded.machine}\nsequence  ${decoded.sequence}`}
            </Output>
          ) : (
            <p className="text-[0.88rem] text-muted">
              Paste one of the codes on the left to pull the timestamp, machine and sequence back
              out of it.
            </p>
          )}

          <p className="text-[0.88rem] leading-relaxed text-muted">
            Nothing here asks a database for the next number, and nothing checks whether a code is
            taken. Uniqueness falls out of the layout: two IDs can only collide if the same machine
            mints the same sequence number in the same millisecond, which it cannot. That is why
            the service measures 6,470 shortens per second — the ID is three shifts and an OR, not
            a round trip.
          </p>
        </div>
      </div>
    </div>
  );
}
