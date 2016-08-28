'use strict'

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const fs = require('fs');

// to test whiteboard
// index = fs.readFileSync(__dirname + '/index.html');
// also in webpack.config.js change /public/main to /src/main
// to test chat
let index = fs.readFileSync(__dirname + '/index.html');

let http = require('http').createServer(function(req, res) {
    res.writeHeader(200);  
    res.end(index);
}).listen(3001);

var io = require('socket.io').listen(http);

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

new WebpackDevServer(webpack(config), {
    hot: true,
    colors: true,
    inline: true,
    proxy: {'**': 'http://localhost:3001'},
    historyApiFallback: true
}).listen(3000, 'localhost', function (err, result) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://localhost:3000/');
});
