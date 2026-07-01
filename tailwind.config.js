/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: '#c8f542',
        'lime-dim': '#aed630',
        dark: '#0c0c0c',
        surface: '#141414',
        surface2: '#1c1c1c',
        cream: '#e8e4de',
        muted: '#6b6b6b',
        'muted-light': '#999',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
