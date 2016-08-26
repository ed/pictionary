var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        __dirname + '/src/main',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    ],
    output: {
        path: __dirname + '/bin',
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
        new webpack.HotModuleReplacementPlugin()
    ]
}
