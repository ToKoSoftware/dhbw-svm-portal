const colors = require('tailwindcss/colors')

module.exports = {
  plugins: [
    require('@tailwindcss/ui'),
  ],
  theme: {
    extend: {
      colors: {
        malachite: {
          '50': '#f4fdf7',
          '100': '#e8fbf0',
          '200': '#c6f5d9',
          '300': '#a4eec2',
          '400': '#5fe294',
          '500': '#1bd566',
          '600': '#18c05c',
          '700': '#14a04d',
          '800': '#10803d',
          '900': '#0d6832'
        },
      },
    }
  },
  darkMode: 'media',
  purge: {
    enabled: true,
    content: ['./src/**/*.html', './src/**/*.ts'],
  },
}
