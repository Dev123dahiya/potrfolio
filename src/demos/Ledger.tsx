import { useMemo, useState } from 'react';
import { DemoNote, DemoError, Output, Stat, Table } from './ui';

/**
 * The double-entry core of `event-sourced-ledger`.
 *
 * Balances are never stored. They are folded from the event log every time,
 * which is what makes the invariant checkable: if debits equal credits in
 * every event, the trial balance is zero no matter what order they arrive in.
 */

interface Entry {
  account: string;
  amount: number; // positive debit, negative credit
}

interface Event {
  seq: number;
  kind: string;
  entries: Entry[];
  memo: string;
}

const ACCOUNTS = ['cash', 'revenue', 'receivable', 'fees'] as const;

const INITIAL: Event[] = [
  { seq: 1, kind: 'invoice.raised', memo: 'Invoice 1001 raised', entries: [{ account: 'receivable', amount: 5000 }, { account: 'revenue', amount: -5000 }] },
  { seq: 2, kind: 'payment.received', memo: 'Customer paid 1001', entries: [{ account: 'cash', amount: 4850 }, { account: 'fees', amount: 150 }, { account: 'receivable', amount: -5000 }] },
  { seq: 3, kind: 'refund.issued', memo: 'Partial refund', entries: [{ account: 'revenue', amount: 800 }, { account: 'cash', amount: -800 }] },
];

/** Replays the log into balances. The only way a balance is ever produced. */
function fold(events: Event[]): Record<string, number> {
  const balances: Record<string, number> = Object.fromEntries(ACCOUNTS.map((a) => [a, 0]));
  for (const e of events) {
    for (const entry of e.entries) balances[entry.account] = (balances[entry.account] ?? 0) + entry.amount;
  }
  return balances;
}

const trialBalance = (balances: Record<string, number>) =>
  Object.values(balances).reduce((a, b) => a + b, 0);

const money = (n: number) => (n < 0 ? `(${Math.abs(n).toLocaleString()})` : n.toLocaleString());

export default function Ledger() {
  const [events, setEvents] = useState<Event[]>(INITIAL);
  const [upTo, setUpTo] = useState(INITIAL.length);
  const [debit, setDebit] = useState('cash');
  const [credit, setCredit] = useState('revenue');
  const [amount, setAmount] = useState('1200');
  const [error, setError] = useState('');

  const visible = events.slice(0, upTo);
  const balances = useMemo(() => fold(visible), [visible]);
  const total = trialBalance(balances);

  const append = (balanced: boolean) => {
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    if (debit === credit) {
      setError('A transaction has to move money between two different accounts.');
      return;
    }
    const entries: Entry[] = balanced
      ? [
          { account: debit, amount: value },
          { account: credit, amount: -value },
        ]
      : // Deliberately unbalanced, to show what the check catches.
        [
          { account: debit, amount: value },
          { account: credit, amount: -(value - 1) },
        ];

    const sum = entries.reduce((a, e) => a + e.amount, 0);
    if (sum !== 0) {
      // This is the rule the repo enforces: money is never created or
      // destroyed, so an unbalanced event is rejected before it is appended.
      setError(
        `Rejected: debits and credits differ by ${Math.abs(sum)}. The event is not written, so the log cannot contain an unbalanced transaction.`,
      );
      return;
    }
    setError('');
    const next = [
      ...events.slice(0, upTo),
      { seq: upTo + 1, kind: 'transfer.posted', memo: `${debit} ← ${credit}`, entries },
    ];
    setEvents(next);
    setUpTo(next.length);
  };

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        Balances below are folded from the event log on every render — nothing is stored. Drag the
        replay slider to see the ledger at any point in its history.
      </DemoNote>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="min-w-0 space-y-3">
          <Output label={`event log · replaying ${upTo} of ${events.length}`}>
            {events
              .map(
                (e, i) =>
                  `${i < upTo ? ' ' : '·'} ${String(e.seq).padStart(2)}  ${e.kind.padEnd(18)}${e.entries
                    .map((x) => `${x.account} ${x.amount > 0 ? '+' : ''}${x.amount}`)
                    .join('  ')}`,
              )
              .join('\n')}
          </Output>

          <label className="block">
            <span className="flex items-baseline justify-between font-nav text-[0.82rem] font-medium text-muted">
              Replay up to event
              <span className="font-mono text-[0.84rem] text-ink">
                {upTo} / {events.length}
              </span>
            </span>
            <input
              type="range"
              min={0}
              max={events.length}
              value={upTo}
              onChange={(e) => setUpTo(Number(e.target.value))}
              className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-signal"
            />
          </label>

          <div className="rounded-[8px] border border-line bg-base p-3">
            <p className="font-nav text-[0.85rem] font-medium">Post a transaction</p>
            <div className="mt-2 grid grid-cols-[1fr_1fr_5.5rem] gap-2">
              <label className="block">
                <span className="font-nav text-[0.76rem] text-muted">Debit</span>
                <select
                  value={debit}
                  onChange={(e) => setDebit(e.target.value)}
                  className="mt-0.5 h-9 w-full rounded-[5px] border border-line bg-surface px-2 font-mono text-[0.82rem] text-ink outline-none focus:border-signal"
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-nav text-[0.76rem] text-muted">Credit</span>
                <select
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  className="mt-0.5 h-9 w-full rounded-[5px] border border-line bg-surface px-2 font-mono text-[0.82rem] text-ink outline-none focus:border-signal"
                >
                  {ACCOUNTS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-nav text-[0.76rem] text-muted">Amount</span>
                <input
                  value={amount}
                  inputMode="numeric"
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-0.5 h-9 w-full rounded-[5px] border border-line bg-surface px-2 font-mono text-[0.82rem] text-ink outline-none focus:border-signal"
                />
              </label>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              <button type="button" onClick={() => append(true)} className="btn-primary !px-3 !py-1.5 !text-[0.85rem]">
                Post it
              </button>
              <button
                type="button"
                onClick={() => append(false)}
                className="rounded-[5px] border border-amber/50 px-3 py-1.5 font-nav text-[0.85rem] text-amber transition-colors hover:bg-amber/10"
              >
                Try an unbalanced one
              </button>
              <button
                type="button"
                onClick={() => {
                  setEvents(INITIAL);
                  setUpTo(INITIAL.length);
                  setError('');
                }}
                className="btn-quiet !px-3 !py-1.5 !text-[0.85rem]"
              >
                Reset
              </button>
            </div>
          </div>

          {error && <DemoError>{error}</DemoError>}
        </div>

        <div className="min-w-0 space-y-3">
          <Table
            rows={ACCOUNTS.map((a) => ({ account: a, balance: money(balances[a] ?? 0) }))}
          />
          <Stat
            label="Trial balance"
            value={total === 0 ? '0 — balanced' : String(total)}
            tone={total === 0 ? 'good' : 'bad'}
          />
          <p className="text-[0.88rem] leading-relaxed text-muted">
            The trial balance is the sum of every account. It is zero after every event because
            each event's debits and credits cancel, and an event whose entries do not sum to zero
            is never appended. That one rule is what makes the log trustworthy: there is no code
            path that can create money, so the balances cannot drift from the history that produced
            them.
          </p>
          <p className="text-[0.88rem] leading-relaxed text-muted">
            The repo adds the concurrency half of this: eight threads requesting 4,000 from an
            account holding 1,000, with the limit check and the write under the same lock. Exactly
            1,000 moves.
          </p>
        </div>
      </div>
    </div>
  );
}
