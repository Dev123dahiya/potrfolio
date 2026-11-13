import { useMemo, useState } from 'react';
import { run, SqlError, type Row } from './sqlEngine';
import { DemoError, DemoNote, Output, Table } from './ui';

// A small fixed database. Carla has no age and Farah's department is missing
// from `departments`, so the NULL and LEFT JOIN cases below have something to
// land on.
const employees: Row[] = [
  { id: 1, name: 'Asha', dept: 'ENG', salary: 120000, age: 31 },
  { id: 2, name: 'Bhavin', dept: 'ENG', salary: 98000, age: 28 },
  { id: 3, name: 'Carla', dept: 'DATA', salary: 105000, age: null },
  { id: 4, name: 'Dev', dept: 'DATA', salary: 88000, age: 24 },
  { id: 5, name: 'Eli', dept: 'SALES', salary: 76000, age: 41 },
  { id: 6, name: 'Farah', dept: 'OPS', salary: 69000, age: 35 },
];

const departments: Row[] = [
  { code: 'ENG', name: 'Engineering', floor: 3 },
  { code: 'DATA', name: 'Data Platform', floor: 3 },
  { code: 'SALES', name: 'Revenue', floor: 1 },
];

const tables = { employees, departments };

const presets: { label: string; sql: string; why: string }[] = [
  {
    label: 'Filter and sort',
    sql: 'SELECT name, dept, salary\nFROM employees\nWHERE salary > 90000\nORDER BY salary DESC',
    why: 'The ordinary case: scan, filter, project, sort.',
  },
  {
    label: 'Group and aggregate',
    sql: 'SELECT dept, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY dept\nORDER BY avg_salary DESC',
    why: 'One output row per group, and the aggregate is computed after the filter.',
  },
  {
    label: 'NOT with a NULL',
    sql: 'SELECT name, age\nFROM employees\nWHERE NOT (age > 30)',
    why: 'Carla has no age, so age > 30 is unknown and NOT unknown is still unknown. WHERE keeps only true, so she is excluded from both this and its opposite.',
  },
  {
    label: 'NOT IN with a NULL',
    sql: "SELECT name, age\nFROM employees\nWHERE age NOT IN (28, 34, NULL)",
    why: 'This matches nothing at all. Every row might equal the unknown value, so the predicate is never true. The most common NULL bug in production SQL.',
  },
  {
    label: 'Aggregate over no rows',
    sql: 'SELECT COUNT(*) AS n, MAX(salary) AS top\nFROM employees\nWHERE 1 = 0',
    why: 'No rows survive the filter, but an ungrouped aggregate still returns exactly one row: 0 and NULL.',
  },
  {
    label: 'LEFT JOIN',
    sql: 'SELECT e.name, e.dept, d.name AS department\nFROM employees e\nLEFT JOIN departments d ON e.dept = d.code',
    why: "Farah's OPS department is missing, so the right-hand columns come back NULL rather than dropping her row.",
  },
  {
    label: 'The filter that cannot move',
    sql: 'SELECT e.name, d.floor\nFROM employees e\nLEFT JOIN departments d ON e.dept = d.code\nWHERE d.floor = 3',
    why: 'A planner that pushed this filter below the join would keep Farah with a NULL floor. Applied above the join it removes her, which is the correct answer. This is why filters on the nullable side stay put.',
  },
];

export default function MiniSql() {
  const [sql, setSql] = useState(presets[0].sql);
  const [why, setWhy] = useState(presets[0].why);

  const result = useMemo(() => {
    const text = sql.trim();
    if (!text) return { kind: 'empty' as const };
    try {
      return { kind: 'ok' as const, ...run(text, tables) };
    } catch (e) {
      return {
        kind: 'error' as const,
        message: e instanceof SqlError ? e.message : String(e),
      };
    }
  }, [sql]);

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        The lexer, parser, planner and executor below are running in this page on the two tables
        shown. Edit the query and the plan and results update as you type.
      </DemoNote>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setSql(p.sql);
              setWhy(p.why);
            }}
            className={`rounded-[5px] border px-2.5 py-1 font-nav text-[0.84rem] transition-colors ${
              sql === p.sql
                ? 'border-signal bg-signal text-white'
                : 'border-line bg-surface text-muted hover:border-signal hover:text-signal'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <label className="block">
            <span className="sr-only">SQL query</span>
            <textarea
              value={sql}
              spellCheck={false}
              onChange={(e) => {
                setSql(e.target.value);
                setWhy('');
              }}
              rows={6}
              className="w-full resize-y rounded-[8px] border-2 border-line bg-[#0d1117] p-3 font-mono text-[0.82rem] leading-relaxed text-[#d7e2ea] outline-none transition-colors focus:border-signal"
            />
          </label>

          {why && <p className="text-[0.88rem] leading-relaxed text-muted">{why}</p>}

          <details className="rounded-[8px] border border-line bg-base px-3 py-2">
            <summary className="cursor-pointer font-nav text-[0.85rem] text-muted">
              The two tables
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <p className="mb-1 font-mono text-[0.78rem] text-muted">employees</p>
                <Table rows={employees} />
              </div>
              <div>
                <p className="mb-1 font-mono text-[0.78rem] text-muted">departments</p>
                <Table rows={departments} />
              </div>
            </div>
          </details>
        </div>

        <div className="min-w-0 space-y-3">
          {result.kind === 'error' && <DemoError>{result.message}</DemoError>}
          {result.kind === 'empty' && <p className="text-[0.88rem] text-muted">Type a query to run it.</p>}
          {result.kind === 'ok' && (
            <>
              <Output label="query plan">
                {result.plan
                  .map(
                    (s, i) =>
                      `${'  '.repeat(result.plan.length - 1 - i)}${s.op.padEnd(22)} ${String(s.rows).padStart(3)} row${
                        s.rows === 1 ? '' : 's'
                      }\n${'  '.repeat(result.plan.length - 1 - i)}  ${s.detail}`,
                  )
                  .reverse()
                  .join('\n')}
              </Output>
              <div>
                <p className="mb-1.5 font-nav text-[0.82rem] text-muted">
                  {result.rows.length} row{result.rows.length === 1 ? '' : 's'} ·{' '}
                  {result.tokens.length - 1} tokens
                </p>
                <Table rows={result.rows} empty="No rows returned." />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
