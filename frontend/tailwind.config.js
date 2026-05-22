/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f1117',
        surface: '#181c27',
        surface2: '#1e2335',
        border: '#2a2f45',
        accent: '#6c63ff',
        accent2: '#00d4aa',
        danger: '#ff5f6d',
        warn: '#ffc857',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}