const server = require('./server');

const port = (process.env.PORT || 3000);

server.listen(port);
console.log(`Listening at http://localhost:${port}`);

if (process.env.NODE_ENV !== 'production') {
  var config = require('./webpack.dev.config');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  new WebpackDevServer(webpack(config), {
    publicPath: "/bin/", 
    hot: true,
    colors: true,
    inline: true,
    proxy: {'/socket.io': {
        target: 'http://localhost:3000',
        secure: false
      }
    },
    historyApiFallback: true
  }).listen(3001, 'localhost',  (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('Dev Server listening at http://localhost:3001/');
  });
}