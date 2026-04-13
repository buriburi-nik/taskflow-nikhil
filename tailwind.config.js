/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['Space Mono', 'Courier New', 'monospace'],
        display: ['VT323', 'Space Mono', 'monospace'],
      },
      colors: {
        cream:  '#f5efcb',
        'cream-dark': '#ede5b0',
        retro: {
          purple: '#7b35a8',
          'purple-dark': '#5a2080',
          pink:   '#e8479e',
          green:  '#7fc241',
          'green-dark': '#5a9430',
          yellow: '#f4c430',
          dark:   '#1c1422',
          gray:   '#c8c0a8',
          white:  '#fffdf0',
        },
      },
    },
  },
  plugins: [],
}
