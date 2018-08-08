// Server Webpack Config
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  target: 'node',
  node: {
    __dirname: false
  },
  entry: {
    server: path.resolve(__dirname, 'src/main.js')
  },
  output: {
    path: path.join(__dirname),
    filename: '[name].app.js'
  },
  externals: nodeModules,
  devtool: 'inline-source-map',
  mode: 'development',
  watch: true
};