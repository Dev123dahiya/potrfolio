/**
 * A small SQL engine: lexer, parser, planner and executor.
 *
 * This is a browser port of the pieces of `mini-sql-engine` that fit in a
 * demo — enough of the language to show the parts that are actually hard:
 * three-valued logic around NULL, aggregates over zero rows, and a LEFT JOIN
 * whose WHERE filter cannot be pushed below the join.
 *
 * Supported:
 *   SELECT <items> FROM <table> [alias]
 *     [[LEFT] JOIN <table> [alias] ON <expr>]
 *     [WHERE <expr>] [GROUP BY <cols>] [ORDER BY <col> [ASC|DESC]] [LIMIT n]
 *   aggregates COUNT, SUM, AVG, MIN, MAX
 *   operators = <> != < <= > >=, AND, OR, NOT, IS [NOT] NULL, [NOT] IN (...)
 */

export type Value = string | number | null;
export type Row = Record<string, Value>;

// ---------------------------------------------------------------------------
// Lexer
// ---------------------------------------------------------------------------

export type TokenKind = 'word' | 'number' | 'string' | 'op' | 'punct' | 'eof';
export interface Token {
  kind: TokenKind;
  text: string;
  /** Uppercased text, for keyword comparisons. */
  upper: string;
  at: number;
}

const OPERATORS = ['<>', '!=', '<=', '>=', '=', '<', '>'];

export function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if (/\s/.test(c)) {
      i += 1;
      continue;
    }
    // A string literal, with '' as the escape for a quote.
    if (c === "'") {
      let j = i + 1;
      let text = '';
      while (j < sql.length) {
        if (sql[j] === "'" && sql[j + 1] === "'") {
          text += "'";
          j += 2;
        } else if (sql[j] === "'") {
          break;
        } else {
          text += sql[j];
          j += 1;
        }
      }
      if (j >= sql.length) throw new SqlError('unterminated string literal', i);
      tokens.push({ kind: 'string', text, upper: text.toUpperCase(), at: i });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(sql[i + 1] ?? ''))) {
      let j = i;
      while (j < sql.length && /[0-9.]/.test(sql[j])) j += 1;
      const text = sql.slice(i, j);
      tokens.push({ kind: 'number', text, upper: text, at: i });
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_.]/.test(sql[j])) j += 1;
      const text = sql.slice(i, j);
      tokens.push({ kind: 'word', text, upper: text.toUpperCase(), at: i });
      i = j;
      continue;
    }
    const op = OPERATORS.find((o) => sql.startsWith(o, i));
    if (op) {
      tokens.push({ kind: 'op', text: op, upper: op, at: i });
      i += op.length;
      continue;
    }
    if ('(),*'.includes(c)) {
      tokens.push({ kind: 'punct', text: c, upper: c, at: i });
      i += 1;
      continue;
    }
    throw new SqlError(`unexpected character ${JSON.stringify(c)}`, i);
  }
  tokens.push({ kind: 'eof', text: '', upper: '', at: sql.length });
  return tokens;
}

export class SqlError extends Error {
  constructor(
    message: string,
    public readonly at: number = 0,
  ) {
    super(message);
    this.name = 'SqlError';
  }
}

// ---------------------------------------------------------------------------
// AST
// ---------------------------------------------------------------------------

export type Expr =
  | { t: 'lit'; value: Value }
  | { t: 'col'; name: string }
  | { t: 'binary'; op: string; left: Expr; right: Expr }
  | { t: 'not'; expr: Expr }
  | { t: 'isNull'; expr: Expr; negated: boolean }
  | { t: 'in'; expr: Expr; list: Expr[]; negated: boolean }
  | { t: 'agg'; fn: 'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX'; arg: Expr | '*' };

export interface SelectItem {
  expr: Expr | '*';
  alias?: string;
}

export interface Query {
  items: SelectItem[];
  from: { table: string; alias: string };
  join?: { table: string; alias: string; on: Expr; left: boolean };
  where?: Expr;
  groupBy: string[];
  orderBy: { name: string; desc: boolean }[];
  limit?: number;
}

// ---------------------------------------------------------------------------
// Parser (recursive descent)
// ---------------------------------------------------------------------------

const AGGREGATES = new Set(['COUNT', 'SUM', 'AVG', 'MIN', 'MAX']);

export function parse(sql: string): { query: Query; tokens: Token[] } {
  const tokens = tokenize(sql);
  let pos = 0;

  const peek = () => tokens[pos];
  const next = () => tokens[pos++];
  const at = (upper: string) => peek().upper === upper;
  const accept = (upper: string) => (at(upper) ? (pos++, true) : false);
  const expect = (upper: string) => {
    if (!accept(upper)) throw new SqlError(`expected ${upper}, found ${peek().text || 'end of query'}`, peek().at);
  };

  function parsePrimary(): Expr {
    const tok = peek();
    if (tok.kind === 'number') {
      next();
      return { t: 'lit', value: Number(tok.text) };
    }
    if (tok.kind === 'string') {
      next();
      return { t: 'lit', value: tok.text };
    }
    if (tok.kind === 'punct' && tok.text === '(') {
      next();
      const inner = parseOr();
      expect(')');
      return inner;
    }
    if (tok.kind === 'word') {
      if (tok.upper === 'NULL') {
        next();
        return { t: 'lit', value: null };
      }
      if (AGGREGATES.has(tok.upper) && tokens[pos + 1]?.text === '(') {
        next();
        next();
        let arg: Expr | '*';
        if (peek().text === '*') {
          next();
          arg = '*';
        } else {
          arg = parseOr();
        }
        expect(')');
        return { t: 'agg', fn: tok.upper as 'COUNT', arg };
      }
      next();
      return { t: 'col', name: tok.text };
    }
    throw new SqlError(`expected a value, found ${tok.text || 'end of query'}`, tok.at);
  }

  function parseComparison(): Expr {
    const left = parsePrimary();

    if (at('IS')) {
      next();
      const negated = accept('NOT');
      expect('NULL');
      return { t: 'isNull', expr: left, negated };
    }
    if (at('NOT') && tokens[pos + 1]?.upper === 'IN') {
      next();
      next();
      return { t: 'in', expr: left, list: parseList(), negated: true };
    }
    if (at('IN')) {
      next();
      return { t: 'in', expr: left, list: parseList(), negated: false };
    }
    if (peek().kind === 'op') {
      const op = next().text;
      return { t: 'binary', op: op === '!=' ? '<>' : op, left, right: parsePrimary() };
    }
    return left;
  }

  function parseList(): Expr[] {
    expect('(');
    const list: Expr[] = [];
    do {
      list.push(parsePrimary());
    } while (accept(','));
    expect(')');
    return list;
  }

  function parseNot(): Expr {
    if (accept('NOT')) return { t: 'not', expr: parseNot() };
    return parseComparison();
  }

  function parseAnd(): Expr {
    let left = parseNot();
    while (accept('AND')) left = { t: 'binary', op: 'AND', left, right: parseNot() };
    return left;
  }

  function parseOr(): Expr {
    let left = parseAnd();
    while (accept('OR')) left = { t: 'binary', op: 'OR', left, right: parseAnd() };
    return left;
  }

  function parseTableRef(): { table: string; alias: string } {
    const name = next();
    if (name.kind !== 'word') throw new SqlError('expected a table name', name.at);
    let alias = name.text;
    accept('AS');
    const maybe = peek();
    const stop = new Set(['ON', 'WHERE', 'GROUP', 'ORDER', 'LIMIT', 'JOIN', 'LEFT', 'INNER']);
    if (maybe.kind === 'word' && !stop.has(maybe.upper)) {
      next();
      alias = maybe.text;
    }
    return { table: name.text, alias };
  }

  expect('SELECT');

  const items: SelectItem[] = [];
  do {
    if (peek().text === '*') {
      next();
      items.push({ expr: '*' });
    } else {
      const expr = parseOr();
      let alias: string | undefined;
      if (accept('AS')) alias = next().text;
      items.push({ expr, alias });
    }
  } while (accept(','));

  expect('FROM');
  const from = parseTableRef();

  let join: Query['join'];
  const isLeft = at('LEFT');
  if (isLeft) next();
  if (accept('INNER') || at('JOIN')) {
    if (at('JOIN')) next();
    const ref = parseTableRef();
    expect('ON');
    join = { ...ref, on: parseOr(), left: isLeft };
  } else if (isLeft) {
    throw new SqlError('expected JOIN after LEFT', peek().at);
  }

  const where = accept('WHERE') ? parseOr() : undefined;

  const groupBy: string[] = [];
  if (accept('GROUP')) {
    expect('BY');
    do {
      groupBy.push(next().text);
    } while (accept(','));
  }

  const orderBy: Query['orderBy'] = [];
  if (accept('ORDER')) {
    expect('BY');
    do {
      const name = next().text;
      const desc = accept('DESC');
      if (!desc) accept('ASC');
      orderBy.push({ name, desc });
    } while (accept(','));
  }

  const limit = accept('LIMIT') ? Number(next().text) : undefined;

  if (peek().kind !== 'eof') throw new SqlError(`unexpected ${peek().text} after the query`, peek().at);

  return { query: { items, from, join, where, groupBy, orderBy, limit }, tokens };
}

// ---------------------------------------------------------------------------
// Evaluation, with SQL's three-valued logic
// ---------------------------------------------------------------------------

/** NULL in a comparison gives unknown, which is neither true nor false. */
type Tri = true | false | null;

function lookup(row: Row, name: string): Value {
  if (name in row) return row[name];
  // An unqualified name matches a single qualified column.
  const suffix = '.' + name.toLowerCase();
  const hits = Object.keys(row).filter((k) => k.toLowerCase().endsWith(suffix));
  if (hits.length === 1) return row[hits[0]];
  if (hits.length > 1) throw new SqlError(`column ${name} is ambiguous`);
  const ci = Object.keys(row).find((k) => k.toLowerCase() === name.toLowerCase());
  if (ci) return row[ci];
  throw new SqlError(`no such column: ${name}`);
}

function compare(a: Value, b: Value): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

export function evaluate(expr: Expr, row: Row): Value | Tri {
  switch (expr.t) {
    case 'lit':
      return expr.value;
    case 'col':
      return lookup(row, expr.name);
    case 'not': {
      const v = evaluate(expr.expr, row) as Tri;
      return v === null ? null : !v;
    }
    case 'isNull': {
      const v = evaluate(expr.expr, row);
      const isNull = v === null;
      return expr.negated ? !isNull : isNull;
    }
    case 'in': {
      const v = evaluate(expr.expr, row);
      if (v === null) return null;
      let sawNull = false;
      for (const item of expr.list) {
        const other = evaluate(item, row) as Value;
        if (other === null) {
          sawNull = true;
          continue;
        }
        if (compare(v as Value, other) === 0) return !expr.negated;
      }
      // NOT IN with a NULL in the list can never be true: the value might
      // equal the unknown one. This is the case most people get wrong.
      if (sawNull) return null;
      return expr.negated;
    }
    case 'binary': {
      if (expr.op === 'AND') {
        const l = evaluate(expr.left, row) as Tri;
        const r = evaluate(expr.right, row) as Tri;
        if (l === false || r === false) return false;
        if (l === null || r === null) return null;
        return true;
      }
      if (expr.op === 'OR') {
        const l = evaluate(expr.left, row) as Tri;
        const r = evaluate(expr.right, row) as Tri;
        if (l === true || r === true) return true;
        if (l === null || r === null) return null;
        return false;
      }
      const l = evaluate(expr.left, row) as Value;
      const r = evaluate(expr.right, row) as Value;
      if (l === null || r === null) return null;
      const c = compare(l, r);
      switch (expr.op) {
        case '=':
          return c === 0;
        case '<>':
          return c !== 0;
        case '<':
          return c < 0;
        case '<=':
          return c <= 0;
        case '>':
          return c > 0;
        case '>=':
          return c >= 0;
        default:
          throw new SqlError(`unsupported operator ${expr.op}`);
      }
    }
    case 'agg':
      throw new SqlError('an aggregate cannot appear here');
  }
}

/** WHERE and ON keep a row only when the predicate is true, not unknown. */
const isTrue = (v: Value | Tri) => v === true;

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

export interface PlanStep {
  op: string;
  detail: string;
  rows: number;
}

export interface Result {
  columns: string[];
  rows: Row[];
  plan: PlanStep[];
}

/** The table qualifier is dropped from the output column name, as SQLite does. */
const bare = (name: string) => name.slice(name.lastIndexOf('.') + 1);

function label(item: SelectItem, index: number): string {
  if (item.alias) return item.alias;
  if (item.expr === '*') return '*';
  const e = item.expr;
  if (e.t === 'col') return bare(e.name);
  if (e.t === 'agg') return `${e.fn}(${e.arg === '*' ? '*' : e.arg.t === 'col' ? bare(e.arg.name) : '…'})`;
  return `expr${index + 1}`;
}

function qualify(rows: Row[], alias: string): Row[] {
  return rows.map((r) => {
    const out: Row = {};
    for (const [k, v] of Object.entries(r)) out[`${alias}.${k}`] = v;
    return out;
  });
}

function aggregate(fn: string, values: Value[]): Value {
  // COUNT counts rows that are not null; the others ignore nulls entirely.
  const nums = values.filter((v) => v !== null) as number[];
  switch (fn) {
    case 'COUNT':
      return nums.length;
    case 'SUM':
      return nums.length === 0 ? null : nums.reduce((a, b) => a + Number(b), 0);
    case 'AVG':
      return nums.length === 0 ? null : nums.reduce((a, b) => a + Number(b), 0) / nums.length;
    case 'MIN':
      return nums.length === 0 ? null : nums.reduce((a, b) => (compare(a, b) <= 0 ? a : b));
    case 'MAX':
      return nums.length === 0 ? null : nums.reduce((a, b) => (compare(a, b) >= 0 ? a : b));
    default:
      throw new SqlError(`unsupported aggregate ${fn}`);
  }
}

function collectAggregates(expr: Expr | '*', out: Extract<Expr, { t: 'agg' }>[]): void {
  if (expr === '*') return;
  if (expr.t === 'agg') {
    out.push(expr);
    return;
  }
  if (expr.t === 'binary') {
    collectAggregates(expr.left, out);
    collectAggregates(expr.right, out);
  }
  if (expr.t === 'not') collectAggregates(expr.expr, out);
  if (expr.t === 'isNull') collectAggregates(expr.expr, out);
  if (expr.t === 'in') {
    collectAggregates(expr.expr, out);
    expr.list.forEach((e) => collectAggregates(e, out));
  }
}

export function execute(query: Query, tables: Record<string, Row[]>): Result {
  const plan: PlanStep[] = [];

  const base = tables[query.from.table.toLowerCase()];
  if (!base) throw new SqlError(`no such table: ${query.from.table}`);
  let rows = qualify(base, query.from.alias);
  plan.push({ op: 'Scan', detail: `${query.from.table} as ${query.from.alias}`, rows: rows.length });

  if (query.join) {
    const other = tables[query.join.table.toLowerCase()];
    if (!other) throw new SqlError(`no such table: ${query.join.table}`);
    const right = qualify(other, query.join.alias);
    const nullRight: Row = Object.fromEntries(
      Object.keys(right[0] ?? {}).map((k) => [k, null]),
    ) as Row;

    const joined: Row[] = [];
    for (const l of rows) {
      let matched = false;
      for (const r of right) {
        const combined = { ...l, ...r };
        if (isTrue(evaluate(query.join.on, combined))) {
          joined.push(combined);
          matched = true;
        }
      }
      // A LEFT JOIN keeps the left row with nulls where the right side had
      // no match. A filter on those null columns therefore cannot be pushed
      // below the join: it would change which left rows survive.
      if (!matched && query.join.left) joined.push({ ...l, ...nullRight });
    }
    rows = joined;
    plan.push({
      op: query.join.left ? 'Left nested-loop join' : 'Nested-loop join',
      detail: `${query.join.table} as ${query.join.alias}`,
      rows: rows.length,
    });
  }

  if (query.where) {
    rows = rows.filter((r) => isTrue(evaluate(query.where!, r)));
    plan.push({ op: 'Filter', detail: 'WHERE keeps only rows where the predicate is true', rows: rows.length });
  }

  const aggs: Extract<Expr, { t: 'agg' }>[] = [];
  query.items.forEach((i) => collectAggregates(i.expr, aggs));
  const grouped = query.groupBy.length > 0;

  // With a single table there is no ambiguity, so `*` returns bare column
  // names. Across a join the qualifier is kept, because both sides may carry
  // a column of the same name.
  const star = (r: Row): Row =>
    query.join ? { ...r } : (Object.fromEntries(Object.entries(r).map(([k, v]) => [bare(k), v])) as Row);

  // Two selected columns can share a name — `e.name` and `d.name` across a
  // join both want to be `name`. Keep the qualifier on the later one instead
  // of letting it overwrite the earlier.
  const names: string[] = [];
  const used = new Set<string>();
  query.items.forEach((item, i) => {
    const preferred = label(item, i);
    let name = preferred;
    if (item.expr !== '*' && used.has(name)) {
      name = item.expr.t === 'col' ? item.expr.name : `${preferred}_${i + 1}`;
      let n = 2;
      while (used.has(name)) name = `${preferred}_${n++}`;
    }
    used.add(name);
    names.push(name);
  });

  let output: Row[];
  const columns = query.items.flatMap((item, i) =>
    item.expr === '*' ? Object.keys(star(rows[0] ?? {})) : [names[i]],
  );

  // Sorts by each key in turn. `resolve` differs before and after
  // projection: beforehand every source column is still available.
  const sortBy = (list: Row[], keys: Query['orderBy']): Row[] =>
    [...list].sort((a, b) => {
      for (const { name, desc } of keys) {
        const av = name in a ? a[name] : lookup(a, name);
        const bv = name in b ? b[name] : lookup(b, name);
        // NULL sorts first ascending, which is what SQLite does.
        let c: number;
        if (av === null && bv === null) c = 0;
        else if (av === null) c = -1;
        else if (bv === null) c = 1;
        else c = compare(av, bv);
        if (c !== 0) return desc ? -c : c;
      }
      return 0;
    });

  const sortDetail = query.orderBy
    .map((o) => `${o.name}${o.desc ? ' descending' : ''}`)
    .join(', ');

  if (aggs.length > 0 || grouped) {
    const groups = new Map<string, Row[]>();
    if (grouped) {
      for (const r of rows) {
        const key = JSON.stringify(query.groupBy.map((g) => lookup(r, g)));
        const bucket = groups.get(key);
        if (bucket) bucket.push(r);
        else groups.set(key, [r]);
      }
    } else {
      // No GROUP BY and an aggregate present: one group over everything,
      // which still returns exactly one row when there are no rows at all.
      groups.set('', rows);
    }

    output = [...groups.values()].map((bucket) => {
      const out: Row = {};
      query.items.forEach((item, i) => {
        const name = names[i];
        if (item.expr === '*') {
          Object.assign(out, star(bucket[0] ?? {}));
          return;
        }
        const e = item.expr;
        if (e.t === 'agg') {
          const values = e.arg === '*' ? bucket.map(() => 1 as Value) : bucket.map((r) => evaluate(e.arg as Expr, r) as Value);
          out[name] = aggregate(e.fn, values);
        } else {
          out[name] = (bucket[0] ? (evaluate(e, bucket[0]) as Value) : null) ?? null;
        }
      });
      return out;
    });
    plan.push({
      op: grouped ? 'Group' : 'Aggregate',
      detail: grouped ? `by ${query.groupBy.join(', ')}` : 'one group over every row',
      rows: output.length,
    });
    if (query.orderBy.length > 0) {
      output = sortBy(output, query.orderBy);
      plan.push({ op: 'Sort', detail: sortDetail, rows: output.length });
    }
  } else {
    // Sorting before projection lets ORDER BY name a column the SELECT list
    // does not return.
    if (query.orderBy.length > 0) {
      rows = sortBy(rows, query.orderBy);
      plan.push({ op: 'Sort', detail: sortDetail, rows: rows.length });
    }
    output = rows.map((r) => {
      const out: Row = {};
      query.items.forEach((item, i) => {
        if (item.expr === '*') Object.assign(out, star(r));
        else out[names[i]] = evaluate(item.expr, r) as Value;
      });
      return out;
    });
    plan.push({ op: 'Project', detail: columns.join(', '), rows: output.length });
  }

  if (query.limit !== undefined) {
    output = output.slice(0, query.limit);
    plan.push({ op: 'Limit', detail: String(query.limit), rows: output.length });
  }

  const finalColumns = output.length > 0 ? Object.keys(output[0]) : columns;
  return { columns: finalColumns, rows: output, plan };
}

export function run(sql: string, tables: Record<string, Row[]>): Result & { tokens: Token[] } {
  const { query, tokens } = parse(sql);
  return { ...execute(query, tables), tokens };
}
