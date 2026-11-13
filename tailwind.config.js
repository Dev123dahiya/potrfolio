/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
        nav: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        tint: 'rgb(var(--tint) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        onInk: 'rgb(var(--on-ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        signal: 'rgb(var(--signal) / <alpha-value>)',
        signalSoft: 'rgb(var(--signal-soft) / <alpha-value>)',
        cobalt: 'rgb(var(--cobalt) / <alpha-value>)',
        amber: 'rgb(var(--amber) / <alpha-value>)',
        violet: 'rgb(var(--violet) / <alpha-value>)',
        night: '#0A0D10',
        nightLine: '#252D34',
      },
      maxWidth: { page: '72rem' },
      boxShadow: {
        card: '0 3px 20px -2px rgb(0 0 0 / 0.1)',
        cardHover: '0 14px 34px -10px rgb(0 0 0 / 0.22)',
        box: '5px 5px 15px rgb(0 0 0 / 0.2)',
        header: '0 0 30px 10px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
