const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './', // Вказує на відносний шлях, щоб сайт працював без сервера
  outputDir: 'dist', // Каталог для згенерованих файлів
  transpileDependencies: true
})
