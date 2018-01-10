const path = require('path');

// Recommended option from babeljs.io/env
const babelOptions = {
  presets: ['env']
};

module.exports = {
  entry: './src/index.ts',
  // Useful for development in downstream projects, should be stripped for production.
  devtool: 'inline-source-map',
  // Compile typescript, then apply babel to increase compatability across browser environments.
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: 'ts-loader'
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  // Authored as a UMD library with the name 'adease'.
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'adease',
    libraryTarget: 'umd'
  }
};