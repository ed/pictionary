var webpack = require('webpack');

module.exports = {
    devtool: 'eval',
    entry: [
        __dirname + '/public/main',
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server'
    ],
    output: {
        path: __dirname + '/bin',
        filename: 'bundle.js',
        publicPath: '/public/'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
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
