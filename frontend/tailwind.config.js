/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12161F',       // app background
        surface: '#1B212C',   // card / panel background
        surfaceRaised: '#232A36',
        border: '#2C3441',
        text: {
          primary: '#EDEFF3',
          muted: '#8A93A3',
          faint: '#5B6473',
        },
        rail: {
          applied: '#5B8CFF',
          interview: '#E8A33D',
          offer: '#3FA796',
          rejected: '#D1495B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        xl: '14px',
      },
    },
  },
  plugins: [],
}
