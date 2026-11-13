import { useMemo, useState } from 'react';
import { DemoNote, Slider, Stat } from './ui';

/**
 * The accuracy-versus-work trade-off from `vector-search-engine`, computed
 * live: a navigable small-world graph searched greedily against an exact
 * brute-force baseline over the same vectors.
 *
 * The dataset is smaller than the repo's 20,000 x 64 benchmark so it can be
 * rebuilt in the browser on every slider move; the shape of the curve is the
 * same, and the recall is measured here rather than quoted.
 */

const DIMS = 16;

/** A seeded generator, so the same settings always give the same dataset. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalise(v: Float32Array): Float32Array {
  let norm = 0;
  for (const x of v) norm += x * x;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < v.length; i += 1) v[i] /= norm;
  return v;
}

/** Cosine similarity on normalised vectors is just the dot product. */
function dot(a: Float32Array, b: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += a[i] * b[i];
  return sum;
}

/** Clustered vectors, which is how real embeddings are distributed. */
function buildDataset(count: number, clusters: number, seed: number) {
  const rand = mulberry32(seed);
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  };
  const centres = Array.from({ length: clusters }, () =>
    normalise(Float32Array.from({ length: DIMS }, gauss)),
  );
  return Array.from({ length: count }, (_, i) => {
    const centre = centres[i % clusters];
    const v = new Float32Array(DIMS);
    for (let d = 0; d < DIMS; d += 1) v[d] = centre[d] + gauss() * 0.35;
    return normalise(v);
  });
}

/** A k-nearest-neighbour graph: each node linked to its closest neighbours. */
function buildGraph(vectors: Float32Array[], degree: number): number[][] {
  return vectors.map((v, i) => {
    const scored = vectors.map((o, j) => ({ j, s: i === j ? -Infinity : dot(v, o) }));
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, degree).map((x) => x.j);
  });
}

/**
 * Greedy best-first search over the graph, keeping `ef` candidates in flight.
 * A larger ef explores more of the graph, so recall rises and the number of
 * vectors compared rises with it. That trade is the whole point.
 */
function search(
  vectors: Float32Array[],
  graph: number[][],
  query: Float32Array,
  k: number,
  ef: number,
  entry: number,
) {
  const visited = new Set<number>([entry]);
  let comparisons = 1;
  let candidates = [{ i: entry, s: dot(query, vectors[entry]) }];
  let best = [...candidates];

  while (candidates.length > 0) {
    candidates.sort((a, b) => b.s - a.s);
    const current = candidates.shift()!;
    const worstBest = best.length >= ef ? best[best.length - 1].s : -Infinity;
    if (current.s < worstBest && best.length >= ef) break;

    for (const n of graph[current.i]) {
      if (visited.has(n)) continue;
      visited.add(n);
      const s = dot(query, vectors[n]);
      comparisons += 1;
      if (best.length < ef || s > best[best.length - 1].s) {
        candidates.push({ i: n, s });
        best.push({ i: n, s });
        best.sort((a, b) => b.s - a.s);
        if (best.length > ef) best.pop();
      }
    }
  }
  return { ids: best.slice(0, k).map((b) => b.i), comparisons };
}

function exactSearch(vectors: Float32Array[], query: Float32Array, k: number) {
  const scored = vectors.map((v, i) => ({ i, s: dot(query, v) }));
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, k).map((x) => x.i);
}

export default function VectorSearch() {
  const [count, setCount] = useState(1500);
  const [ef, setEf] = useState(20);
  const k = 10;

  const data = useMemo(() => {
    const vectors = buildDataset(count, 12, 42);
    const graph = buildGraph(vectors, 12);
    const queries = buildDataset(60, 12, 7);

    let recallSum = 0;
    let comparisonSum = 0;
    let approxMs = 0;
    let exactMs = 0;

    const t0 = performance.now();
    const exact = queries.map((q) => exactSearch(vectors, q, k));
    exactMs = performance.now() - t0;

    const t1 = performance.now();
    queries.forEach((q, qi) => {
      const got = search(vectors, graph, q, k, ef, 0);
      comparisonSum += got.comparisons;
      const truth = new Set(exact[qi]);
      recallSum += got.ids.filter((id) => truth.has(id)).length / k;
    });
    approxMs = performance.now() - t1;

    return {
      recall: recallSum / queries.length,
      comparisons: comparisonSum / queries.length,
      share: comparisonSum / queries.length / vectors.length,
      exactMs,
      approxMs,
      vectors,
      queries,
      exact,
      graph,
    };
  }, [count, ef]);

  // A 2D view of one query and its neighbourhood. The two axes are the
  // directions of greatest spread in the sample, found by power iteration —
  // a two-component PCA, so the clusters separate instead of collapsing into
  // a blob the way raw dimensions 0 and 1 do.
  const plot = useMemo(() => {
    const q = data.queries[0];
    const found = search(data.vectors, data.graph, q, k, ef, 0);
    const ids = new Set(found.ids);

    // Sample widely, then make sure every returned neighbour is drawn even if
    // it falls outside the sample.
    const sampleIds = new Set<number>();
    const stride = Math.max(1, Math.floor(data.vectors.length / 500));
    for (let i = 0; i < data.vectors.length; i += stride) sampleIds.add(i);
    for (const id of ids) sampleIds.add(id);
    const indices = [...sampleIds];

    const mean = new Float32Array(DIMS);
    for (const i of indices) for (let d = 0; d < DIMS; d += 1) mean[d] += data.vectors[i][d];
    for (let d = 0; d < DIMS; d += 1) mean[d] /= indices.length;

    const centred = indices.map((i) => {
      const v = new Float32Array(DIMS);
      for (let d = 0; d < DIMS; d += 1) v[d] = data.vectors[i][d] - mean[d];
      return v;
    });

    // Power iteration against the covariance, deflating after the first axis.
    const axis = (exclude: Float32Array | null): Float32Array => {
      let v: Float32Array = new Float32Array(DIMS);
      v.fill(1 / Math.sqrt(DIMS));
      for (let step = 0; step < 24; step += 1) {
        const next = new Float32Array(DIMS);
        for (const c of centred) {
          const proj = dot(c, v);
          for (let d = 0; d < DIMS; d += 1) next[d] += proj * c[d];
        }
        if (exclude) {
          const overlap = dot(next, exclude);
          for (let d = 0; d < DIMS; d += 1) next[d] -= overlap * exclude[d];
        }
        v = normalise(next);
      }
      return v;
    };
    const ax = axis(null);
    const ay = axis(ax);

    const project = (v: Float32Array) => {
      const c = new Float32Array(DIMS);
      for (let d = 0; d < DIMS; d += 1) c[d] = v[d] - mean[d];
      return { x: dot(c, ax), y: dot(c, ay) };
    };

    const points = indices.map((i) => ({ ...project(data.vectors[i]), hit: ids.has(i) }));
    const query = project(q);

    // Fit everything into a 0–100 box with a margin, so the view fills the
    // frame whatever the spread happens to be.
    const xs = [...points.map((p) => p.x), query.x];
    const ys = [...points.map((p) => p.y), query.y];
    const span = (arr: number[]) => {
      const lo = Math.min(...arr);
      const hi = Math.max(...arr);
      return { lo, range: hi - lo || 1 };
    };
    const sx = span(xs);
    const sy = span(ys);
    const fit = (p: { x: number; y: number }) => ({
      x: 6 + ((p.x - sx.lo) / sx.range) * 88,
      y: 94 - ((p.y - sy.lo) / sy.range) * 88,
    });

    return {
      points: points.map((p) => ({ ...fit(p), hit: p.hit })),
      query: fit(query),
      comparisons: found.comparisons,
    };
  }, [data, ef]);

  return (
    <div className="space-y-4">
      <DemoNote kind="live">
        {count.toLocaleString()} vectors in {DIMS} dimensions are generated, indexed into a
        navigable graph and searched in this page. Recall is measured against an exact brute-force
        scan of the same vectors, not quoted.
      </DemoNote>

      <div className="grid gap-4 sm:grid-cols-2">
        <Slider label="Vectors in the index" value={count} min={400} max={3000} step={100} onChange={setCount} />
        <Slider
          label="ef — candidates kept in flight"
          value={ef}
          min={10}
          max={120}
          step={5}
          onChange={setEf}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-4">
        <Stat label="Recall@10" value={data.recall.toFixed(3)} tone={data.recall > 0.95 ? 'good' : undefined} />
        <Stat label="Vectors compared" value={Math.round(data.comparisons).toLocaleString()} />
        <Stat label="Share of index" value={`${(data.share * 100).toFixed(1)}%`} tone="good" />
        <Stat label="Speed-up vs exact" value={`${(data.exactMs / Math.max(data.approxMs, 0.001)).toFixed(1)}x`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.05fr]">
        <div className="min-w-0">
          <svg
            viewBox="0 0 100 78"
            className="w-full rounded-[8px] border border-line bg-base"
            role="img"
            aria-label={`Two-component projection of the vectors, with the ${k} nearest neighbours of one query highlighted`}
          >
            {/* Non-matches first, so the highlighted neighbours draw on top. */}
            {plot.points
              .filter((p) => !p.hit)
              .map((p, i) => (
                <circle key={`o${i}`} cx={p.x} cy={p.y * 0.78} r={0.7} className="fill-current text-muted/25" />
              ))}
            <circle
              cx={plot.query.x}
              cy={plot.query.y * 0.78}
              r={4}
              className="fill-none stroke-amber"
              strokeWidth={0.4}
            />
            {plot.points
              .filter((p) => p.hit)
              .map((p, i) => (
                <circle key={`h${i}`} cx={p.x} cy={p.y * 0.78} r={1.5} className="fill-signal" />
              ))}
            <circle cx={plot.query.x} cy={plot.query.y * 0.78} r={1.9} className="fill-amber" />
          </svg>
          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.74rem] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber" /> query
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-signal" /> returned neighbours
            </span>
            <span className="ml-auto">{plot.comparisons} vectors compared for this query</span>
          </p>
        </div>

        <div className="space-y-3 text-[0.9rem] leading-relaxed text-muted">
          <p>
            Each dot is a vector, projected onto the two directions of greatest spread. The amber
            point is a query; the teal points are the {k} nearest neighbours the graph search
            returned for it. Some of them look far away, because {DIMS} dimensions do not fit on a
            page — they are close in the space the search actually works in, not in this picture.
          </p>
          <p>
            Raise <span className="font-mono text-ink">ef</span> and the search keeps more
            candidates alive, so it follows more edges, compares more vectors and finds more of the
            true top {k}. Lower it and the search gets cheaper and starts missing. There is no
            setting that is free: the curve between them is the design decision.
          </p>
          <p>
            Exact search compares every vector, so its recall is 1.000 by definition. The graph
            reaches {data.recall.toFixed(3)} while touching {(data.share * 100).toFixed(1)}% of the
            index.
          </p>
        </div>
      </div>
    </div>
  );
}
