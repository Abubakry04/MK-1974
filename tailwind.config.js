/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: '#000000',
        'lime-dim': '#333338',
        dark: '#eae6df',
        surface: '#ffffff',
        surface2: '#f5f2ed',
        cream: '#1a1a1f',
        muted: '#5e5e66',
        'muted-light': '#82828c',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
