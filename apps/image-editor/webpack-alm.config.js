/**
 * @file webpack-alm.config.js, config file for our custom build of this package.
 * @copyright 2016-2021 Perforce Software, Inc. and its subsidiaries.
 * Released under MIT License.
 */

const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.argv.indexOf('-p') > -1;

const FILENAME = pkg.name + (isProduction ? '.min' : '');
const BANNER = [
  `${FILENAME}.js`,
  `@version ${pkg.version}`,
  `@author ${pkg.author}`,
  `@license ${pkg.license}`,
].join('\n');

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    library: ['tui', 'ImageEditor'],
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
    filename: `${FILENAME}.js`,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/js/'),
      '@svg': path.resolve(__dirname, 'src/svg/'),
      fabric: 'fabric-pure-browser',
    },
  },
  externals: [
    {
      fabric: {
        commonjs: ['fabric', 'fabric'],
        commonjs2: ['fabric', 'fabric'],
        amd: 'fabric',
        root: 'fabric',
      },
    },
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          failOnWarning: false,
          failOnError: false,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory',
        options: {
          babelrc: true,
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
  plugins: [new webpack.BannerPlugin(BANNER)],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
    ],
  },
  devServer: {
    historyApiFallback: false,
    progress: true,
    inline: true,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  devtool: 'source-map',
};
