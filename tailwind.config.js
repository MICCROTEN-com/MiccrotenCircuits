/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6e9f0',
          100: '#c1c9de',
          200: '#9aa8cc',
          300: '#7387ba',
          400: '#566fad',
          500: '#3a57a0',
          600: '#334f98',
          700: '#2a448e',
          800: '#223a84',
          900: '#132873',
        },
        slate: {
          850: '#1a202e',
        },
        orange: {
          500: '#ff6b35',
          600: '#e85a2a',
        }
      }
    },
  },
  plugins: [],
};
