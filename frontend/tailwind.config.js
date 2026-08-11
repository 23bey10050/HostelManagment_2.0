/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary': '#3B82F6',
        'secondary': '#1F2937',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-border': '#334155',
        'dark-text': '#f8fafc',
        'dark-muted': '#94a3b8'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border)-(red|green|blue|yellow|gray)-(100|500|600|700|800)/,
    },
    {
      pattern: /grid-cols-(1|2|3|4)/,
    },
    {
      pattern: /(p|m|gap)-(1|2|3|4|5|6|8)/,
    }
  ]
}
