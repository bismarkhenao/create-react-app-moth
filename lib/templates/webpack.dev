/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config');

const development = {
  mode: 'development',
  devServer: {
    open: true,
    hot: true,
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = merge(config, development);
