/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: '#968574',
        'lime-dim': '#76685A',
        dark: '#1E1F21',
        surface: '#FAF9F6',
        surface2: '#EAE6DF',
        cream: '#FAF9F6',
        muted: '#7A756D',
        'muted-light': '#B2ACA3',
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
