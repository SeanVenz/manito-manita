/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        spinner: {
          to: {
            transform: 'rotate(1turn)',
          },
        },
      },
      animation: {
        spinner: 'spinner 1s linear infinite',
      },
      colors: {
        d5b1b1: '#d5b1b1',
        e2003c: '#e2003c',
      },
    },
  },
  plugins: [],
}
