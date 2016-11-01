var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval',

    entry: [
        './src/main',
        'webpack-dev-server/client?http://localhost:3001/',
        'webpack/hot/only-dev-server'
    ],

    output: {
        path: path.join(__dirname, 'bin'),
        publicPath: 'http://localhost:3001/bin/',
        filename: 'bundle.js',
    },

    resolve: {
        extensions: ['', '.js', '.jsx'],
        root: [
          path.resolve('./src')
        ]
    },

    module: {
        loaders:[
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel' , presets:[ 'es2015', 'react', 'stage-2' ] },
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/, loader: 'url-loader?limit=100000' },
            { test: /\.(wav|mp3)$/,
              loader: 'file?hash=sha512&digest=hex&name=[hash].[ext]' },
            { test: /\.scss?$/,
              loader: 'style!css!sass',
              include: path.join(__dirname, 'src', 'styles')
            },
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
}
