var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval',

    entry: [
        './src/main',
        'webpack-dev-server/client?http://localhost:3001',
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
            { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.css$/, loader: 'style!css' }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
}
