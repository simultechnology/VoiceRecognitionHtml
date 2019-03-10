module.exports = {
  entry: {
    app: './src/js/app.js',
    app2: './src/js/app2.js'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.gif|png|jpg|eot|wof|woff|ttf|svg$/,
        use: ['url-loader']
      }
    ]
  },
  mode: 'development',
  watch: true,
  devtool: 'source-map'
}
