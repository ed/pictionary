'use strict'

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
var server = require('http').Server(app);

const indexPath = path.join(__dirname, '/index.html')
const publicPath = express.static(path.join(__dirname, '/bin'))

var io = require('socket.io')(server);

server.listen(3000);

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
    socket.on('add user', function(username) {
        console.log(username + ' has connected');
    });
    socket.on('disconnect', function(username) {
        console.log(username + ' has disconnected');
    });
});

// new WebpackDevServer(webpack(config), {
//     hot: true,
//     colors: true,
//     inline: true,
//     proxy: {'**': 'http://localhost:3001'},
//     historyApiFallback: true
// }).listen(3000, 'localhost', function (err, result) {
//     if (err) {
//         return console.log(err);
//     }
//     console.log('Listening at http://localhost:3000/');
// });
