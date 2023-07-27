const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  devServer: {
    static: [
      {
        directory: path.join(__dirname),
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // regex to match all the ts files
        use: 'ts-loader',
        exclude: /node_modules/, // EXCLUDE node_modules
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'], // bundle all the ts and js files
  },
};