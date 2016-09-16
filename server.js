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

app.use('/bin', publicPath)
app.get('/', function (_, res) { res.sendFile(indexPath) })

io.on('connection', function(socket){ 
    socket.on('subscribe', function(id) {
        console.log('id: ', id);
        socket.join(id);
    });
    socket.on('chat msg', function(msg) {
        console.log('msg', msg)
        socket.broadcast.to(msg.threadID).emit('update', msg);
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

    socket.on('add user', function(username) {
        console.log(username + ' has connected');
    });
    socket.on('disconnect', function(username) {
        console.log(username + ' has disconnected');
    });
});


/*
*   Run 'webpack --config webpack.dev.config' for dev mode
*/

if (process.env.NODE_ENV !== 'production') {
    var config = require('./webpack.dev.config');
    var webpack = require('webpack');
    var WebpackDevServer = require('webpack-dev-server');
    new WebpackDevServer(webpack(config), {
        hot: true,
        colors: true,
        inline: true,
        proxy: {'**': 'http://localhost:3000'},
        historyApiFallback: true
    }).listen(3001, 'localhost', function (err, result) {
        if (err) {
            return console.log(err);
        }
        console.log('Dev Server listening at http://localhost:3001/');
    });
}
