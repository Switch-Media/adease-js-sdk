const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const version = fs.readFileSync(path.join('.', 'VERSION')).toString();

// Recommended option from babeljs.io/env
const babelOptions = {
  presets: ['env']
};

module.exports = {
  mode: 'production',

  entry: './src/index.ts',
  // Useful for development in downstream projects, should be stripped for production.
  devtool: 'source-map',
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
    extensions: ['.ts', '.js']
  },
  externals: ['immutable', 'query-string'],
  // Authored as a UMD library with the name 'adease'.
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'adease',
    libraryTarget: 'umd',
    umdNamedDefine: true,
 		globalObject: "typeof self !== 'undefined' ? self : this"
  },

  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version.trim())
    })
  ]
};
