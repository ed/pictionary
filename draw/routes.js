var router = require('koa-router')();
var fs = require('fs');
var path = require('path');

router.get('/', function (ctx,next) {
    ctx.body = fs.createReadStream(path.join(__dirname, 'public/draw.html'));
    ctx.type = 'html';
});

router.get('/chat', function (ctx,next) {
    ctx.body = fs.createReadStream(path.join(__dirname, 'public/chat.html'));
    ctx.type = 'html';
});


module.exports = router;
