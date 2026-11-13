import { lazy, type LazyExoticComponent } from 'react';

/**
 * Which projects have a demo, and what kind.
 *
 * `live` means the algorithm itself is running in the page on the visitor's
 * input. Nothing here claims to be running a project that cannot run in a
 * browser: a Kubernetes rollout or a trained audio model is measured in its
 * repo's CI, and the README is where those numbers belong.
 *
 * Each demo is loaded on demand, so a visitor who never opens one never
 * downloads one.
 */
export interface Demo {
  /** Button label in the dialog. */
  title: string;
  /** One line explaining what the demo lets you do. */
  blurb: string;
  Component: LazyExoticComponent<() => JSX.Element>;
}

export const demos: Record<string, Demo> = {
  'Mini SQL Engine': {
    title: 'Run a query',
    blurb: 'Type SQL and watch the lexer, planner and executor work on two real tables.',
    Component: lazy(() => import('./MiniSql')),
  },
  'Rate Limiter Lab': {
    title: 'Race the four algorithms',
    blurb: 'Send adversarial burst traffic at all four limiters at once and see which one breaks.',
    Component: lazy(() => import('./RateLimiter')),
  },
  'Vector Search Engine': {
    title: 'Trade recall for work',
    blurb: 'Build an index in the page and measure recall against an exact scan of the same vectors.',
    Component: lazy(() => import('./VectorSearch')),
  },
  'Secret Scanner': {
    title: 'Scan some text',
    blurb: 'Run the detection rules and the entropy gate on anything you paste in.',
    Component: lazy(() => import('./SecretScanner')),
  },
  'Stream Windowing Engine': {
    title: 'Window a live stream',
    blurb: 'Switch between tumbling, sliding and session windows and watch late events arrive.',
    Component: lazy(() => import('./StreamWindows')),
  },
  'Event-Sourced Ledger': {
    title: 'Post a transaction',
    blurb: 'Append events, replay the log to any point, and try to break the balance.',
    Component: lazy(() => import('./Ledger')),
  },
  'LLM Gateway': {
    title: 'Break a provider',
    blurb: 'Take the provider down and watch the circuit breaker open, cool down and recover.',
    Component: lazy(() => import('./CircuitBreaker')),
  },
  'URL Shortener Service': {
    title: 'Mint some IDs',
    blurb: 'Generate Snowflake IDs across several machines at once and decode them back.',
    Component: lazy(() => import('./ShortCode')),
  },
};

export const hasDemo = (name: string) => name in demos;
