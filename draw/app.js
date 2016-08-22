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
        io.emit('chat message', msg);
    });
});

server.listen(3000, () => console.log('server started 3000'))
