var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
fs = require('fs');

// to test whiteboard
// index = fs.readFileSync(__dirname + '/index.html');
// also in webpack.config.js change /public/main to /src/main
// to test chat 
index = fs.readFileSync(__dirname + '/public/chat.html');

var http = require('http').createServer(function(req, res) {
    if (req.url == '/') {
        res.writeHeader(200);  
        res.end(index);
    }
    else {
        fs.readFile(__dirname + '/public' + req.url, function (err,data) {
            if (!err) {
                res.writeHeader(200);  
                res.end(data);
            }
        });
    }
}).listen(3001);

var io = require('socket.io').listen(http);

io.on('connection', function(socket){ 

    socket.on('subscribe', function(id) {
        console.log('id: ', id);
        socket.join(id);
    });
    socket.on('chat message', function(msg) {
        socket.broadcast.emit('chat message', {
            username: socket.username,
            message: msg
        });
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
