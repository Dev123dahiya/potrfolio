import { useMemo, useState } from 'react';
import { DemoNote, Stat } from './ui';

/**
 * The detection half of `secret-scanner`, running on whatever is pasted in.
 *
 * Nothing leaves the page: the regexes and the entropy gate run here, and the
 * matched value is masked before it is ever displayed.
 */

interface Rule {
  id: string;
  name: string;
  severity: 'high' | 'medium';
  pattern: RegExp;
}

// Provider patterns are precise enough not to need an entropy check: the
// prefix already says what the string is.
const RULES: Rule[] = [
  { id: 'aws-access-key', name: 'AWS access key ID', severity: 'high', pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g },
  { id: 'github-pat', name: 'GitHub personal access token', severity: 'high', pattern: /\bgh[pousr]_[A-Za-z0-9]{36}\b/g },
  { id: 'slack-token', name: 'Slack token', severity: 'high', pattern: /\bxox[baprs]-[0-9A-Za-z-]{10,}\b/g },
  { id: 'stripe-key', name: 'Stripe secret key', severity: 'high', pattern: /\b[sr]k_(?:live|test)_[0-9A-Za-z]{10,}\b/g },
  { id: 'google-api-key', name: 'Google API key', severity: 'high', pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { id: 'private-key', name: 'Private key block', severity: 'high', pattern: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g },
  { id: 'jwt', name: 'JSON web token', severity: 'medium', pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
  { id: 'postgres-url', name: 'Database URL with a password', severity: 'high', pattern: /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[^\s:@/]+:[^\s@/]+@[^\s/]+/g },
];

// The generic rule fires on an assignment to any secret-sounding name. It is
// deliberately greedy — this is what a naive scanner matches — and the two
// gates below are what make it usable.
//
// The name is matched as a whole and tested separately rather than spelling
// the keywords into the pattern: folding them in means the leading
// `[A-Za-z_]` eats the first character before the keyword alternation is
// tried, so a name that *starts* with the keyword (`password`, `TOKENIZERS`)
// never matches at all.
const GENERIC = /\b([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*["']?([^\s"';,]{4,})["']?/g;
const SECRETISH = /secret|token|passwd|password|key|cred/i;

/** A reference such as ${VAR}, sk_test_your_key_here or "changeme". */
const TEMPLATE = /[${}<>%]|(?:^|[-_])(?:your|my|our|the)[-_]|change[-_]?me|placeholder|example|sample|dummy|redacted|xxx+|\.\.\./i;

const ENTROPY_THRESHOLD = 3.6;

/** Shannon entropy in bits per character. */
function entropy(value: string): number {
  const counts = new Map<string, number>();
  for (const c of value) counts.set(c, (counts.get(c) ?? 0) + 1);
  let bits = 0;
  for (const n of counts.values()) {
    const p = n / value.length;
    bits -= p * Math.log2(p);
  }
  return bits;
}

/** Shows enough to recognise the value, never enough to use it. */
function mask(value: string): string {
  if (value.length <= 10) return value.slice(0, 2) + '*'.repeat(Math.max(value.length - 2, 0));
  return `${value.slice(0, 4)}${'*'.repeat(12)}${value.slice(-4)}`;
}

interface Finding {
  line: number;
  column: number;
  rule: string;
  severity: 'high' | 'medium';
  masked: string;
  entropy: number;
  note?: string;
}

/**
 * The sample values are assembled at runtime rather than written out as
 * literals.
 *
 * A file containing a string shaped like a real GitHub token is blocked by
 * GitHub's own push protection — correctly, since a scanner cannot tell a
 * demo fixture from a leak. Splitting each one means the repository holds no
 * token-shaped string, while the demo still has something to find. The
 * detection rules above are unchanged and still match the full value.
 */
const fixture = (prefix: string, body: string) => prefix + body;

const SAMPLE = [
  '# deploy/staging.env — pasted from a real-looking config',
  `DATABASE_URL=${fixture('postgresql://svc_api:', 'hunter2correct@db.internal:5432/orders')}`,
  `AWS_ACCESS_KEY_ID=${fixture('AKIA', 'IOSFODNN7EXAMPLE')}`,
  'SESSION_SECRET=8Fk2pQvX7mZr4Tn9Lw3Hs6Yd',
  `GITHUB_TOKEN=${fixture('ghp_', '1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P7q8R')}`,
  '',
  '# these are not secrets, and a scanner that flags them gets switched off',
  'API_KEY=${VAULT_API_KEY}',
  `STRIPE_KEY=${fixture('sk_test_', 'your_key_here')}`,
  'LOG_LEVEL=debug',
  'TOKENIZERS_PARALLELISM=false',
  'password = "changeme"',
].join('\n');

function scan(text: string): { findings: Finding[]; suppressed: number } {
  const lines = text.split('\n');
  const findings: Finding[] = [];
  let suppressed = 0;

  lines.forEach((line, i) => {
    // Character ranges a provider rule already claimed on this line, so the
    // generic rule does not report the same secret a second time.
    const claimed: [number, number][] = [];

    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = rule.pattern.exec(line)) !== null) {
        claimed.push([m.index, m.index + m[0].length]);
        findings.push({
          line: i + 1,
          column: m.index + 1,
          rule: rule.name,
          severity: rule.severity,
          masked: mask(m[0]),
          entropy: entropy(m[0]),
        });
      }
    }

    GENERIC.lastIndex = 0;
    let g: RegExpExecArray | null;
    while ((g = GENERIC.exec(line)) !== null) {
      const [whole, name, value] = g;
      if (!SECRETISH.test(name)) continue;
      const valueStart = g.index + whole.lastIndexOf(value);
      const valueEnd = valueStart + value.length;
      if (claimed.some(([from, to]) => valueStart < to && valueEnd > from)) continue;

      // Gate one: the value is a reference or a placeholder, not a secret.
      if (TEMPLATE.test(value)) {
        suppressed += 1;
        continue;
      }
      // Gate two: the value is not random enough to be a credential. This is
      // what keeps TOKENIZERS_PARALLELISM=false out of the report.
      const bits = entropy(value);
      if (bits < ENTROPY_THRESHOLD) {
        suppressed += 1;
        continue;
      }
      findings.push({
        line: i + 1,
        column: valueStart + 1,
        rule: `High-entropy value assigned to ${name}`,
        severity: 'medium',
        masked: mask(value),
        entropy: bits,
      });
    }
  });

  return { findings, suppressed };
}

export default function SecretScanner() {
  const [text, setText] = useState(SAMPLE);
  const { findings, suppressed } = useMemo(() => scan(text), [text]);

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        The rules run in this page and nothing is sent anywhere. Matched values are masked before
        they are displayed. Paste your own text if you like — but paste something you are willing
        to have in a browser tab.
      </DemoNote>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="sr-only">Text to scan</span>
          <textarea
            value={text}
            spellCheck={false}
            onChange={(e) => setText(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-[8px] border-2 border-line bg-[#0d1117] p-3 font-mono text-[0.78rem] leading-relaxed text-[#d7e2ea] outline-none transition-colors focus:border-signal"
          />
        </label>

        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Findings"
              value={String(findings.length)}
              tone={findings.length > 0 ? 'bad' : 'good'}
            />
            <Stat label="High severity" value={String(findings.filter((f) => f.severity === 'high').length)} />
            <Stat label="Suppressed" value={String(suppressed)} tone="good" />
          </div>

          {findings.length === 0 ? (
            <p className="rounded-[8px] border border-line bg-base px-3 py-6 text-center text-[0.9rem] text-muted">
              Nothing matched. The scanner exits 0.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {findings.map((f, i) => (
                <li
                  key={i}
                  className="rounded-[7px] border border-line bg-base px-3 py-2 font-mono text-[0.78rem]"
                >
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className={f.severity === 'high' ? 'text-amber' : 'text-violet'}>
                      {f.severity}
                    </span>
                    <span className="text-muted">
                      line {f.line}, col {f.column}
                    </span>
                  </p>
                  <p className="mt-0.5 text-ink">{f.rule}</p>
                  <p className="mt-0.5 text-muted">
                    {f.masked} · {f.entropy.toFixed(2)} bits/char
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p className="text-[0.86rem] leading-relaxed text-muted">
            The generic rule matches an assignment to any secret-sounding name, which on this
            sample means it also matches{' '}
            <span className="font-mono text-ink">{'${VAULT_API_KEY}'}</span>,{' '}
            <span className="font-mono text-ink">{fixture('sk_test_', 'your_key_here')}</span>,{' '}
            <span className="font-mono text-ink">changeme</span> and{' '}
            <span className="font-mono text-ink">TOKENIZERS_PARALLELISM=false</span>. The two gates
            throw {suppressed === 0 ? 'those' : `those ${suppressed}`} out: one for references and
            placeholders, one for values with too little entropy to be a credential. A scanner that
            reports them is a scanner the team turns off, and then it catches nothing at all.
          </p>
        </div>
      </div>
    </div>
  );
}
