const server = require('./src/backend/server');


const port = (process.env.PORT || 3000);

server.listen(port);

console.log(`Listening at http://localhost:${port}`);
console.log(`RUNNIN JS DEV SERVER ${process.env.NODE_ENV}`);

//DATABASE_URL=$(heroku config:get DATABASE_URL -a afternoon-citadel-52337) npm start

if (process.env.NODE_ENV !== 'production') {
  var config = require('./webpack.dev.config');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  new WebpackDevServer(webpack(config), {
    publicPath: "/bin/",
    hot: true,
    inline: true,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/signup': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/login': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/logout': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/whoami': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/room/**': {
        target: 'http://localhost:3000',
        secure: false
      },
      '/tempUserInfo': {
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
