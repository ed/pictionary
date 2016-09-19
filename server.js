'use strict'

  /*
   *   Run 'npm run build' to run production envioronment
   */

const port = (process.env.PORT || 3000);
const express = require('express');
const app = express();
const path = require('path');
var server = require('http').Server(app);

const indexPath = path.join(__dirname, '/index.html')
const publicPath = express.static(path.join(__dirname, '/bin'))

var io = require('socket.io')(server);  

server.listen(port);
console.log(`Listening at http://localhost:${port}`)

let clients = [];
let words = ['white ferrari', 'whale', 'guitar', 'television', 'kanye west', 'yeezus', 'blonde', 'harambe', 'bread', 'dwight schrute', 'water bottle', 'smoothie', 'sofa', 'smoke', 'menage on my birthday', 'sailing stock', 'kpop', 'bubble pop', 'bubble gum', 'naps']
global.gaming = false;

app.use('/bin', publicPath)
app.get('/', function (_, res) { res.sendFile(indexPath) })

io.on('connection', function(socket){ 
  socket.on('subscribe', (id) => {
    console.log('id: ', id);
    socket.room = id;
    socket.join(id);
  });
  socket.on('chat msg', function(msg) {
    console.log(`${socket.user} sent ${msg.text} to thread: ${msg.threadID}`);
    io.sockets.in(msg.threadID).emit('update', msg);
  });
  socket.on('new stroke', function(stroke) {
    socket.broadcast.to(stroke.threadID).emit('update canvas', stroke.canvas);
  });

  socket.on('undo stroke', function(position) {
    socket.broadcast.emit('undo');
  });

  socket.on('clear all', function(position) {
    socket.broadcast.emit('clear');
  });
  socket.on('redo stroke', function() {
    socket.broadcast.emit('redo');
  });

  socket.on('winner', function(guesser) {
    socket.broadcast.emit('congrats', guesser)
    socket.emit('start game')
  })

  socket.on('start game', function() {
    if (global.gaming == false) {
      global.gaming = true;
      console.log('game is starting, users:', clients)
      dmtLoop();
      clearInterval(dmtLoop);
      setInterval(dmtLoop, 60000);
    }
  });

  socket.on('add user', function(username) {
    console.log(username + ' has connected');
    socket.user = username;
    clients.push({id: socket.id, user:username})
  });
});

function dmtLoop() {
  try{
    endGame();
    let artist = clients[Math.floor(Math.random()*clients.length)+0].user;
    let word = words[Math.floor(Math.random()*words.length)+0];
    const payload =
      {
        user: artist,
        word: word,
      }
    io.sockets.emit('artist', payload);
    console.log(`${artist} is drawing ${word}`);
  }
  catch(e) {
    console.log(e)
  }
}

function endGame() {
  if (clients.length == 0) {
    clearInterval(dmtLogic);
    io.sockets.emit('game over')
    global.gaming = false;
    console.log('game has ended', clients)
  }
}

  /*
   *   Run 'webpack --config webpack.dev.config' for dev mode
   */

if (process.env.NODE_ENV !== 'production') {
  var config = require('./webpack.dev.config');
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  new WebpackDevServer(webpack(config), {
    publicPath: "/bin/", 
    hot: true,
    colors: true,
    inline: true,
    proxy: {'/socket': {
        target: 'http://localhost:3000',
        secure: false
      }
    },
    historyApiFallback: true
  }).listen(3001, 'localhost', function (err, result) {
    if (err) {
      return console.log(err);
    }
    console.log('Dev Server listening at http://localhost:3001/');
  });
}
