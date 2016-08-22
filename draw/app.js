import Koa from 'koa'
const app = new Koa()
var send = require('koa-send');
var router = require('./routes');
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);


app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    await send(ctx, ctx.path, { root: __dirname + '/public' });
})

io.on('connection', function(socket){ 
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
server.listen(3000, () => console.log('server started 3000'))
