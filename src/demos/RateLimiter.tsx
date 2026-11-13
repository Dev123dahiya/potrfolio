import { useMemo, useState } from 'react';
import { DemoNote, Slider, Stat } from './ui';

/**
 * The four rate-limiting algorithms from `rate-limiter-lab`, each implemented
 * here the way the Python version implements it, run against the same
 * adversarial traffic so the differences are visible rather than described.
 */

interface Limiter {
  allow(now: number): boolean;
}

/** One counter per fixed window. Cheapest, and the easiest to beat. */
class FixedWindow implements Limiter {
  private windowStart = 0;
  private count = 0;
  constructor(
    private limit: number,
    private window: number,
  ) {}
  allow(now: number) {
    const start = Math.floor(now / this.window) * this.window;
    if (start !== this.windowStart) {
      this.windowStart = start;
      this.count = 0;
    }
    if (this.count < this.limit) {
      this.count += 1;
      return true;
    }
    return false;
  }
}

/** Every timestamp kept. Exact, at O(limit) memory per key. */
class SlidingWindowLog implements Limiter {
  private hits: number[] = [];
  constructor(
    private limit: number,
    private window: number,
  ) {}
  allow(now: number) {
    const cutoff = now - this.window;
    while (this.hits.length > 0 && this.hits[0] <= cutoff) this.hits.shift();
    if (this.hits.length < this.limit) {
      this.hits.push(now);
      return true;
    }
    return false;
  }
}

/** Two counters, blending the previous window by how much of it still overlaps. */
class SlidingWindowCounter implements Limiter {
  private windowStart = 0;
  private current = 0;
  private previous = 0;
  constructor(
    private limit: number,
    private window: number,
  ) {}
  allow(now: number) {
    const start = Math.floor(now / this.window) * this.window;
    if (start !== this.windowStart) {
      // Only the window immediately before carries over; older ones have
      // scrolled out entirely.
      this.previous = start - this.windowStart === this.window ? this.current : 0;
      this.current = 0;
      this.windowStart = start;
    }
    const overlap = 1 - (now - this.windowStart) / this.window;
    const estimate = this.previous * overlap + this.current;
    if (estimate < this.limit) {
      this.current += 1;
      return true;
    }
    return false;
  }
}

/** Two numbers. Allows a burst up to capacity, then holds the average rate. */
class TokenBucket implements Limiter {
  private tokens: number;
  private last = 0;
  constructor(
    private capacity: number,
    private refillPerMs: number,
  ) {
    this.tokens = capacity;
  }
  allow(now: number) {
    this.tokens = Math.min(this.capacity, this.tokens + (now - this.last) * this.refillPerMs);
    this.last = now;
    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

const ALGORITHMS = [
  { key: 'fixed', name: 'Fixed window', memory: '1 counter' },
  { key: 'log', name: 'Sliding window log', memory: '1 timestamp per request' },
  { key: 'counter', name: 'Sliding window counter', memory: '2 counters' },
  { key: 'bucket', name: 'Token bucket', memory: '2 numbers' },
] as const;

type Key = (typeof ALGORITHMS)[number]['key'];

interface Attempt {
  at: number;
  admitted: Record<Key, boolean>;
}

/**
 * The adversarial client: it waits until the end of a window, fires a burst,
 * then fires another the moment the next window opens. A fixed window counts
 * those as two separate windows and lets both through.
 */
function simulate(limit: number, windowSec: number, burst: number, minutes: number) {
  const windowMs = windowSec * 1000;
  const limiters: Record<Key, Limiter> = {
    fixed: new FixedWindow(limit, windowMs),
    log: new SlidingWindowLog(limit, windowMs),
    counter: new SlidingWindowCounter(limit, windowMs),
    // Same average rate as the others: limit requests per window.
    bucket: new TokenBucket(limit, limit / windowMs),
  };

  const attempts: Attempt[] = [];
  const totals: Record<Key, number> = { fixed: 0, log: 0, counter: 0, bucket: 0 };
  // The worst two seconds for a fixed window sit either side of a boundary.
  let worst: { at: number; counts: Record<Key, number> } | null = null;

  for (let w = 0; w < minutes; w += 1) {
    const boundary = (w + 1) * windowMs;
    const edge: { at: number; admitted: Record<Key, boolean> }[] = [];
    for (let i = 0; i < burst * 2; i += 1) {
      // Half in the last 2 s before the boundary, half in the first 2 s after.
      const at = i < burst
        ? boundary - 2000 + Math.floor((i / burst) * 2000)
        : boundary + Math.floor(((i - burst) / burst) * 2000);
      const admitted = {} as Record<Key, boolean>;
      for (const { key } of ALGORITHMS) {
        admitted[key] = limiters[key].allow(at);
        if (admitted[key]) totals[key] += 1;
      }
      const attempt = { at, admitted };
      attempts.push(attempt);
      edge.push(attempt);
    }
    // How many each algorithm let through across that 4-second boundary.
    const counts = { fixed: 0, log: 0, counter: 0, bucket: 0 } as Record<Key, number>;
    for (const a of edge) for (const { key } of ALGORITHMS) if (a.admitted[key]) counts[key] += 1;
    if (!worst || counts.fixed > worst.counts.fixed) worst = { at: boundary, counts };
  }

  return { attempts, totals, worst: worst!, sent: attempts.length };
}

export default function RateLimiter() {
  const [limit, setLimit] = useState(100);
  const [windowSec, setWindowSec] = useState(60);
  const [burst, setBurst] = useState(150);
  const minutes = 5;

  const result = useMemo(
    () => simulate(limit, windowSec, burst, minutes),
    [limit, windowSec, burst],
  );

  const allowed = limit * minutes;

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        All four limiters are running in this page against the same request stream. The client is
        adversarial: it fires {burst} requests in the last two seconds of each window and {burst}{' '}
        more in the first two seconds of the next.
      </DemoNote>

      <div className="grid gap-4 sm:grid-cols-3">
        <Slider label="Limit per window" value={limit} min={20} max={200} step={10} onChange={setLimit} />
        <Slider label="Window" value={windowSec} min={10} max={120} step={10} suffix=" s" onChange={setWindowSec} />
        <Slider label="Burst size" value={burst} min={20} max={300} step={10} onChange={setBurst} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Stat label="Requests sent" value={String(result.sent)} />
        <Stat label="Budget over 5 windows" value={String(allowed)} />
        <Stat
          label="Fixed window let through"
          value={`${result.totals.fixed}`}
          tone={result.totals.fixed > allowed ? 'bad' : undefined}
        />
      </div>

      <div className="space-y-2.5">
        {ALGORITHMS.map(({ key, name, memory }) => {
          const total = result.totals[key];
          const over = total > allowed;
          const edge = result.worst.counts[key];
          return (
            <div key={key} className="rounded-[8px] border border-line bg-base p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="font-nav text-[0.95rem] font-medium">{name}</p>
                <p className="font-mono text-[0.82rem] text-muted">{memory}</p>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full transition-[width] duration-300 ${over ? 'bg-amber' : 'bg-signal'}`}
                  style={{ width: `${Math.min(100, (total / Math.max(allowed * 2, 1)) * 100)}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-[0.82rem] text-muted">
                <span className={over ? 'text-amber' : 'text-signal'}>{total} admitted</span> of{' '}
                {result.sent} · {edge} across the worst window boundary
                {over && <span className="text-amber"> · {(total / allowed).toFixed(2)}x the budget</span>}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-[0.88rem] leading-relaxed text-muted">
        The fixed window is the one that breaks: each burst falls in a different window, so it
        counts them separately and admits up to twice the limit across the boundary. The sliding
        window log is exact but stores a timestamp per request. The sliding window counter gets
        within a few requests of exact at the cost of two integers, which is why it is the usual
        production choice.
      </p>
    </div>
  );
}
