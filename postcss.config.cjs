module.exports = {
  // Usar a versão PostCSS plugin separada para esta versão do Tailwind
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}
