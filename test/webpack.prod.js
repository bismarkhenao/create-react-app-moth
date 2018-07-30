/* eslint-disable import/no-extraneous-dependencies */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.config');

const production = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'public')),
  ],
};

module.exports = merge(config, production);
