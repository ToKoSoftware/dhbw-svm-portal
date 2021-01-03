// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/ui'),
  ],
  purge: {
    enabled: false,
    content: ['./src/**/*.html', './src/**/*.ts'],
  },
  // ...
}
