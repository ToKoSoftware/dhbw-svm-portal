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
        smalt: {
          '50': '#f2f5f9',
          '100': '#e6eaf4',
          '200': '#c0cce3',
          '300': '#9badd3',
          '400': '#4f6fb1',
          '500': '#043190',
          '600': '#042c82',
          '700': '#03256c',
          '800': '#021d56',
          '900': '#021847'
        },
      },
    }
  },
  darkMode: 'media',
  purge: {
    enabled: false,
    content: ['./src/**/*.html', './src/**/*.ts'],
  },
}
