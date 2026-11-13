import { useEffect, useRef, useState } from 'react';
import { DemoNote, Output, Slider, Stat } from './ui';

/**
 * The circuit breaker and response cache from `llm-gateway`.
 *
 * The breaker's state machine is the real implementation. The provider it
 * calls is a switch you control: this page has no model behind it, and the
 * point of the demo is the gateway's behaviour when a provider misbehaves,
 * not the provider.
 */

type State = 'closed' | 'open' | 'half-open';

interface LogLine {
  n: number;
  text: string;
  tone: 'ok' | 'fail' | 'blocked' | 'state' | 'cache';
}

const COOLDOWN_TICKS = 6;

export default function CircuitBreaker() {
  const [threshold, setThreshold] = useState(3);
  const [healthy, setHealthy] = useState(true);
  const [running, setRunning] = useState(true);

  const [state, setState] = useState<State>('closed');
  const [failures, setFailures] = useState(0);
  const [log, setLog] = useState<LogLine[]>([]);
  const [stats, setStats] = useState({ sent: 0, ok: 0, failed: 0, blocked: 0, cached: 0 });

  // Everything the tick needs, kept in a ref so the interval is created once
  // and never restarts mid-cooldown.
  const machine = useRef({
    state: 'closed' as State,
    failures: 0,
    cooldown: 0,
    n: 0,
    cache: new Map<string, number>(),
    healthy: true,
    threshold: 3,
  });
  machine.current.healthy = healthy;
  machine.current.threshold = threshold;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const m = machine.current;
      m.n += 1;
      const push = (text: string, tone: LogLine['tone']) =>
        setLog((prev) => [{ n: m.n, text, tone }, ...prev].slice(0, 12));

      // Deterministic requests, so a cache hit is visible rather than lucky.
      const prompt = `prompt-${m.n % 4}`;

      if (m.state === 'open') {
        m.cooldown -= 1;
        if (m.cooldown <= 0) {
          // Exactly one trial request is let through, not a thundering herd.
          m.state = 'half-open';
          setState('half-open');
          push('cool-down over → half-open, one trial request allowed', 'state');
        } else {
          setStats((s) => ({ ...s, sent: s.sent + 1, blocked: s.blocked + 1 }));
          push(`${prompt} blocked — breaker open, ${m.cooldown} ticks left`, 'blocked');
          return;
        }
      }

      if (m.cache.has(prompt) && m.state === 'closed') {
        setStats((s) => ({ ...s, sent: s.sent + 1, cached: s.cached + 1 }));
        push(`${prompt} served from cache, no provider call`, 'cache');
        return;
      }

      setStats((s) => ({ ...s, sent: s.sent + 1 }));

      if (m.healthy) {
        m.cache.set(prompt, m.n);
        setStats((s) => ({ ...s, ok: s.ok + 1 }));
        if (m.state === 'half-open') {
          m.state = 'closed';
          m.failures = 0;
          setState('closed');
          setFailures(0);
          push('trial request succeeded → closed, traffic resumes', 'state');
        } else {
          m.failures = 0;
          setFailures(0);
          push(`${prompt} → provider ok`, 'ok');
        }
      } else {
        setStats((s) => ({ ...s, failed: s.failed + 1 }));
        if (m.state === 'half-open') {
          // One failure in half-open is enough: the provider is still down.
          m.state = 'open';
          m.cooldown = COOLDOWN_TICKS;
          setState('open');
          push('trial request failed → open again for the full cool-down', 'state');
          return;
        }
        m.failures += 1;
        setFailures(m.failures);
        push(`${prompt} → provider failed (${m.failures}/${m.threshold})`, 'fail');
        if (m.failures >= m.threshold) {
          m.state = 'open';
          m.cooldown = COOLDOWN_TICKS;
          setState('open');
          push(`${m.threshold} failures → breaker open, requests stop waiting on it`, 'state');
        }
      }
    }, 700);
    return () => window.clearInterval(id);
  }, [running]);

  const reset = () => {
    machine.current = {
      state: 'closed',
      failures: 0,
      cooldown: 0,
      n: 0,
      cache: new Map(),
      healthy,
      threshold,
    };
    setState('closed');
    setFailures(0);
    setLog([]);
    setStats({ sent: 0, ok: 0, failed: 0, blocked: 0, cached: 0 });
  };

  const tone: Record<LogLine['tone'], string> = {
    ok: 'text-[#7ee2b8]',
    fail: 'text-[#f2b36b]',
    blocked: 'text-[#8a98a5]',
    state: 'text-[#8ec6ff]',
    cache: 'text-[#c3a6ff]',
  };

  const stateColor =
    state === 'closed' ? 'text-signal' : state === 'open' ? 'text-amber' : 'text-violet';

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        The breaker's state machine and the response cache are the real logic, running on a timer
        in this page. The provider behind them is the switch below — there is no model being
        called, and none of this measures a model.
      </DemoNote>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <Slider label="Failures before opening" value={threshold} min={2} max={8} onChange={setThreshold} />
        <div className="flex items-end gap-1.5">
          <button
            type="button"
            onClick={() => setHealthy((h) => !h)}
            aria-pressed={!healthy}
            className={`rounded-[5px] border px-3 py-1.5 font-nav text-[0.85rem] transition-colors ${
              healthy
                ? 'border-line bg-surface text-muted hover:border-amber hover:text-amber'
                : 'border-amber bg-amber text-white'
            }`}
          >
            {healthy ? 'Take the provider down' : 'Provider is down — bring it back'}
          </button>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="btn-quiet !px-3 !py-1.5 !text-[0.85rem]"
          >
            {running ? 'Pause' : 'Run'}
          </button>
          <button type="button" onClick={reset} className="btn-quiet !px-3 !py-1.5 !text-[0.85rem]">
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-5">
        <div className="rounded-[7px] border border-line bg-base px-3 py-2">
          <p className="font-nav text-[0.76rem] uppercase tracking-wide text-muted">Breaker</p>
          <p className={`mt-0.5 font-mono text-[1.05rem] font-semibold ${stateColor}`}>{state}</p>
        </div>
        <Stat label="Succeeded" value={String(stats.ok)} tone="good" />
        <Stat label="Failed" value={String(stats.failed)} tone={stats.failed ? 'bad' : undefined} />
        <Stat label="Blocked fast" value={String(stats.blocked)} />
        <Stat label="Cache hits" value={String(stats.cached)} />
      </div>

      <Output label={`consecutive failures: ${failures}/${threshold}`}>
        {log.length === 0
          ? 'waiting for the first request…'
          : log.map((l) => (
              <div key={`${l.n}-${l.text}`} className={tone[l.tone]}>
                {String(l.n).padStart(3, ' ')}  {l.text}
              </div>
            ))}
      </Output>

      <p className="text-[0.88rem] leading-relaxed text-muted">
        Take the provider down and watch the failures accumulate. At the threshold the breaker
        opens and every further request is refused immediately rather than waiting out a timeout —
        which is the point: a slow failure ties up a connection, a fast one does not. After the
        cool-down exactly one trial request goes through. If it fails, the breaker opens again for
        a full cool-down instead of letting the queued traffic pile onto a provider that is still
        down.
      </p>
    </div>
  );
}
