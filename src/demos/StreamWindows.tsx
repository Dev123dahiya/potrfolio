import { useMemo, useState } from 'react';
import { DemoNote, Segmented, Slider, Stat } from './ui';

/**
 * The windowing and lateness trade-off from `stream-windowing-engine`.
 *
 * Events carry two times: when they happened and when they arrived. On a real
 * stream those differ, and every windowing decision follows from which one
 * you group by and how long you are willing to wait for stragglers.
 */

type Mode = 'tumbling' | 'sliding' | 'session';

interface Event {
  id: number;
  eventTime: number; // seconds, when it happened
  arrivalTime: number; // seconds, when it reached the processor
}

/** A fixed stream, so moving a slider changes the policy and nothing else. */
const EVENTS: Event[] = (() => {
  let seed = 9;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const out: Event[] = [];
  for (let i = 0; i < 48; i += 1) {
    const eventTime = Math.round(rand() * 110);
    // Most events arrive promptly; a few are badly delayed, which is what
    // watermarks and allowed lateness exist for.
    const delay = rand() < 0.18 ? 8 + rand() * 26 : rand() * 3;
    out.push({ id: i, eventTime, arrivalTime: eventTime + Math.round(delay) });
  }
  return out.sort((a, b) => a.arrivalTime - b.arrivalTime);
})();

const SPAN = 120;

interface Window {
  label: string;
  start: number;
  end: number;
  ids: number[];
}

function assign(mode: Mode, size: number, slide: number, gap: number, events: Event[]): Window[] {
  if (mode === 'session') {
    // A session window closes after `gap` seconds of silence.
    const sorted = [...events].sort((a, b) => a.eventTime - b.eventTime);
    const windows: Window[] = [];
    for (const e of sorted) {
      const last = windows[windows.length - 1];
      if (last && e.eventTime - last.end <= gap) {
        last.end = Math.max(last.end, e.eventTime);
        last.ids.push(e.id);
      } else {
        windows.push({ label: `session ${windows.length + 1}`, start: e.eventTime, end: e.eventTime, ids: [e.id] });
      }
    }
    return windows;
  }

  const step = mode === 'tumbling' ? size : slide;
  const windows: Window[] = [];
  for (let start = 0; start < SPAN; start += step) {
    const end = start + size;
    const ids = events.filter((e) => e.eventTime >= start && e.eventTime < end).map((e) => e.id);
    // An empty window is not emitted; there is nothing to aggregate.
    if (ids.length > 0) windows.push({ label: `${start}–${end}s`, start, end, ids });
  }
  return windows;
}

export default function StreamWindows() {
  const [mode, setMode] = useState<Mode>('tumbling');
  const [size, setSize] = useState(30);
  const [slide, setSlide] = useState(15);
  const [gap, setGap] = useState(8);
  const [lateness, setLateness] = useState(5);

  const result = useMemo(() => {
    // The watermark is the processor's belief about how far event time has
    // advanced. Anything arriving with an event time below it is late.
    let maxEventTime = -Infinity;
    const onTime: Event[] = [];
    const late: Event[] = [];
    const dropped: Event[] = [];

    for (const e of EVENTS) {
      const watermark = maxEventTime === -Infinity ? -Infinity : maxEventTime - lateness;
      if (e.eventTime < watermark) {
        // Beyond the allowed lateness: the window it belongs to has already
        // been emitted and closed.
        dropped.push(e);
      } else {
        if (maxEventTime !== -Infinity && e.eventTime < maxEventTime) late.push(e);
        onTime.push(e);
      }
      maxEventTime = Math.max(maxEventTime, e.eventTime);
    }

    const windows = assign(mode, size, slide, gap, onTime);
    const counted = new Set(windows.flatMap((w) => w.ids));
    return {
      windows,
      onTime,
      late,
      dropped,
      completeness: EVENTS.length === 0 ? 1 : counted.size / EVENTS.length,
    };
  }, [mode, size, slide, gap, lateness]);

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        The same 48-event stream is windowed in this page. Events are plotted by the time they
        happened; the delayed ones arrived out of order, which is what makes the lateness setting
        matter.
      </DemoNote>

      <div className="flex flex-wrap items-end gap-4">
        <Segmented
          label="Window type"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'tumbling', label: 'Tumbling' },
            { value: 'sliding', label: 'Sliding' },
            { value: 'session', label: 'Session' },
          ]}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {mode !== 'session' && (
          <Slider label="Window size" value={size} min={10} max={60} step={5} suffix=" s" onChange={setSize} />
        )}
        {mode === 'sliding' && (
          <Slider label="Slide by" value={slide} min={5} max={30} step={5} suffix=" s" onChange={setSlide} />
        )}
        {mode === 'session' && (
          <Slider label="Inactivity gap" value={gap} min={3} max={25} suffix=" s" onChange={setGap} />
        )}
        <Slider
          label="Allowed lateness"
          value={lateness}
          min={0}
          max={40}
          step={1}
          suffix=" s"
          onChange={setLateness}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <Stat label="Windows emitted" value={String(result.windows.length)} />
        <Stat label="Events counted" value={`${result.onTime.length} / ${EVENTS.length}`} />
        <Stat
          label="Arrived late, kept"
          value={String(result.late.length)}
          tone={result.late.length > 0 ? 'good' : undefined}
        />
        <Stat
          label="Dropped"
          value={String(result.dropped.length)}
          tone={result.dropped.length > 0 ? 'bad' : 'good'}
        />
      </div>

      <div className="overflow-hidden rounded-[8px] border border-line bg-base p-3">
        <div className="relative h-28">
          {result.windows.map((w, i) => (
            <div
              key={`${w.label}-${i}`}
              className="absolute rounded-[4px] border border-signal/40 bg-signalSoft"
              style={{
                left: `${(w.start / SPAN) * 100}%`,
                width: `${(Math.max(w.end - w.start, 1) / SPAN) * 100}%`,
                top: `${(i % 4) * 7}px`,
                height: `${72 - (i % 4) * 7}px`,
              }}
              title={`${w.label}: ${w.ids.length} events`}
            />
          ))}
          {EVENTS.map((e) => {
            const isDropped = result.dropped.includes(e);
            const isLate = result.late.includes(e);
            return (
              <span
                key={e.id}
                aria-hidden
                className={`absolute h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
                  isDropped ? 'bg-amber' : isLate ? 'bg-violet' : 'bg-signal'
                }`}
                style={{ left: `${(e.eventTime / SPAN) * 100}%`, bottom: `${8 + (e.id % 5) * 7}px` }}
                title={`event ${e.id}: happened at ${e.eventTime}s, arrived at ${e.arrivalTime}s`}
              />
            );
          })}
          <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
        </div>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.76rem] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-signal" /> on time
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-violet" /> late but within the allowance
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber" /> dropped
          </span>
          <span className="ml-auto">0s — {SPAN}s of event time</span>
        </p>
      </div>

      <p className="text-[0.88rem] leading-relaxed text-muted">
        {lateness === 0
          ? 'With no allowance, every out-of-order event is dropped. The results are fast and wrong.'
          : result.dropped.length === 0
            ? `An allowance of ${lateness}s catches every straggler in this stream: completeness is 100%, but a window cannot be finalised until ${lateness}s after its end.`
            : `${result.dropped.length} events arrived more than ${lateness}s behind and were dropped — ${(result.completeness * 100).toFixed(1)}% completeness. Raising the allowance recovers them and delays every result by the same amount.`}{' '}
        That is the whole trade: correctness costs latency, and the only honest choice is to pick a
        number and measure what it costs.
      </p>
    </div>
  );
}
