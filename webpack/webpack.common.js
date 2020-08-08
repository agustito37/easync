const Path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ],
  resolve: {
    alias: {
      '@components': Path.resolve(__dirname, '../src/components'),
      '@core': Path.resolve(__dirname, '../src/core'),
      '@platform': Path.resolve(__dirname, '../src/platform'),
      '@utils': Path.resolve(__dirname, '../src/utils')
    },
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      }
    ],
  },
};
