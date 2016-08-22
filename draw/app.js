import Koa from 'koa'
const app = new Koa()
var path = require('path');
var fs = require('fs');
var send = require('koa-send');

var io = require('socket.io')(app);

app.use(async (ctx) => {
    ctx.body = fs.createReadStream(path.join(__dirname, 'public/draw.html'));
    ctx.type = 'html';
    await send(ctx, ctx.path, { root: __dirname + '/public' });
})

io.on('connection', function(socket) {
    socket.on('adduser', function(username) {
        console.log(username + ' has connected');
    });
    socket.on('send msg', function(msg){
        io.emit('get msg', msg);
    });
    socket.on('disconnect', function(username) {
        console.log(username + ' has disconnected');
    });
});

app.listen(3000, () => console.log('server started 3000'))
