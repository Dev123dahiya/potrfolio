/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        base: '#0B0F1A',
        panel: '#111726',
        line: '#1E2637',
        accent: '#5B8DEF',
        accent2: '#7C5CFC',
        ink: '#E6EAF2',
        muted: '#93A0B5',
      },
      boxShadow: { glow: '0 0 60px -15px rgba(91,141,239,0.45)' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: { float: 'float 6s ease-in-out infinite' },
    },
  },
  plugins: [],
};
