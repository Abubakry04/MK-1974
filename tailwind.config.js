/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#8B8074',
        'accent-dark': '#6C6258',
        dark: '#111111',
        surface: '#F7F6F3',
        surface2: '#EFECE7',
        cream: '#FDFCFB',
        muted: '#8A8681',
        'muted-light': '#C1BFBA',
        onlight: '#1A1A1A',
        // keep 'lime' alias so old components don't break
        lime: '#8B8074',
        'lime-dim': '#6C6258',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}