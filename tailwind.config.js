/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f0f0f',
        elevated: '#1a1a1a',
        soft: '#242424',
        hover: '#2e2e2e',
        primary: '#9b8afb',
        success: '#86d99c',
        warning: '#f2c94c',
        danger: '#f28b82',
        info: '#8cc8ff',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}
