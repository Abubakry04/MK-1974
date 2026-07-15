/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: '#8B8074',
        'lime-dim': '#6C6258',
        dark: '#1C1C1C',
        surface: '#F8F7F4',
        surface2: '#EFECE7',
        cream: '#FDFCFB',
        muted: '#8A8681',
        'muted-light': '#C1BFBA',
        onlight: '#1A1A1A',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
