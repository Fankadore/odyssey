// Client Webpack Config

module.exports = {
  entry: {
    client: './client/src/main.js',
  },
  output: {
    path: __dirname,
    filename: '[name].app.js'
  },
  devtool: 'inline-source-map',
  mode: 'development',
  watch: true
};
