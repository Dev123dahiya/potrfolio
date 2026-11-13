/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', '"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        onInk: 'rgb(var(--on-ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
        signalSoft: 'rgb(var(--signal-soft) / <alpha-value>)',
        cobalt: 'rgb(var(--cobalt) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        violet: 'rgb(var(--violet) / <alpha-value>)',
        night: '#0B1526',
        nightLine: '#1D2B44',
      },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [],
};
