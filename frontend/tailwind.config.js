/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',
        'secondary': '#1F2937',
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
