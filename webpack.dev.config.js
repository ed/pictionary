var webpack = require('webpack')
var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  entry: [
    './src/main',
    'webpack-dev-server/client?http://localhost:3001/',
    'webpack/hot/only-dev-server'
  ],

  output: {
    path: path.join(__dirname, 'bin'),
    publicPath: 'http://localhost:3001/bin/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    roots: [path.resolve('./src')]
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // instead of style-loader
          'css-loader'
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(ico|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: '[hash].[ext]',
              digestType: 'hex',
              hashType: 'sha512'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}
