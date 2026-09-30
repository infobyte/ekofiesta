import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        eko: {
          50: '#faf7f0',
          100: '#f3ede0',
          200: '#e8dcc6',
          300: '#dcc4a1',
          400: '#d4a876',
          500: '#c98d4b',
          600: '#b37534',
          700: '#8f5a2a',
          800: '#744726',
          900: '#613a22',
        },
      },
    },
  },
  plugins: [],
}
export default config
