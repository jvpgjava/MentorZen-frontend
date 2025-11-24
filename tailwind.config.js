/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5EFE9',
          100: '#E8E0D8',
          200: '#D4C4B4',
          300: '#C7D882',
          400: '#A8B96F',
          500: '#C7D882',
          600: '#A8B96F',
          700: '#90A7B0',
          800: '#7A8F97',
          900: '#162A41',
          950: '#0F1A2A'
        },
        zen: {
          primary: '#C7D882',
          secondary: '#90A7B0',
          accent: '#F5EFE9',
          dark: '#162A41',
          black: '#1a1a1a',
          'gray-dark': '#2d2d2d',
          white: '#ffffff',
          'gray-light': '#F5EFE9'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'zen': '0 4px 20px rgba(16, 185, 129, 0.1)',
        'zen-lg': '0 8px 40px rgba(16, 185, 129, 0.15)'
      }
    },
  },
  plugins: [],
}

