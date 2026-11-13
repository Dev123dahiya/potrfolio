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
        paper: '#F3F5F8',
        surface: '#FFFFFF',
        ink: '#0E1A2B',
        muted: '#53647B',
        line: '#D9E0E8',
        signal: '#0B7F72',
        signalSoft: '#DDF1EE',
        cobalt: '#2B55D6',
        night: '#0B1526',
        nightLine: '#1D2B44',
      },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [],
};
